import PropTypes from 'prop-types';
import React, { Component } from 'react';
import IconButton from 'material-ui/IconButton';
import FontIcon from 'material-ui/FontIcon';

/*
 * Currently just wraps material UI --TODO
 */
class MenuButton extends Component {
  render() {
    return (
      <IconButton onTouchTap={() => this.props.handleClick()}>
        <FontIcon
          color='#2457a7'
          className='fa fa-bars'
          aria-hidden='true'/>
      </IconButton>
    );
  }
}

MenuButton.propTypes = {
  handleClick: PropTypes.func.isRequired
};

export default MenuButton;
