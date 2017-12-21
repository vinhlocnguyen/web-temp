import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { intlShape, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { changePassword } from '../../redux/actions/user';
import { resetError } from '../../redux/actions/error';
import ColorBackground from './Backgrounds/ColorBackground';
import TitleBar from './UI/TitleBar';
import validation from '../../redux/helpers/validation';
import ErrorMessage from './Features/ErrorMessage';
import TextField from './UI/TextField';
import ColoredButton from './UI/ColoredButton';
import RoutedBackButton from './RoutedBackButton';
import { PasswordIcon } from './UI/Icons';
import ReactGA from 'react-ga';
import styled from 'styled-components';
import { media, ContentContainer } from './styleUlti';

class ChangePasswordPage extends Component {
  constructor() {
    super();
    this.state = {
      currentPassword: {
        text: null,
        valid: null,
        error: null
      },
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
    this.handleChangePassword = this.handleChangePassword.bind(this);
    this.validCurrentPassword = this.validCurrentPassword.bind(this);
    this.validNewPassword = this.validNewPassword.bind(this);
    this.validRepeatNewPassword = this.validRepeatNewPassword.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.user.waitingConfirm) {
      this.context.router.history.push(`/`);
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

  validCurrentPassword(e) {
    const valid = validation.isRequired(e.target.value);
    this.setState({
      currentPassword: {
        text: e.target.value,
        valid: valid.valid,
        error: valid.error
      }
    });
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
    const password = this.state.currentPassword;
    const newPassword = this.state.newPassword;
    const repeatPassword = this.state.repeatNewPassword;
    const validPassword = validation.isRequired(password.text);
    const validNewPassword = validation.isRequired(newPassword.text);
    const validRepeatNewPassword = validation.isRequired(repeatPassword.text);
    this.setState({
      currentPassword: {
        text: password.text,
        valid: validPassword.valid,
        error: validPassword.error
      },
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

  handleChangePassword() {
    this.validateOnSubmit();
    const password = this.state.currentPassword;
    const newPassword = this.state.newPassword;
    const repeatPassword = this.state.repeatNewPassword;
    const validCompare = validation.comparePassword(newPassword.text, repeatPassword.text);
    if (password.valid && newPassword.valid && validCompare.valid) {
      const params = {
        password: password.text,
        newPassword: newPassword.text
      };
      this.props.changePassword(params).then(_ => {
        this.checkErrors();
      });
      ReactGA.event({
        category: 'User',
        action: 'Change password'
      });
    }
  }

  render() {
    const {formatMessage} = this.props.intl;

    return (
      <ColorBackground color='#eceff1'>
        <div>
          <TitleBar
            title={formatMessage({id: 'changepassword.title'})}
            leftButton={<RoutedBackButton />}
          />
          <ContentContainer className={'page'}>
  					<TextField
  						label={formatMessage({id: 'changepassword.current'})}
              type='password'
  						errorText={this.state.currentPassword.error}
  						onChange={this.validCurrentPassword}
              icon={<PasswordIcon />}
  						/>

  					<TextField
  						label={formatMessage({id: 'changepassword.new'})}
  						type='password'
  						errorText={this.state.newPassword.error}
  						onChange={this.validNewPassword}
              icon={<PasswordIcon />}
  						/>

  					<TextField
  						label={formatMessage({id: 'changepassword.newAgain'})}
  						type='password'
  						errorText={this.state.repeatNewPassword.error}
  						onChange={this.validRepeatNewPassword}
              icon={<PasswordIcon />}
  						/>

  					<ColoredButton
  						label={formatMessage({id: 'changepassword.buttonText'})}
  						handleClick={this.handleChangePassword}
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

ChangePasswordPage.contextTypes = {
  router: PropTypes.object.isRequired
};

ChangePasswordPage.propTypes = {
  intl: intlShape.isRequired,
  error: PropTypes.object,
  user: PropTypes.object,
  changePassword: PropTypes.func,
  resetError: PropTypes.func
};

const mapStateToProps = state => ({
  error: state.error,
  user: state.user
});

export default connect(mapStateToProps, { changePassword, resetError })(injectIntl(ChangePasswordPage));
