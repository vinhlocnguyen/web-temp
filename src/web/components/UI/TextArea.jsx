import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Radium from 'radium';
import styled from 'styled-components';

export const Container = styled.div`
  margin-top: 15px;
  height: ${(props) => props.height}px,
  border-radius: 4px;
  background-color: #ffffff;
  border: solid 1px rgba(73, 73, 73, 0.54);
  padding: 15px;
`;
export const StyledTextArea = styled.textarea`
  background: transparent;
  border: none;
  height: ${(props) => props.height}px;
  font-family: Montserrat;
  font-size: 17px;
  width: 100%;
  font-weight: 300;
  line-height: 1.5;
  color: #4a4a4a;
  &:active {
    box-shadow: none;
    outline: none;
  },
  &:focus {
    box-shadow: none;
    outline: none;
  },
  resize: none;
`;

class TextArea extends Component {
  render () {
    return (
      <Container height={this.props.height}>
        <StyledTextArea height={this.props.height - 32}
          placeholder={this.props.label}
          onChange={(e) => { this.props.onChange(e); }}
          value={this.props.value}></StyledTextArea>
      </Container>
    );
  }
}

TextArea.propTypes = {
  height: PropTypes.number,
  label: PropTypes.string,
  onChange: PropTypes.func,
  value: PropTypes.string
};

TextArea.defaultProps = {
  height: 150
};

export default Radium(TextArea);
