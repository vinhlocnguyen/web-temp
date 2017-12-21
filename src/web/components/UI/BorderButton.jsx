import PropTypes from 'prop-types';
import React, { Component } from 'react';
import PushButton from './PushButton';
import styled from 'styled-components';

const colors = {
  hoverColor: '#eceff1',
  activeColor: '#0874ba'
};

const StyledButton = styled(PushButton)`
  color: #0874ba;
  border: 1px solid #0874ba;
  &:hover: {
    background-color: ${colors.hoverColor};
  },
  &:active: {
    background-color: ${colors.activeColor};
    color: #ffffff;
  },
  width: calc(100% - 2px);
`;

/*
 * This wraps a PushButton with the bordered button style for Drops
 */
class BorderButton extends Component {
  render() {
    const styles = {
      outer: {
        color: '#0874ba',
        border: '1px solid #0874ba',
        ':hover': {
          backgroundColor: colors.hoverColor
        },
        ':active': {
          backgroundColor: colors.activeColor,
          color: '#ffffff'
        },
        width: 'calc(100% - 2px)'
      }
    };

    // <PushButton
    //     handleClick={() => this.props.handleClick()}
    //     label={this.props.label}
    //     style={Object.assign(styles.outer, this.props.style)}
    //     noMargin={this.props.noMargin}/>

    return this.props.visible ? (
      <StyledButton
        handleClick={() => this.props.handleClick()}
        label={this.props.label}
        noMargin={this.props.noMargin} />
    ) : (<div />);
  }
}

BorderButton.propTypes = {
  label: PropTypes.string.isRequired,
  handleClick: PropTypes.func.isRequired,
  noMargin: PropTypes.bool,
  style: PropTypes.object,
  visible: PropTypes.bool
};

BorderButton.defaultProps = {
  visible: true
};

export default BorderButton;
