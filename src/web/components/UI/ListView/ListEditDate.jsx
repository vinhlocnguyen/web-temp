import PropTypes from 'prop-types';
import React, { Component } from 'react';
import DatePicker from 'material-ui/DatePicker/DatePicker';

class ListEditDate extends Component {
  constructor() {
    super();
    this.handleOnChange = this.handleOnChange.bind(this);
  }

  handleOnChange(e, date) {
    if (this.props.onChange) {
      this.props.onChange(date);
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
          {/* <input
            type='date'
            format='dd/mm/yyyy'
            onChange={this.handleOnChange}
            style={Object.assign(styles.input, this.props.inputStyle)}
            value={this.props.value}
          /> */}
          <DatePicker
            id='myDatePicker'  
            value={this.props.value}
            onChange={this.handleOnChange}
            autoOk={this.props.autoOk || true}
            container={this.props.container || 'inline'}
            mode='portrait'
          />
        {this.props.errorText && (<div style={styles.error}>{this.props.errorText}</div>)}
        </div>
      </div>
    );
  }
}

ListEditDate.propTypes = {
  title: PropTypes.string,
  subtitle: PropTypes.node,
  style: PropTypes.object,
  inputStyle: PropTypes.object,
  value: PropTypes.string,
  container: PropTypes.string,
  autoOk: PropTypes.bool,
  onChange: PropTypes.func.isRequired
};

ListEditDate.defaultProps = {
  inputStyle: {},
  style: {}
};

export default ListEditDate;
