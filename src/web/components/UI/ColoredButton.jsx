import PropTypes from 'prop-types';
import React, { Component } from 'react';
import PushButton from './PushButton';

const colors = {
  hoverColor: '#46d5fc',
  activeColor: '#0e81a7'
};

/*
 * This wraps a PushButton with the colored button style for Drops
 */
class ColoredButton extends Component {
  render() {
    const styles = {
      outer: {
        color: '#FFFFFF',
        backgroundColor: this.props.disabled ? '#cccccc' : this.props.backgroundColor,
        ':hover': {
          backgroundColor: colors.hoverColor
        },
        ':active': {
          backgroundColor: colors.activeColor
        }
      }
    };

    return (
      <PushButton
        handleClick={this.props.handleClick}
        label={this.props.label}
        style={Object.assign(styles.outer, this.props.style)}
        icon={this.props.icon}
        disabled={this.props.disabled}
        noMargin={this.props.noMargin} />
    );
  }
}

ColoredButton.propTypes = {
  label: PropTypes.string.isRequired,
  handleClick: PropTypes.func.isRequired,
  backgroundColor: PropTypes.string,
  icon: PropTypes.node,
  noMargin: PropTypes.bool,
  style: PropTypes.object,
  disabled: PropTypes.bool
};
ColoredButton.defaultProps = {
  backgroundColor: '#20AFD6'
};

export default ColoredButton;
