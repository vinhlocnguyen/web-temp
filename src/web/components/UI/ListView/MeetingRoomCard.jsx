import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { SmallClockIcon } from '../Icons';
import Image from '../Image';
import { IMAGE } from '../../../../../config';
import FeatureToggle from '../FeatureToggle';

class MeetingRoomCard extends Component {
  render () {
    const styles = {
      container: {
        margin: '12px 14px 0',
        display: 'flex',
        flexDirection: 'row',
        padding: '10px',
        borderRadius: '4px',
        backgroundImage: 'linear-gradient(to bottom, rgba(255, 255, 255, 0.8), #ffffff)',
        boxShadow: '0 2px 5.5px 0 rgba(7, 25, 65, 0.2)'
      },
      image: {
        display: 'flex',
        width: '70px',
        height: '70px',
        flexGrow: 0,
        flexShrink: 0,
        flexBasis: '70px',
        marginRight: '10px'
      },
      contentWrapper: {
        display: 'flex',
        flexDirection: 'column',
        flexGrow: 1
      },
      top: {
        display: 'flex',
        justifyContent: 'space-between'
      },
      bottom: {
        marginTop: '16px'
      },
      title: {
        fontFamily: 'Montserrat',
        fontSize: '16px',
        lineHeight: 0.9,
        color: '#4a4a4a',
        wordBreak: 'break-word'
      },
      price: {
        fontFamily: 'Montserrat',
        fontSize: '14px',
        lineHeight: 1.1,
        textAlign: 'right',
        color: '#0c78be'
      },
      openingTime: {
        opacity: this.props.closedNow ? 0.37 : 1.0,
        fontFamily: 'Montserrat',
        fontSize: '12px',
        fontWeight: 300,
        lineHeight: 0.8,
        color: '#4a4a4a',
        marginLeft: '5px'
      },
      closed: {
        fontFamily: 'Montserrat',
        fontSize: '10px',
        fontWeight: 300,
        lineHeight: 1,
        color: '#d0021b',
        marginLeft: '8px',
        textTransform: 'uppercase'
      },
      info: {
        marginTop: '10px',
        color: '#4a4a4a',
        fontSize: '12px',
        marginLeft: '5px'
      }
    };

    return (
      <div style={styles.container} onTouchTap={() => this.props.onHandleClick()}>
        <Image
          src={this.props.image}
          style={styles.image}
          placeholder={IMAGE.NO_IMAGEs}
          />
        <div style={styles.contentWrapper}>
          <div style={styles.top}>
            <span style={styles.title}>{this.props.title}</span>
            {this.props.price && <span style={styles.price}>{this.props.price}{this.props.currency ? this.props.currency : ''}</span>}
          </div>
          {/*<div style={{
            marginTop: '8px'
          }}><Rating score={this.props.rating}/></div>*/}
          {this.props.open &&
          <FeatureToggle feature='feature_service_opening_closing_time'>
            <div style={styles.bottom}>
              <SmallClockIcon />
              <span style={styles.openingTime}>{this.props.open}</span>
              {this.props.closedNow && (
                <span style={styles.closed}>Closed now</span>)}
            </div>
          </FeatureToggle>}

          {this.props.generalInfo && <div style={styles.info}>
            <p>{this.props.generalInfo}</p>
          </div>}
        </div>
      </div>
    );
  }
}

MeetingRoomCard.propTypes = {
  image: PropTypes.string,
  title: PropTypes.string,
  generalInfo: PropTypes.string,
  open: PropTypes.string,
  closedNow: PropTypes.bool,
  price: PropTypes.number,
  currency: PropTypes.string,
  onHandleClick: PropTypes.func
};

export default MeetingRoomCard;
