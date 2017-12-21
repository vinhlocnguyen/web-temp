// @flow
import merge from '../helpers/deepMerge';
import * as Types from '../constants/ActionTypes';
import type { MeetingRoomState as State } from '../constants/FlowTypes';
import type { ThunkAction } from '../actions/meetingRoom';

const initState = {
  selected: {},
  list: {},
  filters: [],
  filterCondition: null,
  isCheckedAll: true,
  openNow: false,
  error: null
};

const meetingRoom = (state: State = initState, action: ThunkAction): State => {
  switch (action.type) {
    case Types.GET_BUILDING_MEETING_ROOM_SUCCESS: {
      const buildingId = action.response.length ? action.response[0].building : null;
      let newState = Object.assign({}, state);
      if (buildingId) {
        newState.list[buildingId] = action.response;
      }
      return newState;
    }

    case Types.SELECT_MEETING_ROOM:
      state.selected = action.meetingRoom;
      return state;

    case Types.GET_MEETING_ROOM_SUCCESS:
      return merge({}, state, {selected: action.response});

    case Types.EDIT_MEETING_ROOM_SUCCESS:
      return Object.assign({}, state, { selected: action.response });

    case Types.CREATE_MEETING_ROOM_SUCCESS: {
      const buildingId = action.response && action.response.building;
      let newState = Object.assign({}, state);
      let rooms = newState.list[buildingId];
      rooms.push(action.response);
      newState.list[buildingId] = rooms;
      return newState;
    }

    case Types.REMOVE_MEETING_ROOM_SUCCESS: {
      const buildingId = action.response && action.response.building;
      let newState = Object.assign({}, state);
      let rooms = state.list[buildingId];
      let roomIndex = rooms.map(r => r.id).indexOf(action.response.id);
      rooms = rooms.splice(roomIndex, 1);
      newState.list[buildingId] = rooms;
      return newState;
    }

    case Types.SET_MEETING_ROOM_FILTER:
      state.filterCondition = action.filterCondition;
      return state;

    case Types.CLEAR_MEETING_ROOM:
      return Object.assign({}, state, {
        selected: action.selected,
        list: action.list,
        filterCondition: action.filterCondition
      });

    case Types.CREATE_MEETING_ROOM_BOOKING_FAILURE:
      return Object.assign({}, state, {error: action.error});

    case Types.RESET_ERROR_SUCCESS:
      return Object.assign({}, state, { error: null });

    default: return merge({}, state);
  }
};

export default meetingRoom;
