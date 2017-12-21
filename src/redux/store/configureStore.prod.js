import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import api from '../middleware/api';
import ErrorSentry from '../middleware/errorSentry';
import rootReducer from '../reducers';

const preloadedState = window.__PRELOADED_STATE__;

export default function configureStore(initialState) {
  return createStore(
    rootReducer,
    preloadedState,
    applyMiddleware(thunk, api, ErrorSentry)
  );
}
