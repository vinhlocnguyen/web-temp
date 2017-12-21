// @flow
import merge from '../helpers/deepMerge';
import * as Types from '../constants/ActionTypes';
import clientStorage from '../helpers/clientStorage';
import type { ThunkAction } from '../actions/building';
import type { BuildingState as State } from '../constants/FlowTypes';

//--intend for server-render
const isBrowser = typeof window !== 'undefined';

const initState: State = {
  current: {},
  list: [],
  error: {
    status: null,
    text: null
  },
  suggestionStops: [],
  selected: {}
};

const building = (state: State = initState, action: ThunkAction): State => {
  switch (action.type) {
    case Types.CREATE_BUILDING_SUCCESS:
      const newBuilding = {
        id: action.response.id,
        name: action.response.name,
        address: action.response.address.fullAddress
      };
      return merge({}, state, {list: [newBuilding]});

    case Types.EDIT_BUILDING_SUCCESS:  
      if (action.response.id === state.current.id) {
        return Object.assign({}, state, {current: action.response});
      } else {
        return Object.assign({}, state, {selected: action.response});
      }
      
    case Types.FETCH_BUILDING_SUCCESS:
    case Types.ADD_SERVICE_SUCCESS:
    case Types.REMOVE_SERVICE_SUCCESS:
    case Types.PIN_SERVICE_SUCCESS:
    case Types.UNPIN_SERVICE_SUCCESS:
      return Object.assign({}, state, {current: action.response});

    case Types.FETCH_BUILDING_FAILURE:
      if (action.error.status === 404) {
        isBrowser && clientStorage.removeItem('buildingId');
      }
      return state;

    case Types.GET_ALL_BUILDING_SUCCESS:
      state.list = merge([], action.response);
      return merge({}, state);

    case Types.SEARCH_BUILDING_SUCCESS:
      state.list = merge([], action.response);
      return merge({}, state);

    case Types.SELECT_BUILDING_SUCCESS:
      isBrowser && clientStorage.setItem('buildingId', action.response.buildingRef);
      return state;

    case Types.NEARBY_STOPS_SUCCESS:
      // return merge({}, state, {suggestionStops: action.response.nearByStops});
      return Object.assign({}, state, {suggestionStops: action.response.nearByStops});

    case Types.NEARBY_STOPS_FAILURE:
      return merge({}, state, {error: {
        status: action.error.status,
        text: action.error.statusText
      }});

    case Types.CLOSE_NEARBYSTOPS_ERROR:
      state.error = {
        status: null,
        text: null
      };
      return state;

    case Types.EDIT_SERVICE_SUCCESS:
      const listServices = state.current.services.map(item => {
        if (item.id === action.response.id) {
          return action.response;
        }
        return item;
      });
      return merge({}, state, {current: {services: listServices}});
    
    case Types.GET_BUILDING_BY_ID_SUCCESS:
      return Object.assign({}, state, { selected: action.response });
      
    case Types.UPDATE_SERVICE_IN_BUILDING:
      return Object.assign({}, state, { 'current.services': action.services });  
    
    default: return state;
  }
};

export default building;
