// @flow
import { CALL_API } from '../middleware/api';
import * as Types from '../constants/ActionTypes';
// import Schemas from '../schemas';
import { request } from '../helpers/request';
import { CALLBACK_URL, FORGOT_PASSWORD_CALLBACK } from '../../../config.js';
import cookie from 'react-cookie';
import type { UserState as State, Action } from '../constants/FlowTypes';

/* eslint-disable no-use-before-define */
type GetState = () => State;
type PromiseAction = Promise<Action>;
type ThunkAction = (dispatch: Dispatch, getState: GetState) => any;
type Dispatch = (action: Action | ThunkAction | PromiseAction | Array<Action>) => any;
/* eslint-enable no-use-before-define */

const handleGetUser = (): Action => {
  return {
    [CALL_API]: {
      types: [Types.GET_USER_REQUEST, Types.GET_USER_SUCCESS, Types.GET_USER_FAILURE],
      endpoint: `/users/user`,
      initRequest: request.get(cookie.load('authToken'))
    }
  };
};

export const getUser = (): ThunkAction => {
  return (dispatch: Dispatch, getState: GetState) => {
    return dispatch(handleGetUser());
  };
};

const handleListUser = (): Action => {
  return {
    [CALL_API]: {
      types: [Types.LIST_USER_REQUEST, Types.LIST_USER_SUCCESS, Types.LIST_USER_FAILURE],
      endpoint: `/users`,
      initRequest: request.get(cookie.load('authToken'))
    }
  };
};

export const listUser = (): ThunkAction => {
  return (dispatch: Dispatch, getState: GetState) => {
    dispatch(handleListUser());
  };
};

const handleSearchUser = (input: string): Action => {
  return {
    [CALL_API]: {
      types: [Types.SEARCH_USER_REQUEST, Types.SEARCH_USER_SUCCESS, Types.SEARCH_USER_FAILURE],
      endpoint: `/users/search?input=${encodeURIComponent(input)}`,
      initRequest: request.get(cookie.load('authToken'))
    }
  };
};

export const searchUser = (input: string): ThunkAction => {
  return (dispatch: Dispatch, getState: GetState) => {
    return dispatch(handleSearchUser(input));
  };
};

const handleGrantAdmin = (email: string): Action => {
  return {
    [CALL_API]: {
      types: [Types.GRANT_ADMIN_REQUEST, Types.GRANT_ADMIN_SUCCESS, Types.GRANT_ADMIN_FAILURE],
      endpoint: `/users/grantadmin`,
      initRequest: request.post(cookie.load('authToken'), {email})
    }
  };
};

export const grantAdmin = (email: string): ThunkAction => {
  return (dispatch: Dispatch, getState: GetState) => {
    return dispatch(handleGrantAdmin(email));
  };
};

export const sendRegister = (params: Object): Action => {
  return {
    [CALL_API]: {
      types: [Types.REGISTER_REQUEST, Types.REGISTER_SUCCESS, Types.REGISTER_FAILURE],
      endpoint: `/users/register?callback_url=${CALLBACK_URL}`,
      initRequest: request.post(null, params)
    }
  };
};

export const register = (params: Object): ThunkAction => {
  return (dispatch: Dispatch, getState: GetState) => {
    return dispatch(sendRegister(params));
  };
};

export const handleUpdate = (params: Object): Action => {
  return {
    [CALL_API]: {
      types: [Types.UPDATE_USER_REQUEST, Types.UPDATE_USER_SUCCESS, Types.UPDATE_USER_FAILURE],
      endpoint: `/users/update?callback_url=${CALLBACK_URL}`,
      initRequest: request.put(cookie.load('authToken'), params)
    }
  };
};

export const update = (params: Object): ThunkAction => {
  return (dispatch: Dispatch, getState: GetState) => {
    return dispatch(handleUpdate(params));
  };
};

export const sendLogin = (params: Object): Action => {
  return {
    [CALL_API]: {
      types: [Types.LOGIN_REQUEST, Types.LOGIN_SUCCESS, Types.LOGIN_FAILURE],
      endpoint: `/auth/login?callback_url=${CALLBACK_URL}`,
      initRequest: request.post(null, params)
    }
  };
};

export const signin = (params: Object): ThunkAction => {
  return (dispatch: Dispatch, getState: GetState) => {
    return dispatch(sendLogin(params));
  };
};

// authorize with facebook
const sendFacebookLogin = (code: string): Action => {
  return {
    [CALL_API]: {
      types: [Types.FACEBOOK_LOGIN_REQUEST, Types.LOGIN_SUCCESS, Types.LOGIN_FAILURE],
      endpoint: `/auth/facebook?code=${code}&callback_url=${CALLBACK_URL}`,
      initRequest: request.post(null)
    }
  };
};

export const signinFacebook = (code: string): ThunkAction => {
  return (dispatch: Dispatch, getState: GetState) => {
    return dispatch(sendFacebookLogin(code));
  };
};

// authorize with linkedin
const sendLinkedinLogin = (authCode: string): Action => {
  return {
    [CALL_API]: {
      types: [Types.LINKEDIN_LOGIN_REQUEST, Types.LOGIN_SUCCESS, Types.LOGIN_FAILURE],
      endpoint: `/auth/linkedin?code=${authCode}&callback_url=${CALLBACK_URL}`,
      initRequest: request.post(null)
    }
  };
};

export const signinLinkedin = (authCode: string): ThunkAction => {
  return (dispatch: Dispatch, getState: GetState) => {
    return dispatch(sendLinkedinLogin(authCode));
  };
};

// logout
const handleLogout = (): Action => {
  return {
    [CALL_API]: {
      types: [Types.LOGOUT_REQUEST, Types.LOGOUT_SUCCESS, Types.LOGOUT_FAILURE],
      endpoint: `/auth/logout`,
      initRequest: request.post(cookie.load('authToken'))
    }
  };
};

export const logout = (): ThunkAction => {
  return (dispatch: Dispatch, getState: GetState) => {
    return dispatch(handleLogout());
  };
};

// change password
const handleChangePassword = (params: Object): Action => {
  return {
    [CALL_API]: {
      types: [Types.CHANGE_PASSWORD_REQUEST, Types.CHANGE_PASSWORD_SUCCESS, Types.CHANGE_PASSWORD_FAILURE],
      endpoint: `/users/resetpassword?callback_url=${CALLBACK_URL}`,
      initRequest: request.put(cookie.load('authToken'), params)
    }
  };
};

export const changePassword = (params: Object): ThunkAction => {
  return (dispatch: Dispatch, getState: GetState) => {
    return dispatch(handleChangePassword(params));
  };
};

// confirm change password
const handleConfirmChangePassword = (token: string): Action => {
  return {
    [CALL_API]: {
      types: [Types.CONFIRM_PASSWORD_CHANGE_REQUEST, Types.CONFIRM_PASSWORD_CHANGE_SUCCESS, Types.CONFIRM_PASSWORD_CHANGE_FAILURE],
      endpoint: `/users/resetpassword/${token}`,
      initRequest: request.get(null)
    }
  };
};

export const confirmChangePassword = (token: string): ThunkAction => {
  return (dispatch: Dispatch, getState: GetState) => {
    return dispatch(handleConfirmChangePassword(token));
  };
};

//forgot password
const handleForgotPassword = (params: Object): Action => {
  return {
    [CALL_API]: {
      types: [Types.FORGOT_PASSWORD_REQUEST, Types.FORGOT_PASSWORD_SUCCESS, Types.FORGOT_PASSWORD_FAILURE],
      endpoint: `/users/forgotpassword?callback_url=${FORGOT_PASSWORD_CALLBACK}`,
      initRequest: request.put(null, params)
    }
  };
};

export const forgotPassword = (params: Object): ThunkAction => {
  return (dispatch: Dispatch, getState: GetState) => {
    return dispatch(handleForgotPassword(params));
  };
};
//retrieve password
const handleRetrievePassword = (token: string, params: Object): Action => {
  return {
    [CALL_API]: {
      types: [Types.RETRIEVE_PASSWORD_REQUEST, Types.RETRIEVE_PASSWORD_SUCCESS, Types.RETRIEVE_PASSWORD_FAILURE],
      endpoint: `/users/retrievepassword?resetToken=${token}`,
      initRequest: request.put(null, params)
    }
  };
};

export const retrievePassword = (token: string, params: Object): ThunkAction => {
  return (dispatch: Dispatch, getState: GetState) => {
    return dispatch(handleRetrievePassword(token, params));
  };
};

//verify user
const handleVerify = (token: string, type: string): Action => {
  return {
    [CALL_API]: {
      types: [Types.VERIFY_USER_REQUEST, Types.VERIFY_USER_SUCCESS, Types.VERIFY_USER_FAILURE],
      endpoint: `/users/verify/${token}?type=${type}`,
      initRequest: request.get(null)
    }
  };
};

export const verify = (token: string, type: string): ThunkAction => {
  return (dispatch: Dispatch, getState: GetState) => {
    return dispatch(handleVerify(token, type));
  };
};

//terminate token
const handleTerminateToken = (code: string, userAgent: string): Action => {
  return {
    [CALL_API]: {
      types: [Types.CONFIRM_TERMINATE_TOKEN_REQUEST, Types.CONFIRM_TERMINATE_TOKEN_SUCCESS, Types.CONFIRM_TERMINATE_TOKEN_FAILURE],
      endpoint: `/auth/terminate?code=${code}&useragent=${userAgent}`,
      initRequest: request.get(null)
    }
  };
};

export const terminateToken = (code: string, userAgent: string) => {
  return (dispatch: Dispatch, getState: GetState) => {
    return dispatch(handleTerminateToken(code, userAgent));
  };
};

//verify phone number
const handleVerifyPhoneNumber = (number: string): Action => {
  const cleanedNumber = number.replace(/\+\.-\s+/g, '');
  return {
    [CALL_API]: {
      types: [Types.VERIFY_PHONE_NUMBER_REQUEST, Types.VERIFY_PHONE_NUMBER_SUCCESS, Types.VERIFY_PHONE_NUMBER_FAILURE],
      endpoint: `/users/verifyPhoneNumber`,
      initRequest: request.post(cookie.load('authToken'), {number: cleanedNumber})
    }
  };
};

export const verifyPhoneNumber = (number: string): ThunkAction => {
  return (dispatch: Dispatch, getState: GetState) => {
    return dispatch(handleVerifyPhoneNumber(number));
  };
};

const handleCheckVerifiedNumber = (requestId: string, code: string): Action => {
  return {
    [CALL_API]: {
      types: [Types.CHECK_VERIFY_NUMBER_REQUEST, Types.CHECK_VERIFY_NUMBER_SUCCESS, Types.CHECK_VERIFY_NUMBER_FAILURE],
      endpoint: `/users/verifyPhoneNumber/check?request_id=${requestId}`,
      initRequest: request.post(cookie.load('authToken'), {code})
    }
  };
};

export const checkVerifiedNumber = (requestId: string, code: string): ThunkAction => {
  return (dispatch: Dispatch, getState: GetState) => {
    return dispatch(handleCheckVerifiedNumber(requestId, code));
  };
};

const handleCancelVerifyingNumber = (requestId: string): Action => {
  return {
    [CALL_API]: {
      types: [Types.CANCEL_VERIFYING_NUMBER_REQUEST, Types.CANCEL_VERIFYING_NUMBER_SUCCESS, Types.CANCEL_VERIFYING_NUMBER_FAILURE],
      endpoint: `/users/verifyPhoneNumber/cancel?request_id=${requestId}`,
      initRequest: request.put(cookie.load('authToken'))
    }
  };
};

export const cancelVerifyingNumber = (requestId: string): ThunkAction => {
  return (dispatch: Dispatch) => {
    return dispatch(handleCancelVerifyingNumber(requestId));
  };
};

// retrieve the meeting room bookings
const handleRetrieveMeetingRoomBookings = (): Action => {
  return {
    [CALL_API]: {
      types: [Types.RETRIEVE_MEETING_ROOM_BOOKINGS_REQUEST, Types.RETRIEVE_MEETING_ROOM_BOOKINGS_SUCCESS, Types.RETRIEVE_MEETING_ROOM_BOOKINGS_FAILURE],
      endpoint: `/users/bookings`,
      initRequest: request.get(cookie.load('authToken'))
    }
  };
};

export const retrieveMeetingRoomBookings = (): ThunkAction => {
  return (dispatch: Dispatch, getState: GetState) => {
    return dispatch(handleRetrieveMeetingRoomBookings());
  };
};

// delete a user
const handleRemoveUser = (id: string): Action => {
  return {
    [CALL_API]: {
      types: [Types.REMOVE_USER_REQUEST, Types.REMOVE_USER_SUCCESS, Types.REMOVE_USER_FAILURE],
      endpoint: `/users/${id}`,
      initRequest: request.delete(cookie.load('authToken'))
    }
  };
};

export const removeUser = (id: string): ThunkAction => {
  return (dispatch: Dispatch, getState: GetState) => {
    return dispatch(handleRemoveUser(id));
  };
};

//reAuthenticate
const handleReAuthenticate = (): Action => {
  return {
    [CALL_API]: {
      types: [Types.REAUTHENTICATE_REQUEST, Types.REAUTHENTICATE_SUCCESS, Types.REAUTHENTICATE_FAILURE],
      endpoint: `/auth/re-authenticate`,
      initRequest: request.post(cookie.load('authToken'))
    }
  };
};

export const reAuthenticate = (): ThunkAction => {
  return (dispatch: Dispatch, getState: GetState) => {
    return dispatch(handleReAuthenticate());
  };
};

const handleGetUserById = (id: string): Action => {
  return {
    [CALL_API]: {
      types: [Types.GET_USER_BY_ID_REQUEST, Types.GET_USER_BY_ID_SUCCESS, Types.GET_USER_BY_ID_FAILURE],
      endpoint: `/users/${id}`,
      initRequest: request.get()
    }
  };
};

export const getUserById = (id: string): ThunkAction => {
  return (dispatch: Dispatch, getState: GetState) => {
    return dispatch(handleGetUserById(id));
  };
};

const handleSelectUser = (user: Object): Object => {
  return {
    type: Types.SELECT_USER_SUCCESS,
    user
  };
};

export const selectUser = (user: Object): ThunkAction => {
  return (dispatch: Dispatch, getState: GetState) => {
    return dispatch(handleSelectUser(user));
  };
};

const handleUpdateUserById = (userId: string, params: Object): Action => {
  return {
    [CALL_API]: {
      types: [Types.UPDATE_USER_BY_ID_REQUEST, Types.UPDATE_USER_BY_ID_SUCCESS, Types.UPDATE_USER_BY_ID_FAILURE],
      endpoint: `/users/${userId}/update`,
      initRequest: request.put(cookie.load('authToken'), params)
    }
  };
};

export const updateUserById = (userId: string, params: Object): ThunkAction => {
  return (dispatch: Dispatch, getState: GetState) => {
    return dispatch(handleUpdateUserById(userId, params));
  };
};

export type { ThunkAction }