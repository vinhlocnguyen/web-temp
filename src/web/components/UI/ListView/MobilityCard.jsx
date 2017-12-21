import PropTypes from 'prop-types';
import React, { Component } from 'react';
import {
  MVTaxiIcon,
  MVUberIcon,
  MVVelibIcon,
  MVAutolibIcon,
  MVPublicTransportIcon,
  MVTrafficIcon,
  MVAirportIcon,
  ClearLocationIcon
} from '../Icons';
import { convertDistance } from '../../../../redux/helpers/distance';

const IconMapping = {
  'taxi': <MVTaxiIcon />,
  'uber': <MVUberIcon />,
  'bikes': <MVVelibIcon />,
  'cars': <MVAutolibIcon />,
  'publicTransport': <MVPublicTransportIcon />,
  'liveTraffic': <MVTrafficIcon />,
  'airport': <MVAirportIcon />
};

class MobilityCard extends Component {
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
      mainWrapper: {
        display: 'flex',
        flexDirection: 'column',
        flexGrow: 1,
        marginLeft: '10px'
      },
      topWrapper: {
        display: 'flex',
        justifyContent: 'space-between'
      },
      bottomWrapper: {
        marginTop: '8px'
      },
      title: {
        fontFamily: 'Montserrat',
        fontSize: '16px',
        lineHeight: 0.9,
        color: '#4a4a4a',
        wordBreak: 'break-word'
      },
      line: Object.assign({
        fontSize: '12px',
        fontWeight: 100,
        lineHeight: 1,
        color: '#ffffff',
        backgroundColor: '#0A96A0',
        padding: '0px 10px',
        marginLeft: 5
      }, this.props.lineStyle),
      distance: {
        fontFamily: 'Montserrat',
        fontSize: '14px',
        lineHeight: 1.1,
        textAlign: 'right',
        color: '#0c78be'
      },
      location: {
        opacity: 1.0,
        fontFamily: 'Montserrat',
        fontSize: '12px',
        fontWeight: 300,
        lineHeight: 0.8,
        color: '#4a4a4a',
        marginLeft: '5px',
        textTransform: 'capitalize',
        wordBreak: 'break-word'
      }
    };
    const Icon = IconMapping[this.props.serviceType];
    return (
      <div style={styles.container} onTouchTap={() => this.props.onHandleClick()}>
        {Icon}
        <div style={styles.mainWrapper}>
          <div style={styles.topWrapper}>
            <span style={styles.title}>
              {this.props.title}
              {this.props.info.line && <span style={styles.line}>{this.props.info.line.name}</span>}
            </span>
            <span style={styles.distance}>{this.props.serviceType.toLowerCase() === 'taxi' ? '' : convertDistance(this.props.distance)}</span>
          </div>
          {this.props.location && (
            <div style={styles.bottomWrapper}>
              <ClearLocationIcon />
              <span style={styles.location}>{this.props.location && this.props.location.toLowerCase()}</span>
            </div>
          )}
        </div>
      </div>
    );
  }
}

MobilityCard.propTypes = {
  title: PropTypes.string.isRequired,
  serviceType: PropTypes.string.isRequired,
  onHandleClick: PropTypes.func.isRequired,
  location: PropTypes.string,
  distance: PropTypes.number,
  info: PropTypes.object,
  style: PropTypes.object,
  lineStyle: PropTypes.object
};

MobilityCard.defaultProps = {
  lineStyle: {},
  style: {}
};

export default MobilityCard;
