import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { PhoneIcon } from '../Icons';

class CallButton extends Component {
  render () {
    const style = {
      width: '36px',
      height: '36px'
    };

    return (
      <a style={style} href={`tel:${this.props.phone}`}>
        <PhoneIcon/>
      </a>
    );
  }
}

CallButton.propTypes = {
  phone: PropTypes.string.isRequired
};

export default CallButton;
