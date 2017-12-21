import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { media } from '../../styleUlti';

export const Content = styled.span`
  font-family: Montserrat;
  font-size: 16px;
  line-height: 1;
  text-align: center;
  color: #ffffff
`;
export const Icon = styled.span`
  margin-right: 8px;
`

class FloatingButton extends Component {
  render () {
    const styles = {
      container: {
        display: 'flex',
        flexDirection: 'row',
        height: '52px',
        backgroundColor: this.props.disabled ? '#888888' : '#22b1d7',
        bottom: 1,
        borderRadius: '4px',
        // position: 'fixed',
        alignItems: 'center',
        justifyContent: 'center',
        textDecoration: 'none',
        cursor: 'pointer',
        WebkitUserSelect: 'none',
        MozUserSelect: 'none',
        KhtmlUserSelect: 'none',
        MsUserSelect: 'none'
      }
    };

    if (this.props.target && !this.props.disabled) {
      if (this.props.external) {
        return (
          <div>
            <a href={this.props.target} style={styles.container} className={'floatingButton'}>
              {this.props.icon && <Icon>{this.props.icon}</Icon>}
              <Content>{this.props.label}</Content>
            </a>
          </div>
        );
      } else {
        return (
          <div>
            <Link to={this.props.target} style={styles.container} className={'floatingButton'}>
              {this.props.icon && <Icon>{this.props.icon}</Icon>}
              <Content>{this.props.label}</Content>
            </Link>
          </div>
        );
      }
    } else {
      return (
        <div>
          <div
            style={styles.container}
            className={'floatingButton'}
            onTouchTap={() => { !this.props.disabled ? this.props.onHandleClick() : null; }}>
            {this.props.icon && <Icon>{this.props.icon}</Icon>}
            <Content>{this.props.label}</Content>
          </div>
        </div>
      );
    }
  }
}

FloatingButton.propTypes = {
  label: PropTypes.string,
  icon: PropTypes.node,
  target: PropTypes.string,
  onHandleClick: PropTypes.func,
  disabled: PropTypes.bool,
  external: PropTypes.bool
};

export default FloatingButton;
