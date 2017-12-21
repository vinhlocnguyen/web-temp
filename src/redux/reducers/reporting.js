import merge from '../helpers/deepMerge';
import * as Types from '../constants/ActionTypes';
import type { ThunkAction } from '../actions/reporting';
import type { Report as State } from '../constants/FlowTypes';

const reporting = (state: State = { isReported: false, isResolved: false }, action: ThunkAction): State => {
  switch (action.type) {
    case Types.REPORTING_SUCCESS:
      return merge({}, state, { isReported: true });
    case Types.REPORTING_FAILURE:
      return merge({}, state, { isReported: false });
    case Types.RESOLVE_REPORT_SUCCESS:
      return merge({}, state, { isResolved: true });
    default: return merge({}, state, { isReported: null, isResolved: false });
  }
};

export default reporting;
