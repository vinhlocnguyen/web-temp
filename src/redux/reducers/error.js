import * as Types from '../constants/ActionTypes';
import { errorHandler } from '../middleware/errorSentry';

const error = (state = null, action) => {
  switch (action.type) {
    case Types.RESET_ERROR_SUCCESS:
      return null;
    case Types.REPORT_ERROR_SUCCESS:
      errorHandler(action.err);
      return null;
    // also reset errors when the route is changed
    case '@@router/LOCATION_CHANGE':
      return null;
    case Types.SET_ERROR_SUCCESS:
      const newState = Object.assign({}, action.error);
      return newState;

    default: return state;
  }
};

export default error;
