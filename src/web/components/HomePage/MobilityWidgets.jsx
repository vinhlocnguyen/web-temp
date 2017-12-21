import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { intlShape, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import MobilityWidget from './MobilityWidget';
import * as BuildingActions from '../../../redux/actions/building';
import TimeHelper from '../../../redux/helpers/time';
import { TimeHomeIcon, BusIcon, MetroIcon, VelibIcon } from '../UI/Icons';
import localeName from '../../../redux/helpers/localeName';
import styled from 'styled-components';
import { media } from '../styleUlti';

const Container = styled.div`
  display: flex;
  flex-direction: row;
  flex-grow: 1;
  justify-content: space-around;
  flex-wrap: wrap;
  margin-top: 20px;
`;

export class MobilityWidgets extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {};
    //binding actions
    this.getWidget = this.getWidget.bind(this);
  }

  componentDidMount() {
    if (this.props.transport.publicTransports.length > 0) {
      this.calculateEta(this.props.transport.publicTransports);
    }
    this.findNext();
  }

  calculateEta(publicTransports) {
    const newState = {};
    publicTransports && publicTransports.forEach(item => {
      if (!newState[item.type]) {
        switch (item.type.toLowerCase()) {
          case 'taxi':
            break;  
          case 'velib':
            const bike = item[item.type];
            if (bike && [undefined, null].indexOf(bike.available_bikes) < 0 && [undefined, null].indexOf(bike.bike_stands) < 0) {
              bike.count = `${bike.available_bikes} / ${bike.bike_stands}`;
            } else {
              bike.count = '0/0';
            }
            newState[item.type] = bike;
            break;
          case 'villo':
          case 'velo':
            const bikeBelgium = item[item.type];
            if (bikeBelgium &&
                [undefined, null].indexOf(bikeBelgium.freebikes) < 0 &&
                [undefined, null].indexOf(bikeBelgium.freespots < 0)) {
              bikeBelgium.count = `${bikeBelgium.freebikes} / ${bikeBelgium.freespots + bikeBelgium.freebikes}`;
            } else {
              bikeBelgium.count = '0/0';
            }
            newState[item.type] = bikeBelgium;
            break;
          default:
            newState[item.type] = (item[item.type] && item[item.type].find(scd => scd.eta > 0)) || {};
            newState[item.type].coord = item.coord;
        }
      }
    });
    this.setState(newState);
  }

  findNext() {
    this.props.dispatch(BuildingActions.findEtaNextTransports()).then(_ => {
      this.calculateEta(this.props.transport.publicTransports);
    });
  };

  handleSelect(type, params) {
    if (type && params) {
      if (['velib', 'villo', 'velo'].includes(type.toLowerCase())) {
        const availableBikes = params.available_bikes || params.freebikes || 0;
        const bikeStands = params.bike_stands || params.freespots + params.freebikes || 0;
        this.context.router.history.push({
          pathname: '/map',
          query: {
            title: `Available bikes: ${availableBikes}/${bikeStands}`,
            latitude: (params.position && params.position.lat) || params.latitude,
            longitude: (params.position && params.position.lng) || params.longitude,
            icon: 'velib'
          }
        });
      } else {
        this.context.router.history.push({
          pathname: `/move/${type}`,
          query: {
            name: params.name || params.start,
            longitude: params.coord[0],
            latitude: params.coord[1]
          }
        });
      }
    }
  }

  getWidget(stopType) {
    if (stopType) {
      const {formatMessage} = this.props.intl;
      let icon;
      const line = this.state[stopType] && this.state[stopType].line && this.state[stopType].line.name;
      const infoStyle = this.state[stopType] && this.state[stopType].line && this.state[stopType].line.color && this.state[stopType].line.text_color ? {
        backgroundColor: this.state[stopType].line.color,
        color: this.state[stopType].line.text_color
      } : {};
      switch (stopType.toLowerCase()) {
        case 'taxi':
          break;  
        case 'car':
          const home = this.props.transport.home.duration ? this.props.transport.home.duration.text : '∞';
          return (
            <MobilityWidget
              key={stopType}
              title={formatMessage({id: 'homepage.mobility.home'})}
              value={home}
              icon={<TimeHomeIcon/>} />
          );
        case 'velib':
        case 'villo':
        case 'velo':
          const velibEta = this.state[stopType] ? this.state[stopType].count : '0/0';
          return (
            <MobilityWidget
              key={stopType}
              ref={stopType}
              title={(this.props.address && localeName(stopType, this.props.address.country, this.props.address.city)) || ''}
              value={velibEta}
              onTouchTap={this.handleSelect.bind(this, stopType, this.state[stopType])}
              info={line}
              infoStyle={{display: 'flex', width: '80%', textAlign: 'center', padding: '3px 12px'}}
              icon={<VelibIcon/>} />
          );
        case 'bus':
          icon = <BusIcon/>;
        case 'subway':
        case 'train':
        case 'tramway':
        case 'rer':
        case 'rapidtransit':
        case 'metro':
          icon = <MetroIcon/>;
        default:
          const eta = this.state[stopType] && this.state[stopType].eta ? TimeHelper.formatToString(this.state[stopType].eta) : '∞';
          return (
            <MobilityWidget
              key={stopType}
              ref={stopType}
              title={(this.props.address && localeName(stopType, this.props.address.country)) || ''}
              value={eta}
              onTouchTap={this.handleSelect.bind(this, stopType, this.state[stopType])}
              info={line}
              infoStyle={infoStyle}
              icon={icon} />
          );
      };
    }
    return null;
  }

	render() {
    const keep = [];
    // list widgets
    const widgets = this.props.user.info.transportMethods && this.props.user.info.transportMethods.length > 0
      ? this.props.user.info.transportMethods.map(item => {
        if (!keep.includes(item) && (item === 'Car' || (this.props.building.current.nearbyStops && this.props.building.current.nearbyStops.findIndex(stop => stop.stopType === item) > -1))) {
          keep.push(item);
          return this.getWidget(item);
        } else return null;
      }) : this.props.building.current.nearbyStops && this.props.building.current.nearbyStops.map(item => {
        if (!keep.includes(item.stopType)) {
          keep.push(item.stopType);
          return this.getWidget(item.stopType);
        } else return null;
      }).concat(this.getWidget('Car'));
		return (
			<Container>
        {widgets}
			</Container>
		);
	}
}

MobilityWidgets.contextTypes = {
  router: PropTypes.object
};

MobilityWidgets.propTypes = {
  intl: intlShape.isRequired,
  dispatch: PropTypes.func,
  building: PropTypes.object,
  transport: PropTypes.object,
  user: PropTypes.object,
  address: PropTypes.object
};

const mapStateToProps = state => ({
  user: state.user,
  building: state.building,
  transport: state.transport
});

export default connect(mapStateToProps)(injectIntl(MobilityWidgets));
