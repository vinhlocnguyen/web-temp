import PropTypes from 'prop-types';
import React, { Component } from 'react';

class ListEditText extends Component {
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
      container: {
        display: 'flex',
        flexDirection: 'row',
        backgroundColor: '#ffffff',
        padding: '10px 14px',
        alignItems: 'center'
      },
      wrapper: {
        display: 'flex',
        flexDirection: 'column',
        flexGrow: 1
      },
      title: {
        fontFamily: 'Montserrat',
        fontSize: '13px',
        lineHeight: 1,
        color: '#22b1d7',
        marginBottom: '5px'
      },
      input: {
        fontFamily: 'Montserrat',
        fontSize: '14px',
        fontWeight: 300,
        lineHeight: 1.5,
        color: '#4a4a4a',
        border: 'none',
        flex: 1,
        background: 'none',
        outline: 'none'
      },
      button: {
        marginLeft: '42px'
      },
      error: {
        color: 'red',
        fontFamily: 'Montserrat',
        fontWeight: 100,
        fontSize: '12px',
        height: '18px'
      }
    };

    return (
      <div style={Object.assign(styles.container, this.props.style)}>
        <div style={styles.wrapper}>
          <div style={styles.title}>
            {this.props.title} {this.props.subtitle}
          </div>
          <div style={styles.content}></div>
          <input
            type='text'
            onChange={this.handleOnChange}
            style={Object.assign(styles.input, this.props.inputStyle)}
            value={this.props.value}
          />
        {this.props.errorText && (<div style={styles.error}>{this.props.errorText}</div>)}
        </div>
      </div>
    );
  }
}

ListEditText.propTypes = {
  title: PropTypes.string,
  subtitle: PropTypes.node,
  content: PropTypes.node, // This could be a text or something like an image
  button: PropTypes.node,
  handleClick: PropTypes.func,
  style: PropTypes.object,
  inputStyle: PropTypes.object,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  errorText: PropTypes.string
};

ListEditText.defaultProps = {
  inputStyle: {},
  style: {}
};

export default ListEditText;
