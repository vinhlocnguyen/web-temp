import React, { Component } from 'react';
import { ViewIcon } from './Icons';
import PropTypes from 'prop-types';
import Radium from 'radium';
import styled from 'styled-components';
import { media } from '../styleUlti';

const InputContainer = styled.div`
  width: 100%;
  height: 30px;
  display: flex;
  flex-direction: row;
  color: ${props => props.color};
  border-bottom: 1px solid  ${props => props.borderColor};
  opacity: 0.6;
  justify-content: center;
  align-items: center;
  margin-bottom: 6px;
  &:focus: {
    border-bottom: 1px solid #22b1d7;
  }
`;
const LeftIconContainer = styled.div`
  width: 40px;
`;
const RightIconContainer = styled.div`
  width: 20px;
  margin-left: 20px;
`;
const StyledImg = styled.img`
  width: 20px;
  height: 15px;
  opacity: 0.6;
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
  &:disabled: {
    color: ${props => props.color}
  }
`;
const StyledError = styled.div`
  color: red;
  font-family: Montserrat;
  font-weight: 100;
  font-size: 12px;
  height: 18px;
`;
const StyledSuccess = styled.div`
  color: rgb(32, 175, 214);
  font-family: Montserrat;
  font-weight: 100;
  font-size: 12px;
  height: 18px;
`;

class AutoSaveTextField extends Component {
  constructor(props) {
    super(props);
    this.state = {type: props.type};
    this.state.isChanged = false;

    this.handleOnChange = this.handleOnChange.bind(this);
  }

  handleOnChange(event) {
    if (this.props.onChange) {
      this.setState({
        isChanged: true
      });

      this.props.onChange(event);
    }
  }

  render() {
    const borderColor = this.props.errorText ? 'red' : '#4a4a4a';
    const styles = {
      wrapper: {
        marginTop: this.props.noMargin ? '0px' : '12px'
      },
      
    };

    const containerStyle = this.props.containerStyle
      ? Object.assign({}, styles.wrapper, this.props.containerStyle)
      : styles.wrapper;

    return (
      <div style={containerStyle}>
        <InputContainer borderColor={borderColor} color={this.props.color}>
          {this.props.icon && (
            <LeftIconContainer>
              {this.props.icon}
            </LeftIconContainer>
          )}
          <StyledInput
            type={this.state.type}
            placeholder={this.props.label}
            onChange={this.handleOnChange}
            onBlur={this.props.onBlur}
            value={this.props.value}
            disabled={this.props.disabled}/>
          {this.props.type === 'password' && (
            <RightIconContainer
              onTouchStart={() => { this.setState({type: 'text'}); }}
              onTouchEnd={() => { this.setState({type: 'password'}); }}>
              <ViewIcon />
            </RightIconContainer>
          )}
        </InputContainer>
        {this.props.errorText && (<StyledError>{this.props.errorText}</StyledError>)}
        {this.props.successText && (<StyledSuccess>{this.props.successText}</StyledSuccess>)}
        <StyledSuccess>{this.props.successText}</StyledSuccess>
      </div>
    );
  }
}

AutoSaveTextField.propTypes = {
  label: PropTypes.string.isRequired,
  type: PropTypes.string,
  disabled: PropTypes.bool,
  value: PropTypes.string,
  errorText: PropTypes.string,
  onChange: PropTypes.func,
  icon: PropTypes.node,
  color: PropTypes.string,
  noMargin: PropTypes.bool,
  containerStyle: PropTypes.object,
  onBlur: PropTypes.func,
  successText: PropTypes.string
};
AutoSaveTextField.defaultProps = {
  color: "#17282D",
  type: 'text',
  errorText: '',
  supportErrors: true
};

export default Radium(AutoSaveTextField);
