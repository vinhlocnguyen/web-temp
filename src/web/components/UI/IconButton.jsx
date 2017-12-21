import PropTypes from 'prop-types';
import React, { Component } from 'react';

class IconButton extends Component {
  render() {
    const style = Object.assign({}, {cursor: 'pointer'}, this.props.style);
    return (
      <div style={style} onTouchTap={this.props.onTouchTap}>
        {this.props.icon}
      </div>
    );
  }
}

IconButton.propTypes = {
  icon: PropTypes.object.isRequired,
  onTouchTap: PropTypes.func.isRequired,
  style: PropTypes.object
};

export default IconButton;
