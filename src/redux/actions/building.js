// @flow
import { CALL_API } from '../middleware/api';
import * as Types from '../constants/ActionTypes';
import { request } from '../helpers/request';
import cookie from 'react-cookie';
import type { BuildingState as State, Action } from '../constants/FlowTypes';

/* eslint-disable no-use-before-define */
type GetState = () => State;
type PromiseAction = Promise<Action>;
type ThunkAction = (dispatch: Dispatch, getState: GetState) => any;
type Dispatch = (action: Action | ThunkAction | PromiseAction | Array<Action>) => any;

/* eslint-enable no-use-before-define */

const handleCreateBuilding = (params: Object): Action => {
  return {
    [CALL_API]: {
      types: [Types.CREATE_BUILDING_REQUEST, Types.CREATE_BUILDING_SUCCESS, Types.CREATE_BUILDING_FAILURE],
      endpoint: `/buildings`,
      initRequest: request.post(cookie.load('authToken'), params)
    }
  };
};

export const createBuilding = (params: Object): ThunkAction => {
  return (dispatch: Dispatch, getState: GetState) => {
    return dispatch(handleCreateBuilding(params));
  };
};

export const fetchBuilding = (): Action => {
  return {
    [CALL_API]: {
      types: [Types.FETCH_BUILDING_REQUEST, Types.FETCH_BUILDING_SUCCESS, Types.FETCH_BUILDING_FAILURE],
      endpoint: `/buildings/selected`,
      initRequest: request.get(cookie.load('authToken'))
    }
  };
};

export const retrieveBuilding = (): ThunkAction => {
  return (dispatch: Dispatch, getState: GetState) => {
    return dispatch(fetchBuilding());
  };
};

export const handleEditBuilding = (params: Object, id: string): Action => {
  // If id existed: Edit a specific building
  // If not id: Edit current building
  const endoint = id ? `/buildings/${id}` : `/buildings`;
  return {
    [CALL_API]: {
      types: [Types.EDIT_BUILDING_REQUEST, Types.EDIT_BUILDING_SUCCESS, Types.EDIT_BUILDING_FAILURE],
      endpoint: endoint,
      initRequest: request.put(cookie.load('authToken'), params)
    }
  };
};

export const editBuilding = (params: Object, buildingId: string): ThunkAction => {
  return (dispatch: Dispatch, getState: GetState) => {
    return dispatch(handleEditBuilding(params, buildingId));
  };
};

export const fetchEtaNextTransports = (): Action => {
  return {
    [CALL_API]: {
      types: [Types.ETA_TRANSPORTS_REQUEST, Types.ETA_TRANSPORTS_SUCCESS, Types.ETA_TRANSPORTS_FAILURE],
      endpoint: `/buildings/eta`,
      initRequest: request.get(cookie.load('authToken'))
    }
  };
};
export const findEtaNextTransports = (): ThunkAction => {
  return (dispatch: Dispatch, getState: GetState) => {
    return dispatch(fetchEtaNextTransports());
  };
};

//get all buildings
export const handleGetAllBuildings = (): Action => {
  return {
    [CALL_API]: {
      types: [Types.GET_ALL_BUILDING_REQUEST, Types.GET_ALL_BUILDING_SUCCESS, Types.GET_ALL_BUILDING_FAILURE],
      endpoint: `/buildings/search?input=`,
      initRequest: request.get(cookie.load('authToken'))
    }
  };
};

export const getAllBuildings = (): ThunkAction => {
  return (dispatch: Dispatch, getState: GetState) => {
    return dispatch(handleGetAllBuildings());
  };
};

//search buildings
export const handleSearchBuilding = (input: string): Action => {
  const searchStr = encodeURIComponent(input);
  return {
    [CALL_API]: {
      types: [Types.SEARCH_BUILDING_REQUEST, Types.SEARCH_BUILDING_SUCCESS, Types.SEARCH_BUILDING_FAILURE],
      endpoint: `/buildings/search?input=${searchStr}`,
      initRequest: request.get(cookie.load('authToken'))
    }
  };
};

export const searchBuilding = (input: string): ThunkAction => {
  return (dispatch: Dispatch, getState: GetState) => {
    return dispatch(handleSearchBuilding(input));
  };
};

//find next to me
const distance = 0.2;
export const handleNextToMe = (lat: number | string, long: number | string): Action => {
  return {
    [CALL_API]: {
      types: [Types.SEARCH_BUILDING_REQUEST, Types.SEARCH_BUILDING_SUCCESS, Types.SEARCH_BUILDING_FAILURE],
      endpoint: `/buildings/nexttome?lat=${lat}&long=${long}&distance=${distance}`,
      initRequest: request.get(cookie.load('authToken'))
    }
  };
};

export const nextToMe = (lat: number | string, long: number | string): ThunkAction => {
  return (dispatch: Dispatch, getState: GetState) => {
    return dispatch(handleNextToMe(lat, long));
  };
};

//select building
const handleSelectBuilding = (id: string): Action => {
  return {
    [CALL_API]: {
      types: [Types.SELECT_BUILDING_REQUEST, Types.SELECT_BUILDING_SUCCESS, Types.SELECT_BUILDING_FAILURE],
      endpoint: `/users/select-building`,
      initRequest: request.put(cookie.load('authToken'), {buildingId: id})
    }
  };
};

export const selectBuilding = (id: string): ThunkAction => {
  return (dispatch: Dispatch, getState: GetState) => {
    return dispatch(handleSelectBuilding(id));
  };
};

// find nearby stops
const handleFindNearbyStops = (regionId: string, address: string, distance: number): Action => {
  let endpoint = `/buildings/nearbystops?regionId=${regionId}&address=${address}`;
  if (distance) {
    endpoint += `&distance=${distance * 1000}`;
  }
  return {
    [CALL_API]: {
      types: [Types.NEARBY_STOPS_REQUEST, Types.NEARBY_STOPS_SUCCESS, Types.NEARBY_STOPS_FAILURE],
      endpoint: endpoint,
      initRequest: request.get(cookie.load('authToken'))
    }
  };
};

export const findNearbyStops = (regionId: string, address: string, distance: number): ThunkAction => {
  return (dispatch, getState) => {
    return dispatch(handleFindNearbyStops(regionId, address, distance));
  };
};

// close error message
const handleCloseErrorMessage = (): Action => {
  return {
    type: Types.CLOSE_NEARBYSTOPS_ERROR
  };
};

export const closeErrorMessage = (): ThunkAction => {
  return (dispatch: Dispatch, getState: GetState) => {
    return dispatch(handleCloseErrorMessage());
  };
};

// calculate come home time
const handleCalculateGoHomeTime = (start: string, end: string): Action => {
  return {
    [CALL_API]: {
      types: [Types.CALCULATE_HOME_REQUEST, Types.CALCULATE_HOME_SUCCESS, Types.CALCULATE_HOME_FAILURE],
      endpoint: `/buildings/go-home?startPoint=${start}&endPoint=${end}`,
      initRequest: request.get(cookie.load('authToken'))
    }
  };
};

// the start, end params are either address string or location string (ie: '10.245, 100.01')
export const calculateGoHomeTime = (start: string, end: string): ThunkAction => {
  return (dispatch, getState) => {
    return dispatch(handleCalculateGoHomeTime(start, end));
  };
};

// add services to building
const handleAddService = (id: string): Action => {
  return {
    [CALL_API]: {
      types: [Types.ADD_SERVICE_REQUEST, Types.ADD_SERVICE_SUCCESS, Types.ADD_SERVICE_FAILURE],
      endpoint: `/buildings/services/${id}/add`,
      initRequest: request.put(cookie.load('authToken'))
    }
  };
};

export const addService = (id: string): ThunkAction => {
  return (dispatch: Dispatch, getState: GetState) => {
    return dispatch(handleAddService(id));
  };
};

// remove a service from building
const handleRemoveService = (id: string): Action => {
  return {
    [CALL_API]: {
      types: [Types.REMOVE_SERVICE_REQUEST, Types.REMOVE_SERVICE_SUCCESS, Types.REMOVE_SERVICE_FAILURE],
      endpoint: `/buildings/services/${id}/remove`,
      initRequest: request.put(cookie.load('authToken'))
    }
  };
};

export const removeService = (id: string): ThunkAction => {
  return (dispatch: Dispatch, getState: GetState) => {
    return dispatch(handleRemoveService(id));
  };
};

const handleCountUsersInBuidling = (id: string): Action => {
  return {
    [CALL_API]: {
      types: [Types.COUNT_USER_IN_BUILDING_REQUEST, Types.COUNT_USER_IN_BUILDING_SUCCESS, Types.COUNT_USER_IN_BUILDING_FAILURE],
      endpoint: `/buildings/${id}/users`,
      initRequest: request.get(cookie.load('authToken'))
    }
  };
};

export const countUsersInBuilidng = (buildingId: string): ThunkAction => {
  return (dispatch: Dispatch, getState: GetState) => {
    return dispatch(handleCountUsersInBuidling(buildingId));
  };
};

const handleDeleteBuilding = (id: string): Action => {
  return {
    [CALL_API]: {
      types: [Types.DELETE_BUILDING_REQUEST, Types.DELETE_BUILDING_SUCCESS, Types.DELETE_BUILDING_FAILURE],
      endpoint: `/buildings/${id}`,
      initRequest: request.delete(cookie.load('authToken'))
    }
  };
};

export const deleteBuilding = (id: string): ThunkAction => {
  return (dispatch: Dispatch, getState: GetState) => {
    return dispatch(handleDeleteBuilding(id));
  };
};

const handleGetBuildingById = (id: string): Action => {
  return {
    [CALL_API]: {
      types: [Types.GET_BUILDING_BY_ID_REQUEST, Types.GET_BUILDING_BY_ID_SUCCESS, Types.GET_BUILDING_BY_ID_FAILURE],
      endpoint: `/buildings/${id}`,
      initRequest: request.get(cookie.load('authToken'))
    }
  };
};

export const getBuildingById = (id: string): ThunkAction => {
  return (dispatch: Dispatch, getState: GetState) => {
    return dispatch(handleGetBuildingById(id));
  };
};

const handleUpdateServiceInBuilding = (services: Array<string>): Object => {
  return {
    type: Types.UPDATE_SERVICE_IN_BUILDING,
    services
  };
};

export const updateServiceInBuilding = (services: Array<string>): ThunkAction => {
  return (dispatch: Dispatch, getState: GetState) => {
    return dispatch(handleUpdateServiceInBuilding(services));
  };
};

const handlePinService = (params: Object): Action => {
  return {
    [CALL_API]: {
      types: [Types.PIN_SERVICE_REQUEST, Types.PIN_SERVICE_SUCCESS, Types.PIN_SERVICE_FAILURE],
      endpoint: `/buildings/services/pin`,
      initRequest: request.put(cookie.load('authToken'), params)
    }
  };
};

export const pinService = (params: Object): ThunkAction => {
  return (dispatch: Dispatch, getState: GetState) => {
    return dispatch(handlePinService(params));
  };
};

const handleUnpinService = (params: Object): Action => {
  return {
    [CALL_API]: {
      types: [Types.UNPIN_SERVICE_REQUEST, Types.UNPIN_SERVICE_SUCCESS, Types.UNPIN_SERVICE_FAILURE],
      endpoint: `/buildings/services/unpin`,
      initRequest: request.put(cookie.load('authToken'), params)
    }
  };
};

export const unpinService = (params: Object): ThunkAction => {
  return (dispatch: Dispatch, getState: GetState) => {
    return dispatch(handleUnpinService(params));
  };
};

export type { ThunkAction };
