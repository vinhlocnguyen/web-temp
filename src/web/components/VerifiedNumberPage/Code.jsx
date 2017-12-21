import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { intlShape, injectIntl } from 'react-intl';
import TextField from '../UI/TextField';
import Loading from '../UI/Loading';
import ColoredButton from '../UI/ColoredButton';
import BorderButton from '../UI/BorderButton';

import ReactGA from 'react-ga';

export class Code extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pin: null
    };
    this.handlePin = this.handlePin.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
  }

  handlePin(e) {
    this.setState({
      pin: e.target.value
    });
  }

  handleSubmit() {
    this.props.handleSubmit(this.props.requestId, this.state.pin);
    ReactGA.event({
      category: 'Account',
      action: 'Submit PIN code'
    });
  }

  handleCancel() {
    this.props.handleCancel(this.props.requestId);
  }

  render() {
    const {formatMessage} = this.props.intl;
    return (
      <div style={styles.wrapper}>
        <TextField
          label={formatMessage({id: 'verifynumber.code.pin'})}
          onChange={this.handlePin}
        />
        <ColoredButton
          label={formatMessage({id: 'verifynumber.code.confirmButton'})}
          handleClick={this.handleSubmit}
        />
        <BorderButton
          label={formatMessage({id: 'verifynumber.code.cancelButton'})}
          handleClick={this.handleCancel}
          style={{marginTop: 10}}
        />
      </div>
    );
  }
}

Code.propTypes = {
  handleSubmit: PropTypes.func,
  handleCancel: PropTypes.func,
  requestId: PropTypes.string,
  intl: intlShape.isRequired
};

const styles = {
  wrapper: {
    display: 'flex',
    flexDirection: 'column'
  }
};

export default injectIntl(Code);
