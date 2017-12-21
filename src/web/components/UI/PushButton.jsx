import PropTypes from 'prop-types';
import React, { Component } from 'react';
import styled from 'styled-components';
import { TouchTapDiv } from '../styleUlti';

export const Wrapper = styled(TouchTapDiv)`
  width: ${(props) => props.width || '100%'};
  height: ${(props) => props.height || '52px'};
  border-radius: ${(props) => props.borderRadius || '4px'};
  display: ${(props) => props.display || 'flex'};
  flex-direction: ${(props) => props.flexDirection || 'row'};
  align-items: ${(props) => props.alignItems || 'center'};
  justify-content: ${(props) => props.justifyContent || 'center'};
  margin-top: ${(props) => props.marginTop || '0px'};
  font-family: ${(props) => props.fontFamily || 'Montserrat'};
  font-size: ${(props) => props.fontSize || '16'}px;
  line-height: ${(props) => props.lineHeight || '1'};
  cursor: ${(props) => props.cursor || 'pointer'};
  text-align: ${(props) => props.textAlign || 'center'};
  color: ${(props) => props.color || ''};
  background-color: ${(props) => props.backgroundColor || ''};
  padding: ${(props) => props.padding || '0px'}
`;
/*
 * A push button (large rectangular button)
 *
 * (required) Provide a handleClick function to handle the onTouchTap event
 * (required) Provide a label as a string to give the button some content
 * (optional) Provide an outerStyle to be merged with the standard outer styling
 */
class PushButton extends Component {
  render() {
    // const defaultStyle = {
    //   width: '100%',
    //   height: '52px',
    //   borderRadius: '4px',
    //   display: 'flex',
    //   flexDirection: 'row',
    //   alignItems: 'center',
    //   justifyContent: 'center',
    //   marginTop: this.props.noMargin ? '0px' : '24px',
    //   // TODO the next part could be specified higher up
    //   fontFamily: 'Montserrat',
    //   fontSize: '16px',
    //   lineHeight: 1,
    //   cursor: 'pointer',
    //   textAlign: 'center',
    //   WebkitUserSelect: 'none',
    //   MozUserSelect: 'none',
    //   KhtmlUserSelect: 'none',
    //   MsUserSelect: 'none'
    // };
    // const style = Object.assign({}, defaultStyle, this.props.style);
    return (
        <Wrapper {...this.props.style} onTouchTap={!this.props.disabled ? this.props.handleClick : null}>
          {this.props.icon && (
            <div style={{marginRight: '16px'}}>
              {this.props.icon}
            </div>
          )}
          <span>{this.props.label}</span>
        </Wrapper>
    );
  }
}

PushButton.propTypes = {
  style: PropTypes.object,
  label: PropTypes.string.isRequired,
  handleClick: PropTypes.func,
  icon: PropTypes.node,
  disabled: PropTypes.bool,
  noMargin: PropTypes.bool
};

export default PushButton;
