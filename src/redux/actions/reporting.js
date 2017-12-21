/*@flow*/

import { CALL_API } from '../middleware/api';
import * as Types from '../constants/ActionTypes';
import { request } from '../helpers/request';
import { DOMAIN } from '../../../config';
import cookie from 'react-cookie';

import type { Report as State, Action } from '../constants/FlowTypes';

/* eslint-disable no-use-before-define */
type GetState = () => State;
type PromiseAction = Promise<Action>;
type ThunkAction = (dispatch: Dispatch, getState: GetState) => any;
type Dispatch = (action: Action | ThunkAction | PromiseAction | Array<Action>) => any;

export const sendReport = (params: Object): Action => {
  const cbUrl = encodeURIComponent(DOMAIN + '/resolve-report');
  return {
    [CALL_API]: {
      types: [Types.SOMETHING_REQUEST, Types.REPORTING_SUCCESS, Types.REPORTING_FAILURE],
      endpoint: `/buildings/incidentReports?callback_url=${cbUrl}`,
      initRequest: request.post(cookie.load('authToken'), params)
    }
  };
};

export const reportIncident = (params: Object): ThunkAction => {
  return (dispatch: Dispatch, getState: GetState) => {
    return dispatch(sendReport(params));
  };
};

// resolve report
export const handleResolveReport = (id: string, token: string, params: Object): Action => {
  return {
    [CALL_API]: {
      types: [Types.RESOLVE_REPORT_REQUEST, Types.RESOLVE_REPORT_SUCCESS, Types.RESOLVE_REPORT_FAILURE],
      endpoint: `/buildings/incidentReports/${id}?resolveToken=${token}`,
      initRequest: request.put(cookie.load('authToken'), params)
    }
  };
};

export const resolveReport = (id: string, token: string, params: Object): ThunkAction => {
  return (dispatch: Dispatch, getState: GetState) => {
    return dispatch(handleResolveReport(id, token, params));
  };
};

export type { ThunkAction }