import PropTypes from 'prop-types';
import React, { Component } from 'react';
import Image from './Image';
import { IMAGE } from '../../../../config';
import styled from 'styled-components';
import { media } from '../styleUlti';

// const StyledImage = (props) => <Image {...props} />
const extraStyled = {
  style: {
    'border-radius': '50%',
    width: '72px',
    height: '72px',
    border: 'solid 1px #ffffff',
  },
  media: media.phoneLandscape,
  mediaStyle: {
    width: '36px',
    height: '36px',
    'margin-right': '25px'
  }
};

const DefaultAvatar = styled.div`
  border-radius: 50%;
  width: 72px;
  height: 72px;
  border: solid 1px #ffffff;
  ${media.phoneLandscape`
    width: 36px;
    height: 36px;
    margin-right: 25px;
  `}
`;

class Avatar extends Component {
  render() {
    if (this.props.avatarUrl) {
      return (
        <Image
          style={extraStyled}
          src={this.props.avatarUrl}
          placeholder={IMAGE.DEFAULT_AVATAR} />
      );
    } else {
      // TODO some default placeholder image
      return (
        // <div style={extraStyled.style} />
        <DefaultAvatar />
      );
    }
  }
}

Avatar.propTypes = {
  avatarUrl: PropTypes.string
};

export default Avatar;
