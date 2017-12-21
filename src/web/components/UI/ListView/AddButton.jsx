import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { AddIcon } from '../Icons';

class AddButton extends Component {
  render () {
    const style = {
      width: '36px',
      height: '36px',
      cursor: 'pointer'
    };

    return (
      <div style={style} onTouchTap={() => this.props.onHandleClick()}>
        <AddIcon />
      </div>
    );
  }
}

AddButton.propTypes = {
  onHandleClick: PropTypes.func.isRequired
};

export default AddButton;
