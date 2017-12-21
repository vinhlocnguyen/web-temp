import PropTypes from 'prop-types';
import React, { Component } from 'react';
import styled from 'styled-components';

const DefaultWrapper = styled.div`
  font-family: Montserrat;
  font-weight: 300;
  color: #4a4a4a;
  font-size: 14px;
  line-height: 1.5;
`;

class TextBlock extends Component {
  render() {
    const Wrapper = DefaultWrapper.extend`
      ${this.props.style}
    `;
    return (
        <Wrapper>{this.props.content}</Wrapper>
    );
  }
}

TextBlock.propTypes = {
  content: PropTypes.string.isRequired,
  style: PropTypes.object
};

TextBlock.defaultProps = {
  style: {}
};

export default TextBlock;
