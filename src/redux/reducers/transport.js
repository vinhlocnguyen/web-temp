// @flow
import * as Types from '../constants/ActionTypes';
import merge from '../helpers/deepMerge';
import type { TransportState as State } from '../constants/FlowTypes';
import type { ThunkAction } from '../actions/transport';

const _sortByETA = (a, b) => {
  if (a.eta > b.eta) {
    return 1;
  }
  if (a.eta < b.eta) {
    return -1;
  }
  // a is equal to b
  return 0;
};

const initState = {
  publicTransports: [],
  home: {},
  filters: []
};

const transport = (state: State = initState, action: ThunkAction): State => {
  switch (action.type) {
    case Types.ETA_TRANSPORTS_SUCCESS:
      const newState = Object.assign({}, state);
      // flatten schdules
      newState.publicTransports = action.response.map(item => {
        if (!['velib', 'villo', 'velo', 'taxi'].includes(item.type.toLowerCase())) {
          item[item.type] = item[item.type].sort(_sortByETA);
        }
        return item;
      });
      return newState;

    case Types.CALCULATE_HOME_SUCCESS:
      return merge({}, state, { home: action.response });

    case Types.SET_TRANSPORT_FILTERS:
      return merge({}, state, { filters: action.data.filters });

    default: return state;
  }
};

export default transport;
