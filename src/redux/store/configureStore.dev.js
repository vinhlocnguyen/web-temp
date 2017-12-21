import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import logger from 'redux-logger';
import api from '../middleware/api';
import rootReducer from '../reducers';
// import DevTools from '../../web/containers/DevTools';

// Grab the state from a global injected into server-generated HTML
const preloadedState = window.__PRELOADED_STATE__;

export default function configureStore(initialState) {
  const store = createStore(
    rootReducer,
    preloadedState,
    compose(
      applyMiddleware(thunk, api, logger)
      // DevTools.instrument()
    )
  );

  if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept('../reducers', () => {
      const nextRootReducer = require('../reducers').default;
      store.replaceReducer(nextRootReducer);
    });
  }

  return store;
}
