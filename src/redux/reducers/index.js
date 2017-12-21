import { combineReducers } from 'redux';
import reduceReducers from 'reduce-reducers';
import building from './building';
import user from './user';
import reporting from './reporting';
import service from './service';
import suggestion from './suggestion';
import transport from './transport';
import error from './error';
import common from './common';
import category from './category';
import meetingRoom from './meetingRoom';

const rootReducer = reduceReducers(
  combineReducers({
    user,
    building,
    reporting,
    service,
    suggestion,
    transport,
    error,
    category,
    meetingRoom
  }),
  // cross-cutting concerns because here `state` is the whole state tree
  common
);

export default rootReducer;
