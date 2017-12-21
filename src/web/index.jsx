import 'react-hot-loader/patch';
import React from 'react';
import ReactDOM from 'react-dom';
// import { browserHistory } from 'react-router';
import createHistory from 'history/createBrowserHistory';
import Root from './containers/Root';
import configureStore from '../redux/store/configureStore';
import injectTapEventPlugin from 'react-tap-event-plugin';
import { AppContainer } from 'react-hot-loader';

const store = configureStore();
const history = createHistory();
injectTapEventPlugin({
  shouldRejectClick: function (lastTouchEventTimestamp, clickEventTimestamp) {
    return true;
  }
});

const preventZoomiOS = () => {
  // Prevent pinch-to-zoom
  document.addEventListener('touchmove', function (event) {
    if (event.scale !== 1) { event.preventDefault(); }
  }, false);

  // Prevent double tap to zoom
  let lastTouchEnd = 0;
  document.addEventListener('touchend', function (event) {
    let now = (new Date()).getTime();
    if (now - lastTouchEnd <= 300) {
      event.preventDefault();
    }
    lastTouchEnd = now;
  }, false);
}

preventZoomiOS();

// ReactDOM.render(
ReactDOM.hydrate(
  (<AppContainer>
    <Root store={store} history={history} />
  </AppContainer>), document.getElementById('app')
);

if (module.hot) {
  module.hot.accept('./containers/Root.jsx', () => {
    const NextRootContainer = require('./containers/Root.jsx').default;

    // ReactDOM.render((
    ReactDOM.hydrate((
      <AppContainer>
        <NextRootContainer store={store} history={history} />
      </AppContainer>
    ), document.getElementById('app'));
  });
}
