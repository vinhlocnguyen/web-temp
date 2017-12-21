import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Provider, connect } from 'react-redux';
import { BrowserRouter, Route } from 'react-router-dom';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import WaitingScreen from './WaitingScreen';
// import DevTools from './DevTools';
import { Theme } from '../theme';
import { IntlProvider, addLocaleData } from 'react-intl';
import * as localeMessage from '../../redux/locales';
import { DEFAULT_LANGUAGE } from '../../../config';
import { getUser } from '../../redux/actions/user';
import App from './App';

addLocaleData(require('../../../node_modules/react-intl/locale-data/fr'));
addLocaleData(require('../../../node_modules/react-intl/locale-data/en'));
addLocaleData(require('../../../node_modules/react-intl/locale-data/nl'));

import '../assets/styles/reset.scss';
import '../assets/styles/main.scss';

class Root extends Component {
  componentWillMount() {
    if (this.props.user.isAuthenticated) {
      this.props.getUser();
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
  getUser: PropTypes.func.isRequired
};

const mapStateToProps = state => {
  return {
    user: state.user
  };
};

const mapActionsToProps = {
  getUser
};

export default connect(mapStateToProps, mapActionsToProps)(Root);
