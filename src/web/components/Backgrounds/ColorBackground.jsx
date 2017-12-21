import PropTypes from 'prop-types';
import React, { Component } from 'react';
import styled from 'styled-components';

class ColorBackground extends Component {
  render() {
    return (
      <div style={{
        height: '100%',
        backgroundColor: this.props.bgColor,
        display: 'flex',
        flexDirection: 'column',
        position: 'absolute',
        width: '100%'
      }}>
        {this.props.children}
      </div>
    );
  }
}

ColorBackground.propTypes = {
  color: PropTypes.string
};
ColorBackground.defaultProps = {
  color: "#17282D"
};

export default ColorBackground;
