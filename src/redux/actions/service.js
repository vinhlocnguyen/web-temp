import { CALL_API } from '../middleware/api';
import * as Types from '../constants/ActionTypes';
import { request } from '../helpers/request';
import cookie from 'react-cookie';
import type { ServiceState as State, Action } from '../constants/FlowTypes';

/* eslint-disable no-use-before-define */
type GetState = () => State;
type PromiseAction = Promise<Action>;
type ThunkAction = (dispatch: Dispatch, getState: GetState) => any;
type Dispatch = (action: Action | ThunkAction | PromiseAction | Array<Action>) => any;
/* eslint-enable no-use-before-define */

// get all services
const handleListServices = (): Action => {
  return {
    [CALL_API]: {
      types: [Types.LIST_SERVICE_REQUEST, Types.LIST_SERVICE_SUCCESS, Types.LIST_SERVICE_FAILURE],
      endpoint: `/services`,
      initRequest: request.get(cookie.load('authToken'))
    }
  };
};

export const listServices = (): ThunkAction => {
  return (dispatch: Dispatch, getState: GetState) => {
    return dispatch(handleListServices());
  };
};
// select a service
const handleSelectService = (service: Object): Object => {
  return {
    type: Types.SELECT_SERVICE_SUCCESS,
    service
  };
};

export const selectService = (service: Object): ThunkAction => {
  return (dispatch: Dispatch, getState: GetState) => {
    return dispatch(handleSelectService(service));
  };
};

// get a service from server
const handleGetService = (id: string): Action => {
  return {
    [CALL_API]: {
      types: [Types.GET_SERVICE_REQUEST, Types.GET_SERVICE_SUCCESS, Types.GET_SERVICE_FAILURE],
      endpoint: `/services/${id}`,
      initRequest: request.get(cookie.load('authToken'))
    }
  };
};

export const getService = (id: string): ThunkAction => {
  return (dispatch: Dispatch, getState: GetState) => {
    return dispatch(handleGetService(id));
  };
};

//create service
const handleCreateService = (params: Object): Action => {
  return {
    [CALL_API]: {
      types: [Types.CREATE_SERVICE_REQUEST, Types.CREATE_SERVICE_SUCCESS, Types.CREATE_SERVICE_FAILURE],
      endpoint: `/services`,
      initRequest: request.post(cookie.load('authToken'), params)
    }
  };
};

export const createService = (params: Object): ThunkAction => {
  return (dispatch: Dispatch, getState: GetState) => {
    return dispatch(handleCreateService(params));
  };
};

//filter services
export const filterServices = (filters: Object, openNow: Boolean): ThunkAction => {
  return (dispatch: Dispatch, getState: GetState) => {
    return dispatch({
      type: Types.SET_SERVICE_FILTERS,
      data: {
        filters,
        openNow
      }
    });
  };
};

//edit service
const handleEditService = (id: string, params: Object): Action => {
  return {
    [CALL_API]: {
      types: [Types.EDIT_SERVICE_REQUEST, Types.EDIT_SERVICE_SUCCESS, Types.EDIT_SERVICE_FAILURE],
      endpoint: `/services/${id}`,
      initRequest: request.put(cookie.load('authToken'), params)
    }
  };
};

export const editService = (id: string, params: Object): ThunkAction => {
  return (dispatch: Dispatch, getState: getState) => {
    return dispatch(handleEditService(id, params));
  };
};

// delete a service
const handleDeleteService = (id: string): Action => {
  return {
    [CALL_API]: {
      types: [Types.DELETE_SERVICE_REQUEST, Types.DELETE_SERVICE_SUCCESS, Types.DELETE_SERVICE_FAILURE],
      endpoint: `/services/${id}`,
      initRequest: request.delete(cookie.load('authToken'))
    }
  };
};

export const deleteService = (id: string): ThunkAction => {
  return (dispatch: Dispatch, getState: GetState) => {
    return dispatch(handleDeleteService(id));
  };
};

const handleGetBuidlingByService = (id: string): Action => {
  return {
    [CALL_API]: {
      types: [Types.GET_BUILDING_BY_SERVICE_REQUEST, Types.GET_BUILDING_BY_SERVICE_SUCCESS, Types.GET_BUILDING_BY_SERVICE_FAILURE],
      endpoint: `/services/${id}/buildings`,
      initRequest: request.get(cookie.load('authToken'))
    }
  };
};

export const getBuildingByService = (id: string): ThunkAction => {
  return (dispatch: Dispatch, getState: GetState) => {
    return dispatch(handleGetBuidlingByService(id));
  };
};

export type { ThunkAction }
