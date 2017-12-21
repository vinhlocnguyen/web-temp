import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { ClearLocationIcon } from '../Icons';

class BuildingCard extends Component {
  render() {
    const styles = {
      container: {
        margin: '0 14px 12px',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: '20px 15px',
        borderRadius: '4px',
        backgroundImage: 'linear-gradient(to bottom, rgba(255, 255, 255, 0.8), #ffffff)',
        boxShadow: '0 2px 5.5px 0 rgba(7, 25, 65, 0.2)'
      },
      mainWrapper: {
        display: 'flex',
        flexDirection: 'column',
        width: '96%'
      },
      titleWrapper: {
        display: 'flex',
        justifyContent: 'space-between'
      },
      bottomWrapper: {
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'center'
      },
      contentWrapper: {
        marginTop: '10px'
      },
      content: {
        fontFamily: 'Montserrat',
        fontSize: '12px',
        fontWeight: 300,
        lineHeight: 0.8,
        color: '#4a4a4a',
        marginLeft: '5px',
        wordBreak: 'break-word'
      },
      title: {
        fontFamily: 'Montserrat',
        fontSize: '16px',
        lineHeight: 0.9,
        color: '#4a4a4a',
        wordBreak: 'break-word'
      },
      deactive: {
        color: 'red',
        fontSize: '12px',
        padding: '2px',
        border: '1px solid red'
      }
    };
    return (
      <div style={styles.container} onTouchTap={() => this.props.onHandleClick()}>
        <div style={styles.mainWrapper}>
          <div style={styles.titleWrapper}>
            <span style={styles.title}>{this.props.title}</span>
            {!this.props.status && <span style={styles.deactive}>Deactivated</span>}
          </div>
          <div style={styles.contentWrapper}>
            <ClearLocationIcon />
            <span style={styles.content}>{this.props.content}</span>
          </div>
        </div>
        <div style={styles.bottomWrapper}>
          <span style={{color: '#4a4a4a'}}> > </span>
        </div>
      </div>
    );
  }
}

BuildingCard.propTypes = {
  title: PropTypes.string.isRequired,
  content: PropTypes.string.isRequired,
  status: PropTypes.bool,
  onHandleClick: PropTypes.func.isRequired
};

export default BuildingCard;
