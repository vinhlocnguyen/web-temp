import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { BackIcon } from './Icons';
import styled from 'styled-components';
import { media, TouchTapDiv } from '../styleUlti';

export const BackButton = styled(TouchTapDiv)`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 30px;
  height: 30px;
  cursor: pointer;
  padding: 12px 20px 12px 0;
`;
/*
 * A simple back button in FlatTurtle styling
 */
class BackIconButton extends Component {
  render() {
    return (
      <BackButton
        onTouchTap={() => this.props.handleClick()} >
        <BackIcon />
      </BackButton>
    );
  }
}

BackIconButton.propTypes = {
  handleClick: PropTypes.func.isRequired
};

export default BackIconButton;
