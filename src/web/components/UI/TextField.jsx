import React, { Component } from 'react';
import { ViewIcon } from './Icons';
import PropTypes from 'prop-types';
import Radium from 'radium';

class TextField extends Component {
  constructor(props) {
    super(props);

    this.state = {type: props.type};

    this.handleOnChange = this.handleOnChange.bind(this);
  }

  handleOnChange(event) {
    if (this.props.onChange) {
      this.props.onChange(event);
    }
  }

  render() {
    const borderColor = this.props.errorText ? 'red' : '#4a4a4a';
    const styles = {
      wrapper: {
        marginTop: this.props.noMargin ? '0px' : '12px'
      },
      inputContainer: {
        width: '100%',
        height: '30px',
        display: 'flex',
        flexDirection: 'row',
        color: this.props.color,
        borderBottom: '1px solid ' + borderColor,
        opacity: 0.6,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: '6px',
        ':focus': {
          borderBottom: '1px solid #22b1d7'
        }
      },
      leftIconContainer: {
        width: '40px'
      },
      rightIconContainer: {
        width: '20px',
        marginLeft: '20px'
      },
      img: {
        width: '20px',
        height: '15px',
        opacity: 0.6
      },
      input: {
        border: 'none',
        flex: 1,
        height: '16.5px',
        fontFamily: 'Montserrat',
        fontSize: '14px',
        fontWeight: 300,
        outline: 'none',
        background: 'none',
        ':disabled': {
          color: this.props.color
        }
      },
      error: {
        color: 'red',
        fontFamily: 'Montserrat',
        fontWeight: 100,
        fontSize: '12px',
        height: '18px'
      }
    };

    const containerStyle = this.props.containerStyle
      ? Object.assign({}, styles.wrapper, this.props.containerStyle)
      : styles.wrapper;

    return (
      <div style={containerStyle}>
        <div style={styles.inputContainer}>
          {this.props.icon && (
            <div style={styles.leftIconContainer}>
              {this.props.icon}
            </div>
          )}
          <input
            type={this.state.type}
            placeholder={this.props.label}
            onChange={this.handleOnChange}
            onBlur={this.props.onBlur}
            style={styles.input}
            value={this.props.value}
            disabled={this.props.disabled}/>
          {this.props.type === 'password' && (
            <div
              style={styles.rightIconContainer}
              onTouchStart={() => { this.setState({type: 'text'}); }}
              onTouchEnd={() => { this.setState({type: 'password'}); }}>
              <ViewIcon />
            </div>
          )}
        </div>
        {this.props.errorText && (<div style={styles.error}>{this.props.errorText}</div>)}
      </div>
    );
  }
}

TextField.propTypes = {
  label: PropTypes.string.isRequired,
  type: PropTypes.string,
  disabled: PropTypes.bool,
  value: PropTypes.string,
  errorText: PropTypes.string,
  onChange: PropTypes.func,
  onBlur: PropTypes.func,
  icon: PropTypes.node,
  color: PropTypes.string,
  noMargin: PropTypes.bool,
  containerStyle: PropTypes.object
};
TextField.defaultProps = {
  color: "#17282D",
  type: 'text',
  errorText: '',
  supportErrors: true
};

export default Radium(TextField);
