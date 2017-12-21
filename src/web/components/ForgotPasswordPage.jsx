import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { intlShape, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { resetError } from '../../redux/actions/error';
import { forgotPassword } from '../../redux/actions/user';
import ColorBackground from './Backgrounds/ColorBackground';
import TitleBar from './UI/TitleBar';
import validation from '../../redux/helpers/validation';
import ErrorMessage from './Features/ErrorMessage';
import TextField from './UI/TextField';
import TextBlock from './UI/TextBlock';
import ColoredButton from './UI/ColoredButton';
import RoutedBackButton from './RoutedBackButton';
import { MailIcon } from './UI/Icons';
import styled from 'styled-components';
import { media, ContentContainer} from './styleUlti';

import ReactGA from 'react-ga';

const Container = styled.div`
  display: flex;
  flex-direction: column;
`;

export class ForgotPasswordPage extends Component {
  constructor() {
    super();
    this.state = {
      email: {
        text: null,
        valid: null,
        error: null
      },
			error: null,
			showMessage: false
    };
    this.handleForgotPassword = this.handleForgotPassword.bind(this);
    this.validEmail = this.validEmail.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.user.waitingConfirm) {
      this.context.router.history.push(`/login`);
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

  validEmail(e) {
    const valid = validation.email(e.target.value);
    this.setState({
      email: {
        text: e.target.value,
        valid: valid.valid,
        error: valid.error
      }
    });
  }

  validateOnSubmit() {
    const email = this.state.email;
    const valid = validation.isRequired(email.text);
    this.setState({
      email: {
        text: email.text.trim().toLowerCase(),
        valid: valid.valid && email.valid,
        error: valid.error ? valid.error : email.error
      }
    });
  }

  handleForgotPassword() {
    this.validateOnSubmit();
    const email = this.state.email;
    if (email.valid) {
      const params = {
        email: email.text.trim().toLowerCase()
      };
      this.props.forgotPassword(params).then(_ => {
        this.checkErrors();
      });
      ReactGA.event({
        category: 'User',
        action: 'Sent forgot password email'
      });
    }
  }

  render() {
    const {formatMessage} = this.props.intl;

    return (
      <ColorBackground color="#eceff1">
        <div>
          <TitleBar
            title={formatMessage({id: 'forgotpassword.title'})}
            leftButton={<RoutedBackButton />}
          />
          <Container className={'page'}>
            <ContentContainer>
              <TextBlock style={{'margin-top': '10px'}} content={formatMessage({id: 'forgotpassword.explanation'})} />

              <TextField
                label={formatMessage({id: 'forgotpassword.email'})}
                errorText={this.state.email.error}
                onChange={this.validEmail}
                icon={<MailIcon />}
              />

              <ColoredButton
                label={formatMessage({id: 'forgotpassword.buttonText'})}
                handleClick={this.handleForgotPassword}
                />

                <ErrorMessage
                error={this.state.error}
                open={this.state.showMessage}
                handleClose={() => {
                  this.setState({ showMessage: false });
                  this.props.resetError();
                }}
              />
            </ContentContainer>
          </Container>
        </div>
      </ColorBackground>
    );
  }
}

ForgotPasswordPage.contextTypes = {
  router: PropTypes.object.isRequired
};

ForgotPasswordPage.propTypes = {
  intl: intlShape.isRequired,
  error: PropTypes.object,
  user: PropTypes.object,
  forgotPassword: PropTypes.func,
  resetError: PropTypes.func
};

const mapStateToProps = state => ({
  error: state.error,
  user: state.user
});

export default connect(mapStateToProps, { resetError, forgotPassword })(injectIntl(ForgotPasswordPage));
