import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { intlShape, injectIntl } from 'react-intl';
import FlatButton from '../UI/ColoredButton';
import { Colors } from '../../theme.js';
import { connect } from 'react-redux';
import { signinLinkedin } from '../../../redux/actions/user';
import { LINKEDIN, AUTHORIZATION_REDIRECT } from '../../../../config';
import { LinkedInIcon } from '../UI/Icons';
import ReactGA from 'react-ga';
//--intend for server-render
const isBrowser = typeof window !== 'undefined';

class LinkedinButton extends Component {
  getAccessToken(code) {
    this.props.handleSignInFunc(code);
  }

  handleSignIn () {
    ReactGA.event({
      category: 'User',
      action: 'Sign in',
      label: 'Sign in with Linkedin account'
    });
    if (isBrowser) {
      window.handlePopupResult = (code) => {
        this.props.onWaiting();
        this.getAccessToken(code);
      };

      // Check if standalone mode
      // Standalone mode open new window dose not return result to opener.
      // So open login in current window in standalone mode
      if ("standalone" in navigator && navigator.standalone) {
        const url = `https://www.linkedin.com/oauth/v2/authorization` +
        `?response_type=code&client_id=${LINKEDIN.APP_ID}&redirect_uri=${AUTHORIZATION_REDIRECT}` +
        `&state=${LINKEDIN.STATE_CODE}&scope=${LINKEDIN.SCOPE}`

        window.location = url;
      } else {
        window.open(
          `https://www.linkedin.com/oauth/v2/authorization` +
          `?response_type=code&client_id=${LINKEDIN.APP_ID}&redirect_uri=${AUTHORIZATION_REDIRECT}` +
          `&state=${LINKEDIN.STATE_CODE}&scope=${LINKEDIN.SCOPE}`,
          'Linkedin Authorization',
          `width=600,height=500`
        );
      }
    }
  }

  render() {
    const {formatMessage} = this.props.intl;
    return (
      <FlatButton
        label={formatMessage({id: 'login.linkedinButton'})}
        handleClick={this.handleSignIn.bind(this)}
        backgroundColor={Colors.LinkedIn}
        icon={<LinkedInIcon />}
      />
    );
  }
}

LinkedinButton.contextTypes = {
  router: PropTypes.object.isRequired
};

LinkedinButton.propTypes = {
  intl: intlShape.isRequired,
  error: PropTypes.object,
  onWaiting: PropTypes.func,
  onError: PropTypes.func,
  handleSignInFunc: PropTypes.func
};

const mapStateToProps = state => state;

export default connect(mapStateToProps)(injectIntl(LinkedinButton));
