import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { FormattedMessage, injectIntl, intlShape } from 'react-intl';
import { connect } from 'react-redux';
import { retrievePassword } from '../../redux/actions/user';
import { resetError } from '../../redux/actions/error';
import ColorBackground from './Backgrounds/ColorBackground';
import TitleBar from './UI/TitleBar';
import RoutedBackButton from './RoutedBackButton';
import validation from '../../redux/helpers/validation';
import ErrorMessage from './Features/ErrorMessage';
import TextField from 'material-ui/TextField';
import BorderButton from './UI/BorderButton';
import styled from 'styled-components';
import { media, ContentContainer } from './styleUlti';
import ReactGA from 'react-ga';

export class RetrievePasswordPage extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      newPassword: {
        text: null,
        valid: null,
        error: null
      },
      repeatNewPassword: {
        text: null,
        valid: null,
        error: null
      },
      error: null,
      showMessage: false
    };
    this.handleRetrievePassword = this.handleRetrievePassword.bind(this);
    this.validNewPassword = this.validNewPassword.bind(this);
    this.validRepeatNewPassword = this.validRepeatNewPassword.bind(this);
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

  validNewPassword(e) {
    const valid = validation.isRequired(e.target.value);
    this.setState({
      newPassword: {
        text: e.target.value,
        valid: valid.valid,
        error: valid.error
      }
    });
  }

  validRepeatNewPassword(e) {
    const valid = validation.comparePassword(this.state.newPassword.text, e.target.value);
    this.setState({
      repeatNewPassword: {
        text: e.target.value,
        valid: valid.valid,
        error: valid.error
      }
    });
  }

  validateOnSubmit() {
    const newPassword = this.state.newPassword;
    const repeatPassword = this.state.repeatNewPassword;
    const validNewPassword = validation.isRequired(newPassword.text);
    const validRepeatNewPassword = validation.isRequired(repeatPassword.text);
    this.setState({
      newPassword: {
        text: newPassword.text,
        valid: validNewPassword.valid,
        error: validNewPassword.error
      },
      repeatNewPassword: {
        text: repeatPassword.text,
        valid: validRepeatNewPassword.valid,
        error: validRepeatNewPassword.error
      }
    });
  }

  handleRetrievePassword() {
    this.validateOnSubmit();
    const newPassword = this.state.newPassword;
    const repeatPassword = this.state.repeatNewPassword;
    if (newPassword.valid && repeatPassword.valid) {
      const token = this.props.location.query.token;
      const params = {
        password: newPassword.text
      };
      this.props.retrievePassword(token, params).then(_ => {
        this.checkErrors();
      });
      ReactGA.event({
        category: 'User',
        action: 'Retrieve password'
      });
    }
  }

  render() {
    const {formatMessage} = this.props.intl;

    return (
      <ColorBackground color="#eceff1">
        <div>
          <TitleBar
            title={formatMessage({id: 'retrievepassword.title'})}
            leftButton={<RoutedBackButton/>}
          />
          <ContentContainer className={'page'}>
            <TextField
              floatingLabelText={formatMessage({id: 'retrievepassword.new'})}
              type='password'
              fullWidth
              errorText={this.state.newPassword.error}
              onChange={this.validNewPassword}
              />

            <TextField
              floatingLabelText={formatMessage({id: 'retrievepassword.newAgain'})}
              type='password'
              fullWidth
              errorText={this.state.repeatNewPassword.error}
              onChange={this.validRepeatNewPassword}
              />

            <BorderButton
              label={<FormattedMessage id='retrievepassword.buttonText' />}
              handleClick={this.handleRetrievePassword}
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
        </div>
      </ColorBackground>
    );
  }
}

RetrievePasswordPage.contextTypes = {
  router: PropTypes.object.isRequired
};

RetrievePasswordPage.propTypes = {
  intl: intlShape.isRequired,
  location: PropTypes.object,
  error: PropTypes.object,
  user: PropTypes.object,
  retrievePassword: PropTypes.func,
  resetError: PropTypes.func
};

const mapStateToProps = state => ({
  error: state.error,
  user: state.user
});

export default connect(mapStateToProps, { retrievePassword, resetError })(injectIntl(RetrievePasswordPage));
