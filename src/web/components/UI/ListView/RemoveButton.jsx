import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { RemoveIcon } from '../Icons';

class RemoveButton extends Component {
  render () {
    const style = {
      width: '60px',
      height: '60px',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    };

    return (
      <div style={this.props.style ? Object.assign(style, this.props.style) : style} onTouchTap={() => this.props.onHandleClick()}>
        <RemoveIcon />
      </div>
    );
  }
}

RemoveButton.propTypes = {
  onHandleClick: PropTypes.func.isRequired
};

export default RemoveButton;
