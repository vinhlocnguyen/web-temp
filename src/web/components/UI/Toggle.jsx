import PropTypes from 'prop-types';
import React, { Component } from 'react';
require('../../assets/styles/form.scss');

class Toggle extends Component {
  constructor() {
    super();
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(e) {
    this.props.onCheck(e.target.checked);
  }

  render() {
    return (
      <div className='toggle'>
        <input
          type='checkbox'
          onChange={this.handleChange}
          checked={this.props.checked}
        />
        <label></label>
        <div></div>
      </div>
    );
  }
}

Toggle.propTypes = {
  onCheck: PropTypes.func.isRequired,
  checked: PropTypes.bool
};

export default Toggle;
