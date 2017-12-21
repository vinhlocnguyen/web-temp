import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Provider, connect } from 'react-redux';
import { Route, BrowserRouter } from 'react-router-dom';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import WaitingScreen from './WaitingScreen';
import { IntlProvider, addLocaleData } from 'react-intl';
import routes from '../routes';
import { Theme } from '../theme';
import * as localeMessage from '../../redux/locales';
import { DEFAULT_LANGUAGE, GOOGLE_ANALYTICS, BUILD_VERSION } from '../../../config';
import ReactGA from 'react-ga';
import { getUser, reAuthenticate } from '../../redux/actions/user';
import cookie from 'react-cookie';
import clientStorage from '../../redux/helpers/clientStorage';
import App from './App';

//--intend for server-render
const isBrowser = typeof window !== 'undefined';

import '../assets/styles/reset.scss';
import '../assets/styles/main.scss';

addLocaleData(require('../../../node_modules/react-intl/locale-data/fr'));
addLocaleData(require('../../../node_modules/react-intl/locale-data/en'));
addLocaleData(require('../../../node_modules/react-intl/locale-data/nl'));

ReactGA.initialize(GOOGLE_ANALYTICS.TRACK_ID);

class Root extends Component {
  componentWillMount() {
    if (this.props.user.isAuthenticated) {
      this.props.getUser();
    }

    if (isBrowser && cookie.load('authToken') && BUILD_VERSION !== clientStorage.getItem('BUILD_VERSION')) {
      clientStorage.setItem('BUILD_VERSION', BUILD_VERSION);
      this.props.reAuthenticate();
    }
  }

  getLocale(user) {
    const userLang = (user && user.language) || navigator.language;
    const languages = ['en', 'fr', 'nl'];
    return languages.find(ele => userLang.toLowerCase().includes(ele)) || DEFAULT_LANGUAGE;
  }

  getMessages(locale) {
    return localeMessage[locale] || localeMessage[DEFAULT_LANGUAGE];
  }

  logPageView() {
    if (typeof window !== 'undefined') {
      ReactGA.set({ page: window.location.pathname });
      ReactGA.pageview(window.location.pathname);
    }
  }

  render() {
    const { store, history, user } = this.props;
    const locale = this.getLocale(user.info);
    const messages = this.getMessages(locale);

    return (
      <Provider store={store}>
        <MuiThemeProvider muiTheme={Theme}>
          <IntlProvider locale={locale} messages={messages}>
            <div className={'container'}>
              <WaitingScreen>
                <BrowserRouter>
                  <Route component={App} history={history} {...this.props} />
                </BrowserRouter>
              </WaitingScreen>
            </div>
          </IntlProvider>
        </MuiThemeProvider>
      </Provider>
    );
  }
}

Root.propTypes = {
  store: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
  getUser: PropTypes.func.isRequired,
  reAuthenticate: PropTypes.func.isRequired
};

const mapStateToProps = state => {
  return {
    user: state.user
  };
};

const mapActionsToProps = {
  getUser,
  reAuthenticate
};

export default connect(mapStateToProps, mapActionsToProps)(Root);
