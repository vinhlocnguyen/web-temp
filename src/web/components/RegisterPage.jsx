import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import {intlShape, injectIntl, FormattedMessage} from 'react-intl';
import TextField from './UI/TextField';
import CircularProgress from 'material-ui/CircularProgress';
import { signin, register } from '../../redux/actions/user';
import { resetError } from '../../redux/actions/error';
import validation from '../../redux/helpers/validation';
import ErrorMessage from './Features/ErrorMessage';
import ColorBackground from './Backgrounds/ColorBackground';
import ColoredButton from './UI/ColoredButton';
import Footer from './UI/Footer';
import Logo from './UI/Logo';
import { NameIcon, PasswordIcon, MailIcon } from './UI/Icons';
import ReactGA from 'react-ga';
import clientStorage from '../../redux/helpers/clientStorage';
import styled from 'styled-components';
import { media, ContentContainer, TouchTapDiv } from './styleUlti';
//--intend for server-render
const isBrowser = typeof window !== 'undefined';

const FlexBox = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
`;
const Container = ContentContainer.extend`
  width: auto;
  position: relative;
`;
const LogoWrapper = styled(TouchTapDiv)`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;
const LoginWrapper = styled.div`
  width: 100%;
  text-align: center;
  margin: 24px 0;
  font-family: Montserrat;
  font-size: 15px;
  font-weight: 300;
  line-height: 1;
  color: rgba(74, 74, 74, 0.54);
`;
const TouchTapSpan = (props) => <span {...props} />
const StyledLink = styled(TouchTapSpan)`
  color: #0c78be;
  cursor: pointer;
`;

export class RegisterPage extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      email: {
        text: null,
        valid: false,
        error: null
      },
      firstName: {
        text: null,
        valid: false,
        error: null
      },
      lastName: {
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
      showMessage: false,
      isWaiting: false
    };
    this.validateEmail = this.validateEmail.bind(this);
    this.validateFirstName = this.validateFirstName.bind(this);
    this.validateLastName = this.validateLastName.bind(this);
    this.validatePassword = this.validatePassword.bind(this);
    this.changeEmail = this.changeEmail.bind(this);
    this.handleRegister = this.handleRegister.bind(this);
    this.goBackLogin = this.goBackLogin.bind(this);
  }

  componentWillMount() {
    if (this.props.user.isAuthenticated) {
      this.context.router.history.push('/');
    }
  }

  checkErrors() {
    if (this.props.error) {
      this.setState({
        error: this.props.error.status,
        showMessage: true
      });
    }
  }

  changeEmail(e) {
    let email = this.state.email;
    email.text = e.target.value;
    this.setState({
      email: email
    });
  }

  validateEmail(e) {
    let email = this.state.email;
    const validEmail = validation.email(email.text);
    email.valid = validEmail.valid;
    email.error = validEmail.error;
    this.setState({
      email: email
    });
  }

  validatePassword(e) {
    const validPass = validation.passwordLength(e.target.value);
    this.setState({
      password: {
        text: e.target.value,
        valid: validPass.valid,
        error: validPass.error
      }
    });
  }

  validateFirstName(e) {
    const validFirstName = validation.name(e.target.value);
    this.setState({
      firstName: {
        text: e.target.value,
        valid: validFirstName.valid,
        error: validFirstName.error
      }
    });
  }

  validateLastName(e) {
    const validLastName = validation.name(e.target.value);
    this.setState({
      lastName: {
        text: e.target.value,
        valid: validLastName.valid,
        error: validLastName.error
      }
    });
  }

  validateRequiredField() {
    const email = this.state.email;
    const firstName = this.state.firstName;
    const lastName = this.state.lastName;
    const password = this.state.password;

    //isRequired validate
    const validEmail = validation.isRequired(email.text);
    const validFirstName = validation.isRequired(firstName.text);
    const validPassword = validation.isRequired(password.text);

    this.setState({
      email: {
        text: email.text,
        valid: validEmail.valid && email.valid,
        error: validEmail.error ? validEmail.error : email.error
      },
      firstName: {
        text: firstName.text,
        valid: validFirstName.valid && firstName.valid,
        error: validFirstName.error ? validFirstName.error : firstName.error
      },
      lastName: {
        text: lastName.text,
        valid: lastName.valid,
        error: lastName.error
      },
      password: {
        text: password.text,
        valid: validPassword.valid && password.valid,
        error: validPassword.error ? validPassword.error : password.error
      }
    });
  }

  validate() {
    //isRequired
    this.validateRequiredField();
    //validate
    return this.state.email.valid && this.state.firstName.valid && this.state.lastName.valid && this.state.password.valid;
  }

  handleWaiting() {
    this.setState({
      isWaiting: !this.state.isWaiting
    });
  }

  handleRegister(e) {
    if (this.validate()) {
      // Sanitize the input
      const email = this.state.email.text.trim().toLowerCase();
      const firstName = this.state.firstName.text.trim();
      const lastName = this.state.lastName.text.trim();
      const password = this.state.password.text.trim();
      const user = {
        privateEmail: email,
        firstName: firstName,
        lastName: lastName,
        password: password
      };
      this.props.register(user).then(_ => {
        this.checkErrors();
        const params = {
          email: email,
          password: password
        };
        if (!this.props.error) {
          this.props.signin(params).then(_ => {
            this.handleWaiting();
            this.checkErrors();
            if (!this.props.error) {
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
        } else {
          this.handleWaiting();
        }
      });
      this.handleWaiting();
      ReactGA.event({
        category: 'User',
        action: 'Create a new account'
      });
    }
  }

  renderLoading() {
    return this.state.isWaiting ? (
        <div className='loading'>
          <CircularProgress size={60} />
        </div>
      ) : null;
  }

  goBackLogin(e) {
    e.preventDefault();
    this.context.router.history.goBack("login")
  }

  render() {
    const {formatMessage} = this.props.intl;

    const alreadyHaveAnAccountLink = () => (
      <LoginWrapper>
        <FormattedMessage id='register.alreadyHaveAccount'/>&nbsp;
        <StyledLink onTouchTap={this.goBackLogin}><FormattedMessage id='register.login'/></StyledLink>
      </LoginWrapper>
    );

    return (
      <ColorBackground color="#eceff1">
        <Container className="page">

          <LogoWrapper onTouchTap={() => this.context.router.history.goBack("login")}>
            <Logo width='178px' height='60px' />
          </LogoWrapper>

          <FlexBox>
            <FlexBox>
              <TextField
                label={formatMessage({id: 'register.firstname'})}
                ref={ref => { this.firstName = ref; }}
                errorText={this.state.firstName.error}
                onChange={this.validateFirstName}
                icon={<NameIcon />}
              />
              <TextField
                label={formatMessage({id: 'register.lastname'})}
                ref={ref => { this.lastName = ref; }}
                errorText={this.state.lastName.error}
                onChange={this.validateLastName}
                icon={<NameIcon />}
              />
              <TextField
                label={formatMessage({id: 'register.email'})}
                ref={ref => { this.email = ref; }}
                errorText={this.state.email.error}
                onChange={this.changeEmail}
                onBlur={this.validateEmail}
                icon={<MailIcon />}
              />
              <TextField
                label={formatMessage({id: 'register.password'})}
                type='password'
                ref={ref => { this.password = ref; }}
                errorText={this.state.password.error}
                onChange={this.validatePassword}
                icon={<PasswordIcon />}
              />
            </FlexBox>

            <FlexBox>
              <ColoredButton
                label={formatMessage({id: 'register.submit'})}
                handleClick={this.handleRegister}
              />
              {alreadyHaveAnAccountLink()}
            </FlexBox>
          </FlexBox>

          {this.renderLoading()}

          <Footer />

          <ErrorMessage
            error={this.state.error}
            open={this.state.showMessage}
            handleClose={() => {
              this.setState({ showMessage: false });
              this.props.resetError();
            }}
          />
        </Container>
      </ColorBackground>
    );
  }
}

RegisterPage.contextTypes = {
  router: PropTypes.object.isRequired
};

RegisterPage.propTypes = {
  intl: intlShape.isRequired,
  user: PropTypes.object,
  error: PropTypes.object,
  signin: PropTypes.func,
  register: PropTypes.func,
  resetError: PropTypes.func
};

const mapStateToProps = state => ({
  user: state.user,
  error: state.error
});

export default connect(mapStateToProps, {signin, register, resetError})(injectIntl(RegisterPage));
