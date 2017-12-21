// @flow
// import { CALL_API } from '../middleware/api';
import * as Types from '../constants/ActionTypes';
import type { TransportState as State, Action } from '../constants/FlowTypes';

/* eslint-disable no-use-before-define */
type GetState = () => State;
type PromiseAction = Promise<Action>;
type ThunkAction = (dispatch: Dispatch, getState: GetState) => any;
type Dispatch = (action: Action | ThunkAction | PromiseAction | Array<Action>) => any;
/* eslint-enable no-use-before-define */

// import { request } from '../helpers/request';
// import cookie from 'react-cookie';
//
// // auto suggestion country
// const handleGetTimeTable = (region, stopArea, stopType, limit = 4) => {
//   return {
//     [CALL_API]: {
//       types: [Types.GET_TIMETABLE_REQUEST, Types.GET_TIMETABLE_SUCCESS, Types.GET_TIMETABLE_FAILURE],
//       endpoint: `/transports/schedule?region=${region}&stopArea=${stopArea}&stopType=${stopType}&limit=${limit}`,
//       initRequest: request.get(cookie.load('authToken'))
//     }
//   };
// };
//
// export const getTimeTable = (region, stopArea, stopType, limit) => {
//   return (dispatch, getState) => {
//     dispatch(handleGetTimeTable(region, stopArea, stopType, limit));
//   };
// };

//filter transports
const handleFilterTransports = (filters: Object): Object => {
  return {
    type: Types.SET_TRANSPORT_FILTERS,
    data: {
      filters
    }
  };
};

export const filterTransports = (filters: Object): ThunkAction => {
  return (dispatch: Dispatch, getState: GetState) => {
    return dispatch(handleFilterTransports(filters));
  };
};

export type { ThunkAction }