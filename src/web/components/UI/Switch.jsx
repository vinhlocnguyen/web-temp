import PropTypes from 'prop-types';
import React, { Component } from 'react';

class Switch extends Component {
  render () {
    return this.props.status ? React.cloneElement(this.props.children) : null;
  }
}

Switch.propTypes = {
  children: PropTypes.node.isRequired,
  status: PropTypes.bool
};

export default Switch;
