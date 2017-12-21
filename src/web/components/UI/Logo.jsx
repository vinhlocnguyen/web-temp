import PropTypes from 'prop-types';
import React, { Component } from 'react';
import styled from 'styled-components';

export const StyledImg = styled.img`
  width: ${(props) => props.width}px;
  height: ${(props) => props.height}px;
`;

/*
 * Just wrapping the logo url so we only have to change it here if it changes.
 */
class Logo extends Component {
  render() {
    const logoUrl = require('../../assets/images/logo.svg');

    return (
      <StyledImg width={this.props.width} height={this.props.height} src={logoUrl} />
    );
  }
}

Logo.propTypes = {
  width: PropTypes.string.isRequired,
  height: PropTypes.string.isRequired
};

export default Logo;
