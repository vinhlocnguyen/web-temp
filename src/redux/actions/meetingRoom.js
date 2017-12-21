// @flow
import { CALL_API } from '../middleware/api';
import * as Types from '../constants/ActionTypes';
import { request } from '../helpers/request';
import cookie from 'react-cookie';
import type { MeetingRoomState as State, Action } from '../constants/FlowTypes';

/* eslint-disable no-use-before-define */
type GetState = () => State;
type PromiseAction = Promise<Action>;
type ThunkAction = (dispatch: Dispatch, getState: GetState) => any;
type Dispatch = (action: Action | ThunkAction | PromiseAction | Array<Action>) => any;
/* eslint-enable no-use-before-define */

//get all categories
const handleGetBuildingMeetingRooms = (id: string): Action => {
  return {
    [CALL_API]: {
      types: [Types.GET_BUILDING_MEETING_ROOM_REQUEST, Types.GET_BUILDING_MEETING_ROOM_SUCCESS, Types.GET_BUILDING_MEETING_ROOM_FAILURE],
      endpoint: `/buildings/${id}/meetingrooms`,
      initRequest: request.get(cookie.load('authToken'))
    }
  };
};

export const getMeetingRooms = (id: string, params: Object): ThunkAction => {
  return (dispatch: Dispatch, getState: GetState) => {
    return dispatch(handleGetBuildingMeetingRooms(id));
  };
};

const handleCreateMeetingRoom = (buildingId: string, params: Object): Action => {
  return {
    [CALL_API]: {
      types: [Types.CREATE_MEETING_ROOM_REQUEST, Types.CREATE_MEETING_ROOM_SUCCESS, Types.CREATE_MEETING_ROOM_FAILURE],
      endpoint: `/buildings/${buildingId}/meetingrooms`,
      initRequest: request.post(cookie.load('authToken'), params)
    }
  };
};

export const createMeetingRoom = (buildingId: string, params: Object): ThunkAction => {
  return (dispatch: Dispatch, getState: GetState) => {
    return dispatch(handleCreateMeetingRoom(buildingId, params));
  };
};

const handleEditMeetingRoom = (buildingId: string, roomId: string, params: Object): Action => {
  return {
    [CALL_API]: {
      types: [Types.EDIT_MEETING_ROOM_REQUEST, Types.EDIT_MEETING_ROOM_SUCCESS, Types.EDIT_MEETING_ROOM_FAILURE],
      endpoint: `/buildings/${buildingId}/meetingrooms/${roomId}`,
      initRequest: request.put(cookie.load('authToken'), params)
    }
  };
};

export const editMeetingRoom = (buildingId: string, roomId: string, params: Object): ThunkAction => {
  return (dispatch: Dispatch, getState: GetState) => {
    return dispatch(handleEditMeetingRoom(buildingId, roomId, params));
  };
};

const handleRemoveMeetingRoom = (buildingId: string, roomId: string): Action => {
  return {
    [CALL_API]: {
      types: [Types.REMOVE_MEETING_ROOM_REQUEST, Types.REMOVE_MEETING_ROOM_SUCCESS, Types.REMOVE_MEETING_ROOM_FAILURE],
      endpoint: `/buildings/${buildingId}/meetingrooms/${roomId}`,
      initRequest: request.delete(cookie.load('authToken'))
    }
  };
};

export const removeMeetingRoom = (buildingId: string, roomId: string): ThunkAction => {
  return (dispatch: Dispatch, getState: GetState) => {
    return dispatch(handleRemoveMeetingRoom(buildingId, roomId));
  };
};

const handleSelectMeetingRoom = (room: Object): Object => {
  return {
    type: Types.SELECT_MEETING_ROOM,
    meetingRoom: room
  };
};

export const selectMeetingRoom = (room: Object): ThunkAction => {
  return (dispatch: Dispatch, getState: GetState) => {
    return dispatch(handleSelectMeetingRoom(room));
  };
};

// get a meeting room from server
const handleGetMeetingRoom = (roomId: string, buildingId: string): Action => {
  return {
    [CALL_API]: {
      types: [Types.GET_MEETING_ROOM_REQUEST, Types.GET_MEETING_ROOM_SUCCESS, Types.GET_MEETING_ROOM_FAILURE],
      endpoint: `/buildings/${buildingId}/meetingrooms/${roomId}`,
      initRequest: request.get(cookie.load('authToken'))
    }
  };
};

export const getMeetingRoom = (roomId: string, buildingId: string): ThunkAction => {
  return (dispatch: Dispatch, getState: GetState) => {
    return dispatch(handleGetMeetingRoom(roomId, buildingId));
  };
};

const handleSetFilter = (condition: Object): Object => {
  return {
    type: Types.SET_MEETING_ROOM_FILTER,
    filterCondition: condition
  };
};

export const setFilter = (condition: Object) => {
  return (dispatch: Dispatch, getState: GetState) => {
    return dispatch(handleSetFilter(condition));
  };
};

const handleClearMeetingRoom = (): Object => {
  return {
    type: Types.CLEAR_MEETING_ROOM,
    filterCondition: null,
    selected: null,
    list: []
  };
};

export const clearMeetingRoom = (): ThunkAction => {
  return (dispatch: Dispatch, getState: GetState) => {
    return dispatch(handleClearMeetingRoom());
  };
};

const handleBookRoom = (buildingId: string, roomId: string, bookingInfo: Object): Action => {
  return {
    [CALL_API]: {
      types: [Types.CREATE_MEETING_ROOM_BOOKING_REQUEST, Types.CREATE_MEETING_ROOM_BOOKING_SUCCESS, Types.CREATE_MEETING_ROOM_BOOKING_FAILURE],
      endpoint: `/buildings/${buildingId}/meetingrooms/${roomId}/reservations`,
      initRequest: request.post(cookie.load('authToken'), bookingInfo)
    }
  };
};

export const bookMeetingRoom = (buildingId: string, roomId: string, bookingInfo: Object): ThunkAction => {
  return (dispatch: Dispatch, getState: GetState) => {
    return dispatch(handleBookRoom(buildingId, roomId, bookingInfo));
  };
};

const handleResetError = (): Object => {
  return {
    type: Types.RESET_ERROR_SUCCESS
  };
};

export const resetError = (): ThunkAction => {
  return (dispatch: Dispatch, getState: GetState) => {
    dispatch(handleResetError());
  };
};

export type { ThunkAction }
