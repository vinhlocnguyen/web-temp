import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { IMAGE } from '../../../../config';
import styled from 'styled-components';

const TouchTapImage = (props) => <img {...props} />
const DefaultImage = styled(TouchTapImage)`
  display: flex;
  width: 50px;
  height: 50px;
`;

class Image extends Component {
  constructor(props) {
    super(props);
    this.state = {
      src: props.src
    };
    this.handleError = this.handleError.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.src && nextProps.src.localeCompare(this.props.src) !== 0) {
      this.setState({
        src: nextProps.src
      });
    }
  }

  handleError() {
    this.setState({
      src: this.props.placeholder || IMAGE.NO_IMAGE
    });
  }

  render() {
    const extraStyle = this.props.style ? this.props.style.style: {};
    const media = this.props.style ? this.props.style.media : '';
    const mediaStyle = this.props.style ? this.props.style.mediaStyle : ''
    const Image = DefaultImage.extend`
      ${extraStyle};
      ${media}
        ${mediaStyle}
    `;
    return (
      <Image
        onError={this.handleError}
        src={this.state.src || ''}
        onTouchTap={this.props.onTouchTap} />
    );
  }
}

Image.propTypes = {
  src: PropTypes.string,
  style: PropTypes.object,
  placeholder: PropTypes.string,
  onTouchTap: PropTypes.func
};

export default Image;
