import PropTypes from 'prop-types';
import React, { Component } from 'react';

class ScheduleCard extends Component {

  render () {
    const styles = {
      container: {
        margin: 12,
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'row',
        padding: 12,
        borderRadius: '4px',
        backgroundImage: 'linear-gradient(to bottom, rgba(255, 255, 255, 0.8), #ffffff)',
        boxShadow: '0 2px 5.5px 0 rgba(7, 25, 65, 0.2)'
      },
      mainWrapper: {
        display: 'flex',
        justifyContent: 'space-between',
        width: '100%'
      },
      lineNumber: {
        fontFamily: 'Montserrat',
        fontSize: '14px',
        lineHeight: 1.1,
        textAlign: 'left',
        color: '#0c78be'
      },
      direction: {
        fontFamily: 'Montserrat',
        fontSize: '12px',
        lineHeight: 1.1,
        color: 'rgb(34, 177, 215)',
        textTransform: 'capitalize',
        wordBreak: 'break-word'
      },
      start: {
        fontFamily: 'Montserrat',
        fontSize: '15px',
        lineHeight: 1.1,
        color: '#4a4a4a',
        marginBottom: 10,
        textTransform: 'capitalize',
        wordBreak: 'break-word'
      },
      time: {
        fontFamily: 'Montserrat',
        fontSize: '14px',
        lineHeight: 1.1,
        textAlign: 'right',
        color: '#0c78be'
      }
    };
    return (
      <div style={styles.container} onTouchTap={() => this.props.onHandleClick()}>
        <div style={styles.mainWrapper}>
          {this.props.lineNumber && (
            <span style={styles.lineNumber}>{this.props.lineNumber}</span>
          )}
          <div>
            <div style={styles.start}>{this.props.start.toLowerCase()}</div>
            <div style={styles.direction}><span style={{color: '#4a4a4a'}}>Direction: </span>{this.props.direction.toLowerCase()}</div>
          </div>
          {this.props.time && (
            <span style={styles.time}>{this.props.time}</span>)}
        </div>
      </div>
    );
  }
}

ScheduleCard.propTypes = {
  start: PropTypes.string.isRequired,
  direction: PropTypes.string.isRequired,
  lineNumber: PropTypes.string,
  onHandleClick: PropTypes.func.isRequired,
  time: PropTypes.string
};

export default ScheduleCard;
