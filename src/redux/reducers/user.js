// @flow
import cookie from 'react-cookie';
import merge from '../helpers/deepMerge';
import * as Types from '../constants/ActionTypes';
import clientStorage from '../helpers/clientStorage';
import type { ThunkAction } from '../actions/user';
import type { UserState as State } from '../constants/FlowTypes';

//--intend for server-render
const isBrowser = typeof window !== 'undefined';
// if (isBrowser && process.env.NODE_ENV !== 'test') {
//   Storage.prototype.setObject = function(key, value) {
//       this.setItem(key, JSON.stringify(value));
//   };

//   Storage.prototype.getObject = function(key) {
//       var value = this.getItem(key);
//       return value && JSON.parse(value);
//   };
// }

const user = (state: State = {
  isAuthenticated: !!cookie.load('authToken'),
  isRegistered: false,
  isAdministrator: false,
  isConfirmed: false,
  isUpdatedInfo: false,
  info: isBrowser && clientStorage.getObject('user') ? clientStorage.getObject('user') : {},
  waitingConfirm: false,
  phoneNumber: {
    isWaitingConfirm: false,
    isVerified: false,
    number: null
  },
  bookings: null,
  list: [],
  selected: {}
}, action: ThunkAction): State => {
  switch (action.type) {
    case Types.LOGIN_SUCCESS:
    case Types.REAUTHENTICATE_SUCCESS:
      cookie.save('authToken', action.response.token, { path: '/' });
      isBrowser && action.response.user.buildingRef && clientStorage.setItem('buildingId', action.response.user.buildingRef);
      isBrowser && clientStorage.setObject('user', action.response.user);
      isBrowser && clientStorage.setItem('isAuthenticated', true);
      return Object.assign({}, state, { isRegistered: false, isAuthenticated: true, isAdministrator: action.response.user.flatTurtleAdmin, info: action.response.user });

    case Types.REGISTER_SUCCESS:
      return Object.assign({}, state, { isRegistered: true });

    case Types.LOGOUT_SUCCESS:
    case Types.LOGOUT_FAILURE:
      cookie.remove('authToken', { path: '/' });
      isBrowser && clientStorage.removeItem('buildingId');
      isBrowser && clientStorage.removeItem('user');
      isBrowser && clientStorage.setItem('isAuthenticated', false);
      return merge({}, state, { isRegistered: false, isAuthenticated: false, isAdministrator: false, info: {} });

    case Types.GET_USER_SUCCESS:
      isBrowser && clientStorage.setObject('user', action.response);
      isBrowser && action.response.buildingRef && clientStorage.setItem('buildingId', action.response.buildingRef);
      return merge({}, state, { info: action.response });

    case Types.CHANGE_PASSWORD_SUCCESS:
      return merge({}, state, { waitingConfirm: true });

    case Types.FORGOT_PASSWORD_SUCCESS:
    case Types.RETRIEVE_PASSWORD_SUCCESS:
      return merge({}, state, { waitingConfirm: true });

    case Types.CONFIRM_CALLBACK_SUCCESS:
      return merge({}, state, {isConfirmed: true});

    case Types.CONFIRM_TERMINATE_TOKEN_SUCCESS:
      return merge({}, state, {isConfirmed: true});

    case Types.CONFIRM_PASSWORD_CHANGE_SUCCESS:
      cookie.remove('authToken', { path: '/' });
      isBrowser && clientStorage.removeItem('buildingId');
      isBrowser && clientStorage.removeItem('user');
      return merge({}, state, {isConfirmed: true});

    case Types.CONFIRM_CALLBACK_FAILURE:
    case Types.CONFIRM_PASSWORD_CHANGE_FAILURE:
    case Types.CONFIRM_TERMINATE_TOKEN_FAILURE:
      return merge({}, state, {isConfirmed: false});

    case Types.UPDATE_USER_SUCCESS:
      isBrowser && clientStorage.setObject('user', action.response);
      const updatingState = Object.assign({}, state);
      updatingState.info = action.response;
      updatingState.isUpdatedInfo = true;
      return updatingState;

    case Types.UPDATE_USER_FAILURE:
      return merge({}, state, {isUpdatedInfo: false});

    case Types.VERIFY_USER_SUCCESS:
      isBrowser && clientStorage.setObject('user', action.response);
      return merge({}, state, {isConfirmed: true, info: action.response});

    case Types.VERIFY_USER_FAILURE:
      return merge({}, state, {isConfirmed: false});

    case Types.LIST_USER_SUCCESS:
      return merge({}, state, { list: action.response });

    case Types.SEARCH_USER_SUCCESS:
      const newState = Object.assign({}, state);
      newState.list = action.response;
      return newState;

    case Types.GRANT_ADMIN_SUCCESS:
      const list = state.list.map(item => {
        if (item.id === action.response.id) item.flatTurtleAdmin = true;
        return item;
      });
      return merge({}, state, {list});

    case Types.VERIFY_PHONE_NUMBER_SUCCESS:
      const veriedPhone = {
        isWaitingConfirm: true,
        requestId: action.response.requestId,
        number: action.response.phoneNumber
      };
      return merge({}, state, {phoneNumber: veriedPhone});

    case Types.CHECK_VERIFY_NUMBER_SUCCESS:
      const checkedPhone = {
        isWaitingConfirm: false,
        isVerified: true,
        number: state.phoneNumber.number
      };
      return Object.assign({}, state, {phoneNumber: checkedPhone});

    case Types.CANCEL_VERIFYING_NUMBER_FAILURE:
    case Types.CANCEL_VERIFYING_NUMBER_SUCCESS:
      const canceledNumber = {
        isWaitingConfirm: false,
        isVerified: false,
        requestId: null,
        number: null
      };
      return Object.assign({}, state, {phoneNumber: canceledNumber});

    case Types.RETRIEVE_MEETING_ROOM_BOOKINGS_SUCCESS:
      const bookings = action.response.bookings;
      return merge({}, state, { bookings });

    case Types.REMOVE_USER_SUCCESS:
      state.list = state.list.filter(item => item.id !== action.response.id);
      return state;

    case Types.SELECT_USER_SUCCESS:
      state.selected = action.user;
      return state;

    case Types.GET_USER_BY_ID_SUCCESS:
      state = Object.assign({}, state, {selected: action.response});
      return state;

    default: return merge({}, state, {
      waitingConfirm: null,
      isConfirmed: null,
      isUpdatedInfo: null
    });
  }
};
export default user;
