import PropTypes from 'prop-types';
import React, { Component } from 'react';
import {intlShape, injectIntl, FormattedMessage} from 'react-intl';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import TextField from './UI/TextField';
import CircularProgress from 'material-ui/CircularProgress';
import {Colors} from '../theme.js';
import {signin} from '../../redux/actions/user';
import {resetError} from '../../redux/actions/error';
import validation from '../../redux/helpers/validation';
import ErrorMessage from './Features/ErrorMessage';
import FacebookButton from './Features/FacebookButton';
import LinkedinButton from './Features/LinkedinButton';
import ColorBackground from './Backgrounds/ColorBackground';
import ColoredButton from './UI/ColoredButton';
import Logo from './UI/Logo';
import Footer from './UI/Footer';
import {MailIcon, PasswordIcon} from './UI/Icons';
import ReactGA from 'react-ga';
import clientStorage from '../../redux/helpers/clientStorage';

import { parseQueryStringToObject } from '../../redux/helpers/query';
import { signinFacebook } from '../../redux/actions/user';
import { signinLinkedin } from '../../redux/actions/user';
import styled from 'styled-components';
import { media, ContentContainer, TouchTapDiv } from './styleUlti';
//--intend for server-render
const isBrowser = typeof window !== 'undefined';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-content: space-between;
  color: ${Colors.PrimaryTextColor};
  position: relative;
`;
const HorizontalContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-content: space-between;
`;
const ResigerWrapper = styled.div`
  width: 100%;
  text-align: center;
  margin-top: 31px;
  margin-bottom: 16px;
  font-family: Montserrat;
  font-size: 15px;
  font-weight: 300;
  line-height: 1;
  color: rgba(74, 74, 74, 0.54);
`;
const LogoWrapper = styled(TouchTapDiv)`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;
const ForgotLink = styled.div`
  margin: 20px 0 12px 0;
  opacity: 0.87;
  font-family: Montserrat;
  font-size: 14px;
  font-weight: 300;
  line-height: 1;
  color: #0874ba;
`;
const OrLoginWith = styled.span`
  opacity: 0.54;
  font-family: Montserrat;
  font-size: 15px;
  font-weight: 300;
  line-height: 1;
  margin-top: 24px;
  text-align: center;
  color: #4a4a4a;
`;

export class LoginPage extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      email: {
        text: null,
        valid: false,
        error: null
      },
      password: {
        text: null,
        valid: false,
        error: null
      },
      error: null,
      errorMessage: null,
      showMessage: false,
      isWaiting: false
    };
    this.handleSignIn = this.handleSignIn.bind(this);
    this.validateEmail = this.validateEmail.bind(this);
    this.validatePassword = this.validatePassword.bind(this);
    this.handleWaiting = this.handleWaiting.bind(this);
    this.checkErrors = this.checkErrors.bind(this);
    this.handleFacebookSignIn = this.handleFacebookSignIn.bind(this);
    this.handleLinkedInSignIn = this.handleLinkedInSignIn.bind(this);
    this.handleChangeEmail = this.handleChangeEmail.bind(this);
  }

  componentWillMount() {
    const params = this.props.location.search && parseQueryStringToObject(this.props.location.search);
    const code = params.code;
    if (code && isBrowser) {
      // Use for redirect url if using standalone mode.
      if(!window.opener) {
        const { accountType } = this.props.location.query;
        if (accountType === 'facebook') {
          this.handleFacebookSignIn(code);
        } else {
          this.handleLinkedInSignIn(code);
        }
      } else {
        window.opener.handlePopupResult(code);
        window.close();
      }
    }
  }

	componentDidMount() {
		if (this.props.user.isAuthenticated && clientStorage.getItem('isAuthenticated')) {
			this.context.router.history.push('/');
		}
	}

  handleFacebookSignIn(code) {
    this.props.signinFacebook(code).then(_ => {
      this.checkErrors();
      this.handleWaiting();
      if (!this.props.error) {
        isBrowser && clientStorage.setItem('isAuthenticated', true);
        if (isBrowser && !clientStorage.getItem('buildingId')) {
          this.context.router.history.push({
            pathname: '/select-building',
            state: { hasBackButton: false }
          });
        } else {
          this.context.router.history.push('/');
        }
      }
    });
  }

  handleLinkedInSignIn(code) {
    this.props.signinLinkedin(code).then(_ => {
      this.checkErrors();
      this.handleWaiting();
      if (!this.props.error) {
        isBrowser && clientStorage.setItem('isAuthenticated', true);
        if (isBrowser && !clientStorage.getItem('buildingId')) {
          this.context.router.history.push({
            pathname: '/select-building',
            state: { hasBackButton: false }
          });
        } else {
          this.context.router.history.push('/');
        }
      }
    });
  }

  checkErrors() {
    const {formatMessage} = this.props.intl;
    if (this.props.error) {
      if (this.props.error.status === 401) {
        this.setState({
          error: this.props.error.status,
          errorMessage: formatMessage({id: 'loginPage.wrong_username_password'}),
          showMessage: true
        });
      } else {
        this.setState({
          error: this.props.error.status,
          showMessage: true
        });
      }
    }
  }

  validatePassword(e) {
    const validPass = validation.isRequired(e.target.value);
    this.setState({
      password: {
        text: e.target.value,
        valid: validPass.valid,
        error: validPass.error
      }
    });
  }

  handleChangeEmail(e) {
    let email = this.state.email;
    email.text = e.target.value;
    this.setState({
      email: email
    });
  }

  validateEmail() {
    let email = this.state.email;
    const validEmail = validation.email(email.text);
    this.setState({
      email: {
        text: email.text,
        valid: validEmail.valid,
        error: validEmail.error
      }
    });
  }

  validateRequiredField() {
    const email = this.state.email;
    const password = this.state.password;

    //isRequired validate
    const validEmail = validation.isRequired(email.text);
    const validPassword = validation.isRequired(password.text);

    this.setState({
      email: {
        text: email.text,
        valid: validEmail.valid && email.valid,
        error: validEmail.error
          ? validEmail.error
          : email.error
      },
      password: {
        text: password.text,
        valid: validPassword.valid,
        error: validPassword.error
      }
    });
  }

  validate() {
    //isRequiredField
    this.validateRequiredField();
    //validate
    return this.state.email.valid && this.state.password.valid;
  }

  handleSignIn(type, e) {
    if (this.validate()) {
      // Sanitize the input
      const email = this.state.email.text.trim().toLowerCase();
      const password = this.state.password.text.trim();
      const params = {
        email: email,
        password: password
      };
      this.props.signin(params).then(_ => {
        this.checkErrors();
        this.handleWaiting();
        if (!this.props.error) {
          isBrowser && clientStorage.setItem('isAuthenticated', true);
          if (isBrowser && !clientStorage.getItem('buildingId')) {
            this.context.router.history.push({
              pathname: '/select-building',
              state: { hasBackButton: false }
            });
          } else {
            this.context.router.history.push('/');
          }
        }
      });
      this.handleWaiting();
      ReactGA.event({category: 'User', action: 'Sign in', label: 'Sign in with Drops account'});
    }
  }

  handleWaiting() {
    this.setState({isWaiting: !this.state.isWaiting});
  }

  renderLoading() {
    return this.state.isWaiting
      ? (
        <div className='loading'>
          <CircularProgress size={60} />
        </div>
      )
      : null;
  }

  render() {
    const {formatMessage} = this.props.intl;
    const registerLink = () => (
      <ResigerWrapper>
        <FormattedMessage id='login.signup'/>&nbsp;
        <Link
          style={{
            textDecoration: 'none'
          }}
          to='/register'>
            <FormattedMessage id='login.signupLink'/>
        </Link>
      </ResigerWrapper>
    );
    const forgotPasswordLink = (
      <span>
        <Link to='/forgot-password'><FormattedMessage id='login.forgotLink'/></Link>
      </span>
    );

    const code = this.props.location.query && this.props.location.query.code;
    return !code ? (
      <ColorBackground color='#eceff1'>
        <Container className={'page'} >
          <ContentContainer>
          <LogoWrapper>
            <Logo width='178px' height='60px' />
          </LogoWrapper>
          <Container>
            <Container>
              <TextField
                label={formatMessage({id: 'login.email'})}
                errorText={this.state.email.error}
                onChange={this.handleChangeEmail}
                onBlur={this.validateEmail}
                icon={<MailIcon/>}
                type='email'/>

              <TextField
                label={formatMessage({id: 'login.password'})}
                type='password'
                errorText={this.state.password.error}
                onChange={this.validatePassword}
                icon={<PasswordIcon/>} />

              <ForgotLink>{forgotPasswordLink}</ForgotLink>
            </Container>

            <Container>
              <ColoredButton
                label={formatMessage({id: 'login.submit'})}
                handleClick={this.handleSignIn}
              />

              <OrLoginWith><FormattedMessage id='login.orLoginWith'/></OrLoginWith>
              <HorizontalContainer>
                <FacebookButton onWaiting={this.handleWaiting} onError={this.checkErrors} handleSignInFunc={this.handleFacebookSignIn}/>
                <div style={{
                  marginRight: '10px'
                }} />
                <LinkedinButton onWaiting={this.handleWaiting} onError={this.checkErrors} handleSignInFunc={this.handleLinkedInSignIn}/>
              </HorizontalContainer>
              {registerLink()}
            </Container>
          </Container>

          {this.renderLoading()}

          <Footer />

          <ErrorMessage
            error={this.state.error}
            message={this.state.errorMessage}
            open={this.state.showMessage} handleClose={() => {
              this.setState({showMessage: false});
              this.props.resetError();
            }}
          />
          </ContentContainer>
        </Container>
      </ColorBackground>
    ) : null;
  }
};

LoginPage.contextTypes = {
  router: PropTypes.object.isRequired
};

LoginPage.propTypes = {
  intl: intlShape.isRequired,
	location: PropTypes.object,
	user: PropTypes.object,
  error: PropTypes.object,
	signin: PropTypes.func
};

const mapStateToProps = state => ({
	user: state.user,
	error: state.error
});

const mapDispatchToProps = {
  signin,
  resetError,
  signinFacebook,
  signinLinkedin
};

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(LoginPage));
