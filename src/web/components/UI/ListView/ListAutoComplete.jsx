import PropTypes from 'prop-types';
import React, { Component } from 'react';
import AutoComplete from '../AutoComplete';
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  flex-direction: row;
  background-color: #ffffff;
  padding: 10px 14px;
  align-items: center;
`;
const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
`;
const Title = styled.div`
  font-family: Montserrat;
  font-size: 13px;
  line-height: 1;
  color: #22b1d7;
  margin-bottom: 5px;
`;
const StyledInput = styled.input`
  font-family: Montserrat;
  font-size: 14px;
  font-weight: 300;
  line-height: 1.5;
  color: #4a4a4a;
  border: none;
  flex: 1;
  background: none;
  outline: none;
`;
const Button = styled.button`
  margin-left: 42px;
`;

class ListAutoComplete extends Component {
  constructor() {
    super();
    this.handleOnChange = this.handleOnChange.bind(this);
  }
  handleOnChange(e) {
    if (this.props.onChange) {
      this.props.onChange(e);
    }
  }

  render () {
    const styles = {
      
    };

    return (
      <Container>
        <Wrapper>
          <Title>
            {this.props.title} {this.props.subtitle}
          </Title>
          <AutoComplete
            value={this.props.value}
            onChange={this.handleOnChange}
            source={this.props.source}
            noBorder
          />
        </Wrapper>
      </Container>
    );
  }
}

ListAutoComplete.propTypes = {
  title: PropTypes.string,
  subtitle: PropTypes.node,
  content: PropTypes.node, // This could be a text or something like an image
  button: PropTypes.node,
  handleClick: PropTypes.func,
  style: PropTypes.object,
  inputStyle: PropTypes.object,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  source: PropTypes.array.isRequired
};

ListAutoComplete.defaultProps = {
  inputStyle: {},
  style: {}
};

export default ListAutoComplete;
