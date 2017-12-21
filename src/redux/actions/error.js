import * as Types from '../constants/ActionTypes';

const handleResetError = () => {
  return {
    type: Types.RESET_ERROR_SUCCESS
  };
};

export const resetError = () => {
  return (dispatch, getState) => {
    dispatch(handleResetError());
  };
};

export const setError = (status, message) => {
  return (dispatch, getState) => {
    dispatch({
      type: Types.SET_ERROR_SUCCESS,
      error: {
        status,
        message
      }
    });
  };
};

export const reportError = (err) => {
  return (dispatch, getState) => {
    dispatch({
      type: Types.REPORT_ERROR_SUCCESS,
      err
    });
  };
};
