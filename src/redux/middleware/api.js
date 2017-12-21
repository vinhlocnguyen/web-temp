import { normalize } from 'normalizr';
import fetch from 'isomorphic-fetch';
import { DOMAIN } from '../../../config';

// Extracts the next page URL from API response.
// function getNextPageUrl(response) {
//   const link = response.headers.get('link');
//   if (!link) {
//     return null;
//   }
//
//   const nextLink = link.split(',').find(s => s.indexOf('rel="next"') > -1);
//   if (!nextLink) {
//     return null;
//   }
//
//   return nextLink.split(';')[0].slice(1, -1);
// }

// root api url
const API_ROOT = DOMAIN + '/api';
// Fetches an API response and normalizes the result JSON according to schema.
// This makes every API response have the same shape, regardless of how nested it was.
function callApi(endpoint, initRequest, schema) {
  const fullUrl = (endpoint.indexOf(API_ROOT) === -1) ? API_ROOT + endpoint : endpoint;
  // const fullUrl = 'api' + endpoint;
  initRequest.credentials = 'same-origin';
  return fetch(fullUrl, initRequest)
    .then(response => {
      if (!response.ok) {
        return Promise.reject(response);
      }
      return response.json().then(json => ({ json, response }));
    })
    .then(({ json, response }) => {
      // const camelizedJson = camelizeKeys(json.data);
      // const nextPageUrl = getNextPageUrl(response);
      const data = schema ? normalize(json.data, schema) : json.data;

      // return Object.assign({},
      //   data
      //   // { nextPageUrl }
      // );
      return data;
    }).catch(response => {
      return response && response.json && response.json()
        .then(json => {
          json.status = response.status;
          return Promise.reject(json);
        });
    });
};

// We use this Normalizr schemas to transform API responses from a nested form
// to a flat form where repos and users are placed in `entities`, and nested
// JSON objects are replaced with their IDs. This is very convenient for
// consumption by reducers, because we can easily build a normalized tree
// and keep it updated as we fetch more data.

// Action key that carries API call info interpreted by this Redux middleware.
export const CALL_API = Symbol('Call API');

// A Redux middleware that interprets actions with CALL_API info specified.
// Performs the call and promises when such actions are dispatched.
export default store => next => action => {
  const callAPI = action[CALL_API];
  if (typeof callAPI === 'undefined') {
    return next(action);
  }
  let { endpoint } = callAPI;
  let { initRequest } = callAPI;
  const { schema, types } = callAPI;

  if (typeof endpoint !== 'string') {
    throw new Error('Specify a string endpoint URL.');
  }
  // if (!schema) {
  //   throw new Error('Specify one of the exported Schemas.');
  // }
  if (!Array.isArray(types) || types.length !== 3) {
    throw new Error('Expected an array of three action types.');
  }
  if (!types.every(type => typeof type === 'string')) {
    throw new Error('Expected action types to be strings.');
  }

  function actionWith(data) {
    const finalAction = Object.assign({}, action, data);
    delete finalAction[CALL_API];
    return finalAction;
  }

  const [ requestType, successType, failureType ] = types;
  next(actionWith({ type: requestType }));

  return callApi(endpoint, initRequest, schema).then(
    response => next(actionWith({
      response,
      type: successType
    })),
    error => next(actionWith({
      type: failureType,
      error: error || 'Something bad happened'
    }))
  );
};
