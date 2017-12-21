import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { intlShape, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import ColorBackground from '../Backgrounds/ColorBackground';
import TitleBar from '../UI/TitleBar';
import TextBlock from '../UI/TextBlock';
import CircularProgress from 'material-ui/CircularProgress';
import RoutedBackButton from '../RoutedBackButton';
import Code from './Code';
import Number from './Number';
import ErrorMessage from '../Features/ErrorMessage';

import { verifyPhoneNumber, checkVerifiedNumber, cancelVerifyingNumber } from '../../../redux/actions/user';
import { update as updateUser } from '../../../redux/actions/user';
import { resetError } from '../../../redux/actions/error';
import { media, ContentContainer } from '../styleUlti';

const styles = {
  description: `
    margin-top: 10px;
  `
};

export class VerifiedNumberPage extends Component {
  constructor(props) {
    super(props);
    const phoneNumber = props.user.phoneNumber.number ? props.user.phoneNumber.number : null;
    this.state = {
      isWaiting: false,
      error: null,
      isShowError: false,
      phoneNumber: phoneNumber
    };
    this.requestVerificationCode = this.requestVerificationCode.bind(this);
    this.checkVerificationCode = this.checkVerificationCode.bind(this);
    this.cancelVerifyingNumber = this.cancelVerifyingNumber.bind(this);
    this.handleUpdateUserPhoneNumber = this.handleUpdateUserPhoneNumber.bind(this);
  }

  componentDidUpdate(prevProps) {
    if (!prevProps.user.phoneNumber.isVerified && this.props.user.phoneNumber.isVerified) {
      this.context.router.history.replace('/account'); //TODO use goback but this fires twice for some reason
    }
  }

  checkErrors() {
    if (this.props.error) {
      this.setState({
        error: this.props.error.status,
        isShowError: true
      });
    }
  }

  requestVerificationCode(number) {
    this.toggleWaiting();
    this.setState({
      phoneNumber: number
    });
    this.props.verifyPhoneNumber(number).then(_ => {
      this.checkErrors();
      this.toggleWaiting();
    });
  }

  cancelVerifyingNumber(requestId) {
    this.toggleWaiting();
    this.props.cancelVerifyingNumber(requestId).then(_ => {
      this.checkErrors();
      this.toggleWaiting();
    });
  }

  checkVerificationCode(requestId, pin) {
    this.toggleWaiting();
    this.props.checkVerifiedNumber(requestId, pin).then(_ => {
      this.checkErrors();
      if (this.props.user.phoneNumber.isVerified && !this.props.error) {
        this.handleUpdateUserPhoneNumber({phoneNumber: this.props.user.phoneNumber.number});
        // this.context.router.replace('/account');
      } else {
        this.toggleWaiting();
      }
    });
  }

  handleUpdateUserPhoneNumber(params) {
    this.props.updateUser(params).then(_ => {
      this.checkErrors();
      this.toggleWaiting();
      if (!this.props.error) {
        this.context.router.history.replace('/account');
      }
    });
  }

  toggleWaiting() {
    this.setState({
      isWaiting: !this.state.isWaiting
    });
  }

  render() {
    const {formatMessage} = this.props.intl;
    const view = !this.props.user.phoneNumber.isWaitingConfirm ? (
      <div>
        <TextBlock style={styles.description} content={formatMessage({id: 'verifynumber.explanation.number'})} />
        <Number handleSubmit={this.requestVerificationCode} phone={this.state.phoneNumber}/>
      </div>
    ) : (
      <div>
        <TextBlock style={styles.description} content={formatMessage({id: 'verifynumber.explanation.code'})} />
        <Code
          isVerified={this.props.user.phoneNumber.isWaitingConfirm}
          requestId={this.props.user.phoneNumber.requestId}
          handleSubmit={this.checkVerificationCode}
          handleCancel={this.cancelVerifyingNumber}
        />
      </div>
    );

    const waiting = (
      <div className='loading'>
        <CircularProgress size={60} />
      </div>
    );

    return (
      <ColorBackground color='#eceff1'>
        <TitleBar
          title={formatMessage({id: 'verifynumber.title'})}
          leftButton={<RoutedBackButton/>}
        />
        <ContentContainer>
          <div className={'page'}>
            {this.state.isWaiting && waiting}
            {view}
            <ErrorMessage
              error={this.state.error}
              open={this.state.isShowError}
              handleClose={() => {
                this.props.resetError();
                this.setState({
                  error: null,
                  isShowError: false
                });
              }}
            />
          </div>
        </ContentContainer>
      </ColorBackground>
    );
  }
}

VerifiedNumberPage.contextTypes = {
  router: PropTypes.object.isRequired
};

VerifiedNumberPage.propTypes = {
  user: PropTypes.object,
  error: PropTypes.object,
  verifyPhoneNumber: PropTypes.func,
  checkVerifiedNumber: PropTypes.func,
  cancelVerifyingNumber: PropTypes.func,
  resetError: PropTypes.func,
  intl: intlShape.isRequired
};

const mapStateToProps = state => {
  return {
    user: state.user,
    error: state.error
  };
};

const mapDispatchToProps = {
  verifyPhoneNumber,
  checkVerifiedNumber,
  cancelVerifyingNumber,
  resetError,
  updateUser
};

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(VerifiedNumberPage));
