import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Radium from 'radium';
import styled from 'styled-components';
const Container = styled.div`
  position: relative;
  width: 100%;
  margin-top: ${props => props.marginTop};
`;
const Suggestions = styled.div`
  display: ${props => props.display}
  position: absolute;
  left: 0;
  flex-direction: column;
  width: 100%;
  background: -webkit-gradient(linear, left top, left bottom, from(#fafafa), to(#cfcfcf));
  color: #17282D;
  max-height: 200;
  overflow: auto;
  margin-top: -4px;
  z-index: 999;
`;
const InputContainer = styled.div`
  width: 100%;
  height: 30px;
  display: flex;
  flex-direction: row;
  color: #17282D;
  border-bottom: 1px solid #4a4a4a;
  opacity: 0.6;
  justify-content: center;
  align-items: center;
  margin-bottom: 6px;
  &:focus: {
    border-bottom: 1px solid #22b1d7;
  }
`;
const StyledInput = styled.input`
  border: ${props => props.border};
  flex: 1;
  height: 16.5px;
  font-family: Montserrat;
  font-size: 14px;
  font-weight: 300;
  outline: none;
  background: none;
`;
const Item = styled.div`
  flex-grow: 1,
  padding: 10px;
  &:hover: {
    background-color: #22b1d7;
    color: #ffffff;
  }
`;
const Error = styled.div`
  color: red;
  font-family: Montserrat;
  font-weight: 100;
  font-size: 12px;
  height: 18px;
`;

class AutoComplete extends Component {
  constructor() {
    super();
    this.state = {
      show: false
    };
    // binding actions
    this.handleChange = this.handleChange.bind(this);
  }

  handleSelect(selected) {
    if (this.props.onChange) {
      this.props.onChange(selected);
    }
  }

  handleChange(e) {
    if (this.props.onChange) {
      this.props.onChange(e.target.value);
      this.setState({
        show: true
      });
    }
  }

  renderSuggestions() {
    return this.props.source.map((suggestionStr, index) =>
      <div key={index} style={styles.item} onTouchTap={this.handleSelect.bind(this, suggestionStr)}>
        {suggestionStr}
      </div>
    );
  }

  render() {
    const suggestions = this.renderSuggestions();
    // const suggestionsStyle = this.state.show ?
    //   Object.assign({}, styles.suggestions, {display: 'flex'}) :
    //   Object.assign({}, styles.suggestions, {display: 'none'});
    // const containerStyle = this.props.noMargin ? Object.assign({}, styles.container, {marginTop: 0}) : styles.container;
    return (
      <Container marginTop={this.props.noMargin ? '0' : '12px'} >
        <InputContainer>
          <StyledInput border={this.props.noBorder ? 'none' : ''}
            type='text'
            placeholder={this.props.label}
            onChange={this.handleChange}
            onBlur={() => setTimeout(function() { this.setState({show: false}); }.bind(this), 10)}
            value={this.props.value} />
        </InputContainer>
        <Suggestions display={this.state.show ? 'flex' : ''}>
          {suggestions}
        </Suggestions>
        {this.props.errorText && (<div style={styles.error}>{this.props.errorText}</div>)}
      </Container>
    );
  }
}

AutoComplete.propTypes = {
  label: PropTypes.string,
  value: PropTypes.string.isRequired,
  errorText: PropTypes.string,
  source: PropTypes.array.isRequired,
  onChange: PropTypes.func.isRequired,
  noMargin: PropTypes.bool,
  noBorder: PropTypes.bool
};

export default Radium(AutoComplete);
