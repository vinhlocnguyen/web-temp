import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Radium from 'radium';
import styled from 'styled-components';
import { media, TouchTapDiv } from '../styleUlti';

const Container = styled(TouchTapDiv)`
  position: relative;
  margin-top: 12;
`;
const InputContainer = styled.div`
  flex-grow: 1;
  height: 30px;
  display: flex;
  flex-direction: row;
  color: #17282D;
  border-bottom: 1px solid #4a4a4a;
  opacity: 0.6;
  justify-content: center;
  align-items: center;
  margin-bottom: 6px;
  :focus: {
    border-bottom: 1px solid #22b1d7;
  }
`;
const StyledInput = styled.input`
  border: none;
  flex: 1;
  height: 16.5px;
  font-family: Montserrat;
  font-size: 14px;
  font-weight: 300;
  outline: none;
  background: none;
`;
const ChildrenContainer = styled.div`
  display: ${props => props.display};
  width: 100%;
  flex-direction: column;
  background: -webkit-gradient(linear, left top, left bottom, from(#fafafa), to(#cfcfcf));
  color: #17282D;
  position: absolute;
  max-height: 200;
  overflow: auto;
  margin-top: -4px;
  z-index: 999
`;
const StyledError = styled.div`
  color: red;
  font-family: Montserrat;
  font-weight: 100;
  font-size: 12px;
  height: 18px;
`;

class SelectField extends Component {
  constructor() {
    super();
    this.state = {
      show: false
    };
  }

  handleSelect(value) {
    this.props.onChange(value);
    this.setState({
      show: false
    });
  }

  render() {
    const children = React.Children.map(this.props.children, child =>
      React.cloneElement(
        child,
        {
          handleSelect: this.handleSelect.bind(this)
        }
      )
    );
    return (
      <Container onTouchTap={() => { this.setState({show: !this.state.show}); }}>
        <InputContainer>
          <StyledInput
            readOnly
            type='text'
            onBlur={(e) => {
              e.preventDefault();
            }}
            placeholder={this.props.label}
            value={this.props.selected} />
        </InputContainer>
        <ChildrenContainer display={this.state.show ? 'flex' : 'none'}>
          {children}
        </ChildrenContainer>
        {this.props.errorText && (<StyledError>{this.props.errorText}</StyledError>)}
      </Container>
    );
  }
}

SelectField.propTypes = {
  containerStyle: PropTypes.object,
  label: PropTypes.string,
  selected: PropTypes.string,
  open: PropTypes.bool,
  onChange: PropTypes.func.isRequired,
  children: PropTypes.node,
  errorText: PropTypes.string
};

export default Radium(SelectField);
