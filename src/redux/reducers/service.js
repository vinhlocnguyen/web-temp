import merge from '../helpers/deepMerge';
import * as Types from '../constants/ActionTypes';
import type { ServiceState as State } from '../constants/FlowTypes';
import type { ThunkAction } from '../actions/service';

const initState = {
  selected: {},
  list: [],
  filters: [],
  isCheckedAll: true,
  openNow: false,
  // includedByBuilding: []
};

const service = (state: State = initState, action: ThunkAction): State => {
  switch (action.type) {
    case Types.LIST_SERVICE_SUCCESS:
      return merge({}, state, { list: action.response.services });

    case Types.SELECT_SERVICE_SUCCESS:
      state.selected = action.service;
      return state;

    case Types.GET_SERVICE_SUCCESS:
      return merge({}, state, {selected: action.response});

    case Types.CREATE_SERVICE_SUCCESS:
      const creationState = Object.assign({}, state);
      creationState.list = creationState.list.concat(action.response);
      return creationState;

    case Types.SET_SERVICE_FILTERS:
      const newState = Object.assign({}, state);
      newState.filters = action.data.filters;
      newState.openNow = action.data.openNow;
      return newState;

    case Types.EDIT_SERVICE_SUCCESS:
      return Object.assign({}, state, {selected: action.response});

    case Types.DELETE_SERVICE_SUCCESS:
      const deleteState = Object.assign({}, state);
      deleteState.list = [].concat(action.response.services);
      return deleteState;

    // case Types.GET_BUILDING_BY_SERVICE_SUCCESS:
    //   console.log("Response: ", action.response);
    //   return Object.assign({}, state, { includedByBuilding: action.response });

    default: return merge({}, state);
  }
};

export default service;
