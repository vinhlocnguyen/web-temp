import PropTypes from 'prop-types';
import React, {Component} from 'react';
import styled from 'styled-components';

/*
 *  This component renders a fullscreen image background. It needs to be wrapped around your page content
 *    (before any margins are applied, so preferably as root element).
 *    e.g.: <ImageBackground>Your page</ImageBackground>
 *
 *  Props:
 *    * (required) image: image (the result of require('image-url'))
 *    * (optional) blur: string in px, default='5px'
 *    * (optional) transparency: percentage in decimal notation, default=0.6
 */

const Container = styled.div`
  position: relative;
  height: 100%;
  overflow: hidden;
`;
const BackgroundImage = styled.div`
  width: 100%;
  height: 100%;
  background-size: cover;
  background-repeat: no-repeat;
  background-position: left top;
  background-image: url("${props => props.image}");
  filter: blur(${props => props.blur});
  Webkit-filter: blur(${props => props.blur});
  transform: scale(1.03);
  position: absolute;
  z-index: -1;
`;
const Overlay = styled.div`
  height: 100%;
  width: 100%;
  background: rgba(0,0,0,${props => props.transparency});
`;

export default class ImageBackground extends Component {
  render() {
    return (
      <Container>
        <BackgroundImage className='background-image' blur={this.props.blur} image={this.props.image}>
          <Overlay transparency={this.props.transparency}></Overlay>
        </BackgroundImage>
        {this.props.children}
      </Container>
    );
  }
}

ImageBackground.propTypes = {
  image: PropTypes.string.isRequired,
  blur: PropTypes.string,
  transparency: PropTypes.number
};
ImageBackground.defaultProps = {
  image: require("../../assets/images/Facade_blurred_mobile.jpg"),
  blur: '5px',
  transparency: 0.6
};
