import * as Types from '../constants/ActionTypes';
import cookie from 'react-cookie';
import merge from '../helpers/deepMerge';
import clientStorage from '../helpers/clientStorage';
//--intend for server-render
const isBrowser = typeof window !== 'undefined';

const error = (state, action) => {
  let newState = {};
  switch (action.type) {
    case Types.CREATE_BUILDING_FAILURE:
    case Types.FETCH_BUILDING_FAILURE:
    case Types.SEARCH_BUILDING_FAILURE:
    case Types.SELECT_BUILDING_FAILURE:
    case Types.NEARBY_STOPS_FAILURE:
    case Types.CALCULATE_HOME_FAILURE:
    case Types.REPORTING_FAILURE:
    case Types.RESOLVE_REPORT_FAILURE:
    case Types.LIST_SERVICE_FAILURE:
    case Types.GET_SERVICE_FAILURE:
    case Types.CREATE_SERVICE_FAILURE:
    case Types.SUGGEST_COUNTRY_FAILURE:
    case Types.SUGGEST_CITY_FAILURE:
    case Types.GET_USER_FAILURE:
    case Types.LIST_USER_FAILURE:
    case Types.SEARCH_USER_FAILURE:
    case Types.GRANT_ADMIN_FAILURE:
    case Types.REGISTER_FAILURE:
    case Types.UPDATE_USER_FAILURE:
    case Types.LOGIN_FAILURE:
    case Types.CONFIRM_CALLBACK_FAILURE:
    case Types.FORGOT_PASSWORD_FAILURE:
    case Types.RETRIEVE_PASSWORD_FAILURE:
    case Types.VERIFY_USER_FAILURE:
    case Types.CHECK_VERIFY_NUMBER_FAILURE:
    case Types.VERIFY_PHONE_NUMBER_FAILURE:
    case Types.RETRIEVE_MEETING_ROOM_BOOKINGS_FAILURE:
    case Types.GET_ALL_BUILDING_FAILURE:
    case Types.EDIT_BUILDING_FAILURE:
    case Types.EDIT_SERVICE_FAILURE:
    case Types.EDIT_MEETING_ROOM_FAILURE:
    case Types.CREATE_MEETING_ROOM_FAILURE:
    case Types.REMOVE_MEETING_ROOM_FAILURE:
    case Types.REMOVE_USER_FAILURE:
    case Types.ADD_SERVICE_FAILURE:
    case Types.PIN_SERVICE_FAILURE:
    case Types.UNPIN_SERVICE_FAILURE:
    case Types.REMOVE_SERVICE_FAILURE:
    case Types.REAUTHENTICATE_FAILURE:
    case Types.UPDATE_USER_BY_ID_FAILURE:
      if ((action.error.status === 401 || action.error.status === 403) && cookie.load('authToken')) {
        // fix for the current build, it will be removed in the future
        cookie.remove('authToken', { path: '/' });
        if (isBrowser) {
          const domainCookie = '.' + window.location.hostname;
          cookie.remove('authToken', { path: '/', domain: domainCookie });
        }
        cookie.remove('authToken', {path: '/', domain: '.drops.io'});
        //////////
        isBrowser && clientStorage.removeItem('user');
        isBrowser && clientStorage.removeItem('buildingId');
        newState = {
          user: {
            isAuthenticated: false
          }
        };
      }
      return merge({}, state, newState, {
        error: {
          status: action.error.status,
          message: action.error.statusText
        }
      });

    case Types.SELECT_BUILDING_SUCCESS:
      newState = Object.assign({}, state);
      newState.transport.publicTransports = [];
      return newState;

    default: return state;
  }
};

export default error;
