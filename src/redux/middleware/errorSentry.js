import clientStorage from '../helpers/clientStorage';
import fetch from 'isomorphic-fetch';
import { DOMAIN } from '../../../config';
import { request } from '../helpers/request';

const defaultSentryAPIAddress = DOMAIN + '/report-error';

const resetErrorCount = (key, reportData) => {
  reportData.count = 1;
  reportData.timestamp = new Date();
  clientStorage.setObject(key, reportData);
};

const reportToServer = (reportData, key) => {
  const fullUrl = window.__ENV__.sentry_api_address ? window.__ENV__.sentry_api_address : defaultSentryAPIAddress;
  let initRequest = request.post(null, {reportData: reportData});
  return fetch(fullUrl, initRequest)
    .then(response => {
      if (!response.ok) {
        return Promise.reject(response);
      }
      resetErrorCount(key, reportData);
    });
};

const reportError = (key, reportData) => {
  if (typeof window !== 'undefined') {
    reportToServer(reportData, key);
    // if (window.__ENV__.feature_log_to_sentry && JSON.parse(window.__ENV__.feature_log_to_sentry)) {
    // } else {
    //   console.log('Report error!\n', JSON.stringify(reportData));
    //   resetErrorCount(key, reportData);
    // }
  }
};

// Output: false if the different time is less than an hour
//         true if the different is greater than or equual to an hour
const isReportError = (prevTimestamp, currentTimestamp) => {
  prevTimestamp = typeof prevTimestamp === 'string' ? new Date(prevTimestamp) : prevTimestamp;
  currentTimestamp = typeof currentTimestamp === 'string' ? new Date(currentTimestamp) : currentTimestamp;
  return Math.round((currentTimestamp - prevTimestamp) / 60000) >= 60;
};

const createErrorInStorage = (key, err, prevState, action, nextState) => {
  let reportData = {
    count: 1,
    timestamp: new Date()
  };

  if (!action) {
    reportData.err = err.message;
    reportData.lineNumber = err.lineNumber;
    reportData.kindOfError = err.constructor.name;
    reportData.info = err.info;
  } else {
    reportData.err = action.error.statusText;
    reportData.action = action;
    reportData.prevState = prevState;
    reportData.nextState = nextState;
  }

  clientStorage.setObject(key, reportData);
  return reportData;
};

export const errorHandler = (err, prevState, action, nextState) => {
  // Get storedErr in clientStorage
  let key = action ? `${action.type}.${action.error.statusText}` : err.message;
  if (!key) {
    // Not found key
    return;
  }
  let storedErr = clientStorage.getObject(key);

  // If error is not stored
  if (!storedErr) { 
    // stored error with current timestamp, the line number, the exception kind and a count of 1
    const reportData = createErrorInStorage(key, err, prevState, action, nextState);
    // report to sentry if error happend for the first time
    reportError(key, reportData);
  } else {
    let now = new Date();
    if (!isReportError(storedErr.timestamp, now)) {
      // If error is stored in the last an hour
      // Increase error count by 1
      // Update timestamp to now
      storedErr.count++;
      storedErr.timestamp = new Date();
      clientStorage.setObject(key, storedErr);
    } else {
      // Report error with data stored
      // Reset error to 1 and timestamp to now
      reportError(key, storedErr);
    }
  }
};

const ErrorSentry = store => next => action => {
  try {
    let previousState = store.getState();
    let result = next(action);
    let nextState = store.getState();
    if (action.error) errorHandler(action.error, previousState, action, nextState);
    return result;
  } catch (err) {
    errorHandler(err);
  }
};

export default ErrorSentry;
