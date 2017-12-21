import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { SendMailIcon } from '../Icons';

class MailButton extends Component {
  render () {
    const style = {
      width: '36px',
      height: '36px'
    };

    return (
      <a style={style} href={`mailto:${this.props.email}`}>
        <SendMailIcon />
      </a>
    );
  }
}

MailButton.propTypes = {
  email: PropTypes.string.isRequired
};

export default MailButton;
