import PropTypes from 'prop-types';
import React, { Component } from 'react';
import DatePicker from 'react-datepicker';
import IconButton from '../UI/IconButton';
import { ClockIcon } from '../UI/Icons';
import moment from 'moment';

const isBrowser = typeof window !== 'undefined';
if (isBrowser) {
  require('react-datepicker/dist/react-datepicker.css');
}

class CustomInput extends Component {
  render() {
    const date = moment(this.props.value).format('dddd, MMMM Do YYYY');
    return (
        <div style={styles.inputView}>
          <div>{date}</div>
          <IconButton
            onTouchTap={this.props.onClick}
            icon={<ClockIcon />} />
        </div>
    );
  }
}

CustomInput.propTypes = {
  value: PropTypes.string,
  onClick: PropTypes.func
};

class DatePickerView extends Component {
  render() {
    return (
      <div style={styles.calendarBox}>
        <DatePicker
          customInput={<CustomInput />}
          selected={this.props.value}
          // i will check this format later
          dateFormat="YYYY-MM-DD"
          onChange={this.props.onHandleChange} />
      </div>
    );
  }
}

const styles = {
  calendarBox: {
    height: '56px',
    borderBottom: '1px solid #e6e6e6',
    borderTop: '1px solid #e6e6e6',
    backgroundColor: '#dff2f7',
    display: 'flex'
  },
  inputView: {
    height: '100%',
    fontFamily: 'Montserrat',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    color: '#4d79b8',
    padding: '0 20px',
    fontSize: 14,
    fontWeight: 'bold'
  }
};

DatePickerView.propTypes = {
  onHandleChange: PropTypes.func,
  value: PropTypes.object
};

export default DatePickerView;
