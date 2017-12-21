import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Radium from 'radium';
import prefix from 'react-prefixer';
import styled from 'styled-components';
import { TouchTapDiv } from '../styleUlti';

const Container = styled(TouchTapDiv)`
  padding: 10px;
  :hover: {
    background-color: #22b1d7;
    color: #ffffff;
  }
`;

class SelectItem extends Component {
  render() {
    return (
      <Container onTouchTap={() => this.props.handleSelect(this.props.value)}>
        {this.props.children}
      </Container>
    );
  }
}

SelectItem.propTypes = {
  children: PropTypes.node.isRequired,
  handleSelect: PropTypes.func,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.object
  ]).isRequired // maybe string, number or object
};

export default Radium(SelectItem);
