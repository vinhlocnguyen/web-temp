import PropTypes from 'prop-types';
import React, { Component } from 'react';
import styled from 'styled-components';

const StyledImgIcon = styled.div`
  width: 20px;
  height: 15px;
  opacity: 0.6;
`;

class ImgIcon extends Component {
  render() {
    return (
      <StyledImgIcon></StyledImgIcon>
    );
  }
}

ImgIcon.propTypes = {
  iconName: PropTypes.string.isRequired
};

export default ImgIcon;
