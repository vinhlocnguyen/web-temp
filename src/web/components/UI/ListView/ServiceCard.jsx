import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { SmallClockIcon } from '../Icons';
import { convertDistance } from '../../../../redux/helpers/distance';
import Image from '../Image';
import { IMAGE } from '../../../../../config';
import FeatureToggle from '../FeatureToggle';

class ServiceCard extends Component {
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
      distance: {
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
      }
    };
    return (
      <div style={styles.container} onTouchTap={() => this.props.onHandleClick()}>
        <Image
          src={this.props.image}
          style={styles.image}
          placeholder={IMAGE.DEFAULT_CATEGORY[this.props.category && this.props.category.toLowerCase()]}
          />
        <div style={styles.contentWrapper}>
          <div style={styles.top}>
            <span style={styles.title}>{this.props.title}</span>
            <span style={styles.distance}>{convertDistance(this.props.distance)}</span>
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
        </div>
      </div>
    );
  }
}

ServiceCard.propTypes = {
  image: PropTypes.string,
  title: PropTypes.string,
  rating: PropTypes.number,
  distance: PropTypes.number,
  open: PropTypes.string,
  closedNow: PropTypes.bool,
  category: PropTypes.string,
  onHandleClick: PropTypes.func
};

export default ServiceCard;
