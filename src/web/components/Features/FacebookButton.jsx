import PropTypes from 'prop-types';
/* global FB: false */

import React, { Component } from 'react';
import { intlShape, injectIntl } from 'react-intl';
import {Colors} from '../../theme.js';
import { connect } from 'react-redux';
import ColoredButton from '../UI/ColoredButton';
import { FACEBOOK, AUTHORIZATION_REDIRECT } from '../../../../config';
import { FacebookIcon } from '../UI/Icons';
import clientStorage from '../../../redux/helpers/clientStorage';

import ReactGA from 'react-ga';

//--intend for server-render
const isBrowser = typeof window !== 'undefined';

class FacebookButton extends Component {
  signin(code) {
    this.props.handleSignInFunc(code);
  }

  handleClick() {
    ReactGA.event({
      category: 'User',
      action: 'Sign in',
      label: 'Sign in with Facebook account'
    });
    if (isBrowser) {
      window.handlePopupResult = (code) => {
        this.props.onWaiting();
        this.signin(code);
      };

      // Check if standalone mode
      // Standalone mode open new window dose not return result to opener.
      // So open login in current window in standalone mode
      if ("standalone" in navigator && navigator.standalone) {
        const url = `https://www.facebook.com/v2.9/dialog/oauth` +
        `?response_type=code&client_id=${FACEBOOK.APP_ID}` +
        `&redirect_uri=${AUTHORIZATION_REDIRECT}` + `?accountType=facebook` +
        `&scope=${FACEBOOK.SCOPE}`;

        window.location = url;
      } else {
        window.open(
          `https://www.facebook.com/v2.9/dialog/oauth` +
          `?response_type=code&client_id=${FACEBOOK.APP_ID}` +
          `&redirect_uri=${AUTHORIZATION_REDIRECT}` +
          `&scope=${FACEBOOK.SCOPE}`,
          'FACEBOOK Authorization',
          `width=600,height=500`
        );
      }
    }
  }

  render() {
    const {formatMessage} = this.props.intl;

    return (
      <ColoredButton
        label={formatMessage({id: 'login.facebookButton'})}
        backgroundColor={Colors.Facebook}
        handleClick={this.handleClick.bind(this)}
        icon={<FacebookIcon />}
      />
    );
  }
}

FacebookButton.contextTypes = {
  router: PropTypes.object.isRequired
};

FacebookButton.propTypes = {
  intl: intlShape.isRequired,
  error: PropTypes.object,
  onWaiting: PropTypes.func,
  onError: PropTypes.func,
  handleSignInFunc: PropTypes.func
};

const mapStateToProps = state => state;

export default connect(mapStateToProps)(injectIntl(FacebookButton));
