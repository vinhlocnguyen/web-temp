import PropTypes from 'prop-types';
import React, { Component } from 'react';

/*
 * Just wrapping the logo url so we only have to change it here if it changes.
 */
class Icon extends Component {
  render() {
    const style = {
      width: this.props.width,
      height: this.props.height
    };

    return (
      <img style={style} src={this.props.iconUrl} />
    );
  }
}

Icon.propTypes = {
  iconUrl: PropTypes.string.isRequired,
  width: PropTypes.string,
  height: PropTypes.string
};

export default Icon;
