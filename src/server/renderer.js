import React from 'react';
import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import logger from 'redux-logger';
import api from '../redux/middleware/api';
import { Provider } from 'react-redux';
import reactDOMServer from 'react-dom/server';
import cookieParser from 'cookie-parser';
import reactCookie from 'react-cookie';
import rootReducer from '../redux/reducers';
// import { match, RouterContext } from 'react-router';
import { StaticRouter, matchPath, Route  } from 'react-router-dom';
import createHistory from 'history/createMemoryHistory';
import { Theme } from '../web/theme';
import { IntlProvider, addLocaleData } from 'react-intl';
import * as localeMessage from '../redux/locales';
import { DEFAULT_LANGUAGE } from '../../config';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Routes from '../web/routes';
import App from '../web/containers/App';
import path from 'path';
import RadiumWrapper from '../web/containers/RadiumWrapper';
import WaitingScreen from '../web/containers/WaitingScreen';
import injectTapEventPlugin from 'react-tap-event-plugin';
import { ServerStyleSheet, StyleSheetManager } from 'styled-components';

addLocaleData(require('react-intl/locale-data/fr'));
addLocaleData(require('react-intl/locale-data/en'));
addLocaleData(require('react-intl/locale-data/nl'));

module.exports = function(app) {
  app.use(cookieParser());
  app.engine('html', require('ejs').renderFile);
  app.set('view engine', 'html');
  app.set('views', path.join(__dirname, '../../build'));
  app.use(checkAuthorization);
  app.use(handleRender);
  injectTapEventPlugin();

  function checkAuthorization(req, res, next) {
    const loginPath = '/login';
    if (req.cookies && !req.cookies.authToken && req.path !== loginPath) {
      return res.redirect(loginPath);
    }
    return next();
  }

  function handleRender(req, res, next) {
    // plug the cookie
    reactCookie.plugToRequest(req, res);
    reactCookie.setRawCookie(req.headers.cookie);
    // Create a new Redux store instance;
    const initialState = {};
    const sheet = new ServerStyleSheet();
    const store = createStore(
      rootReducer,
      initialState,
      compose(
        applyMiddleware(thunk, api, logger)
      )
    );
    const history = createHistory(req.url);
    const context= {};

    const routes = Routes().props.children.map(r => r.props);
    const matchedRoutes = routes.filter(route => matchPath(req.path, route));

    if (!matchedRoutes || !matchedRoutes.length) {
      return res.status(404).send(new Error('Not found'));
    }

    const promises = matchedRoutes.map(match => {
      let fetching = fetchData(match.component);
      return fetching({ store, location: req.url, params: req.params, history })
    });

    return Promise.all(promises).then(() => {
      const locale = getLocale(reactCookie.load('user'));
      const messages = getMessages(locale);
      // Grab the initial state from our Redux store
      const preloadedState = store.getState();
      context.isServer = true;
      context.isAuthenticated = preloadedState.user.isAuthenticated;
      context.selectedBuilding = preloadedState.building && preloadedState.building.current && preloadedState.building.current.id;

      const html = reactDOMServer.renderToString(
        <Provider store={store}>
          <MuiThemeProvider muiTheme={Theme}>
            <IntlProvider locale={locale} messages={messages}>
              <StyleSheetManager sheet={sheet.instance}>
                <RadiumWrapper className={'container'} radiumConfig={{userAgent: req.headers['user-agent']}}>
                  <WaitingScreen>
                    <StaticRouter
                      location={req.url}
                      context={context}>
                        <Route component={App} history={history} />
                    </StaticRouter>
                  </WaitingScreen>
                </RadiumWrapper>
              </StyleSheetManager>
            </IntlProvider>
          </MuiThemeProvider>
        </Provider>
      );

      const styleTags = sheet.getStyleTags();
      
      const finalENV = {
        NODE_ENV: process.env.NODE_ENV,
        DOMAIN: process.env.DOMAIN,
        max_stops_search_distance: process.env.max_stops_search_distance,
        default_stops_search_distance: process.env.default_stops_search_distance,
        use_my_location_setting: process.env.use_my_location_setting,
        feature_manage_buildings: process.env.feature_manage_buildings,
        feature_manage_users: process.env.feature_manage_users,
        feature_delete_users: process.env.feature_delete_users,
        feature_manage_services: process.env.feature_manage_services,
        feature_coming_soon: process.env.feature_coming_soon,
        feature_work_page: process.env.feature_work_page,
        feature_service_opening_closing_time: process.env.feature_service_opening_closing_time,
        feature_service_sorting: process.env.feature_service_sorting,
        feature_switch_views: process.env.feature_switch_views,
        feature_log_to_sentry: process.env.feature_log_to_sentry,
        dummy_meeting_rooms: process.env.dummy_meeting_rooms
      }

      // Send the rendered page back to the client
      res.send(renderFullPage(html, finalENV, styleTags));
    }).catch(next);
  };

  function fetchData(component) {
    // Extract our page component
    const Comp = component.WrappedComponent;
    // Extract `fetchData` if exists
    return (Comp && Comp.fetchData) || (() => Promise.resolve());
  }

  function renderFullPage(html, finalENV, styles) {
    return `
    <!DOCTYPE html>
    <html lang="en">

    <head>
      <meta charset="utf-8">

      <title>Drops by FlatTurtle</title>

      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0" />

      <!-- Full screen capabilities -->
      <!-- iOS devices -->
      <meta name="apple-mobile-web-app-capable" content="no" />
      <!-- android -->
      <meta name="mobile-web-app-capable" content="no">

      <!-- Theme color -->
      <!-- Chrome, Firefox OS, Opera and Vivaldi -->
      <meta name="theme-color" content="#000">
      <!-- Windows Phone -->
      <meta name="msapplication-navbutton-color" content="#000">
      <!-- iOS Safari -->
      <meta name="apple-mobile-web-app-status-bar-style" content="#000">

      <link type="text/css" rel="stylesheet" href="//fast.fonts.net/cssapi/66253153-9c89-413c-814d-60d3ba0d6ac2.css" />
      <script src="https://use.fontawesome.com/3b2160ad48.js"></script>
      <link href='https://fonts.googleapis.com/css?family=Montserrat' rel='stylesheet' type='text/css'>
      <!-- main css -->
      <link type="text/css" rel="stylesheet" href="/styles.css" />

      <!-- polyfil intl.js for Safari -->
      <script src="https://cdn.polyfill.io/v2/polyfill.min.js?features=Intl.~locale.en,Intl.~locale.fr,Intl.~locale.nl"></script>

      <!-- Favicons in every size.. -->
      <link rel="apple-touch-icon-precomposed" sizes="57x57" href="favicon/apple-touch-icon-57x57.png" />
      <link rel="apple-touch-icon-precomposed" sizes="114x114" href="favicon/apple-touch-icon-114x114.png" />
      <link rel="apple-touch-icon-precomposed" sizes="72x72" href="favicon/apple-touch-icon-72x72.png" />
      <link rel="apple-touch-icon-precomposed" sizes="144x144" href="favicon/apple-touch-icon-144x144.png" />
      <link rel="apple-touch-icon-precomposed" sizes="60x60" href="favicon/apple-touch-icon-60x60.png" />
      <link rel="apple-touch-icon-precomposed" sizes="120x120" href="favicon/apple-touch-icon-120x120.png" />
      <link rel="apple-touch-icon-precomposed" sizes="76x76" href="favicon/apple-touch-icon-76x76.png" />
      <link rel="apple-touch-icon-precomposed" sizes="152x152" href="favicon/apple-touch-icon-152x152.png" />
      <link rel="icon" type="image/png" href="favicon/favicon-196x196.png" sizes="196x196" />
      <link rel="icon" type="image/png" href="favicon/favicon-96x96.png" sizes="96x96" />
      <link rel="icon" type="image/png" href="favicon/favicon-32x32.png" sizes="32x32" />
      <link rel="icon" type="image/png" href="favicon/favicon-16x16.png" sizes="16x16" />
      <link rel="icon" type="image/png" href="favicon/favicon-128.png" sizes="128x128" />
      <meta name="application-name" content="&nbsp;" />
      <meta name="msapplication-TileColor" content="#FFFFFF" />
      <meta name="msapplication-TileImage" content="favicon/mstile-144x144.png" />
      <meta name="msapplication-square70x70logo" content="favicon/mstile-70x70.png" />
      <meta name="msapplication-square150x150logo" content="favicon/mstile-150x150.png" />
      <meta name="msapplication-wide310x150logo" content="favicon/mstile-310x150.png" />
      <meta name="msapplication-square310x310logo" content="favicon/mstile-310x310.png" />

      <style>
        ${styles}
      </sctyle>
    </head>

    <body>
      <div id="app" style="height:100%">${html}</div>
      <script>
        window.__ENV__ = ${JSON.stringify(finalENV)};
      </script>
      <script src="/vendors.bundle.js"></script>
      <script src="/client.js"></script>
    </body>

    </html>
    `;
  };
};

function getLocale(user) {
  const userLang = (user && user.language) || 'en';
  const languages = ['en', 'fr', 'nl'];
  return languages.indexOf(userLang) > -1 ? userLang : DEFAULT_LANGUAGE;
}

function getMessages(locale) {
  return localeMessage[locale] || localeMessage[DEFAULT_LANGUAGE];
}
