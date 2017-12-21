import PropTypes from 'prop-types';
import React, { Component } from 'react';
import {
  ListViewIcon,
  MapViewIcon,
  SmallMoveIcon
} from '../UI/Icons';
import { connect } from 'react-redux';
import {injectIntl, intlShape} from 'react-intl';
import TitleBar from '../UI/TitleBar';
import IconButton from '../UI/IconButton';
import ColorBackground from '../Backgrounds/ColorBackground';
import RoutedBackButton from '../RoutedBackButton';
import PushButton from '../UI/PushButton';
import {
  MobilityCard,
  GenericItem
} from '../UI/ListView';
import MapView from '../UI/MapView';
import {
  retrieveBuilding,
  findEtaNextTransports
} from '../../../redux/actions/building';
import { update as updateUser } from '../../../redux/actions/user';
import { filterTransports } from '../../../redux/actions/transport';
import { calculateStopsDistance } from '../../../redux/helpers/distance';
import localeName from '../../../redux/helpers/localeName';
import FeatureToggle from '../UI/FeatureToggle';
import { ICONS } from '../../constants/map';
import CircularProgress from 'material-ui/CircularProgress';
import clientStorage from '../../../redux/helpers/clientStorage';
import Dialog from 'material-ui/Dialog';
import TaxiCard from '../UI/TaxiCard';
import Filter from './Filter';
import styled from 'styled-components';
import { media, ContentContainer, FullHeightDiv } from '../styleUlti';

const FilterTools = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin: 14px;
  align-items: center;
`;
const ViewButtonWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 10px 0;
`;
const StopsWrapper = styled.div`
  overflow: auto;
  height: calc(100% - 120px);
  padding-bottom: 10px;
`;
const LoadingWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 20px;
`;
const styles = {
  filterButton: {
    width: '60px',
    height: '20px',
    borderRadius: '2px',
    backgroundColor: '#0c78be',
    fontSize: 15,
    lineHeight: '20px',
    padding: '5px'
  },
  viewButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 28,
    height: 28,
    padding: 2,
    border: '1px solid #dcdcdc'
  }
};

//--intend for server-render
const isBrowser = typeof window !== 'undefined';

export class TransportList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      stops: props.transport.publicTransports,
      viewMode: isBrowser && clientStorage.getObject('user') && (clientStorage.getObject('user').uiOptions.move.defaultView || 'list'),
      isLoading: false,
      isBlockedLocation: false,
      selectedTaxi: null,
      isOpenTaxiModal: false,
      modalActions: [],
      openFilter: false,
      filters: props.transport.filters
    };

    this.handleCloseTaxiModal = this.handleCloseTaxiModal.bind(this);
    this.handleCallTaxi = this.handleCallTaxi.bind(this);
    this.goToTaxiWebsite = this.goToTaxiWebsite.bind(this);
    this.handleFilterToggle = this.handleFilterToggle.bind(this);
    this.handleFilter = this.handleFilter.bind(this);
  }

  componentWillMount() {
    if (Object.keys(this.props.building.current).length === 0) {
      this.props.retrieveBuilding();
    }
    if (this.props.transport.publicTransports.length === 0 && !this.state.isLoading) {
      this.setState({isLoading: true});
      this.props.findEtaNextTransports().then(_ => {
        this.setState({
          stops: this.props.transport.publicTransports,
          isLoading: false
        });
        calculateStopsDistance(this.props.building.current, this.props.transport.publicTransports, this.props.user.info.isUseMyLocation).then(result => {
          this.setState({
            stops: result.stops,
            isBlockedLocation: result.isBlockedLocation
          });
        });
      });
    } else {
      calculateStopsDistance(this.props.building.current, this.props.transport.publicTransports, this.props.user.info.isUseMyLocation).then(result => {
        this.setState({
          stops: result.stops,
          isBlockedLocation: result.isBlockedLocation
        });
      });
    }
  }

  handleFilterToggle() {
    this.setState({
      openFilter: !this.state.openFilter
    });
  }

  handleFilter(filters) {
    this.props.filterTransports(filters);
  }

  filterTransports(transports, filters) {
    if (!filters || !filters.length) {
      return transports;
    }

    return transports.filter(item => {
      return filters.indexOf(item.type) >= 0
    });
  }

  handleSelect(stop) {
    if (['velib', 'velo', 'villo'].includes(stop.type.toLowerCase())) {
      const availableBikes = stop[stop.type] && (stop[stop.type].available_bikes || stop[stop.type].freebikes || 0);
      const bikeStands = stop[stop.type] && (stop[stop.type].bike_stands || (stop[stop.type].freespots + stop[stop.type].freebikes) || 0);
      this.context.router.history.push({
        pathname: '/map',
        query: {
          title: `Available bikes: ${availableBikes}/${bikeStands}`,
          longitude: stop.coord[0],
          latitude: stop.coord[1],
          icon: 'velib'
        }
      });
    } else if (stop.type.toLowerCase() !== 'taxi') {
      this.context.router.history.push({
        pathname: `/move/${stop.type}`,
        query: {
          name: stop[stop.type] && (stop[stop.type][0] && stop[stop.type][0].start),
          longitude: stop.coord[0],
          latitude: stop.coord[1]
        }
      });
    } else {
      this.setState({
        selectedTaxi: stop,
        isOpenTaxiModal: true
      });
    }
  }

  handleCloseTaxiModal() {
    this.setState({isOpenTaxiModal: false, selectedTaxi: null})
  }

  goToTaxiWebsite() {
    window && window.open(this.state.selectedTaxi.information.website, '_blank');
    this.setState({
      isOpenTaxiModal: false,
      selectedTaxi: null
    });
  }

  handleCallTaxi() {
    window && window.open(`tel://${this.state.selectedTaxi.information.phone}`, '_blank');
    this.setState({
      isOpenTaxiModal: false,
      selectedTaxi: null
    });
  }

  switchViewMode(mode) {
    this.setState({
      viewMode: mode
    });
    const uiOptions = this.props.user.info.uiOptions;
    uiOptions.move.defaultView = mode;
    this.props.updateUser({uiOptions});
  }

  renderListView(stops, formatMessage) {
    // render stops
    const building = this.props.building.current;
    return stops.map((stop, index) => {
      const type = stop.type;
      switch (type.toLowerCase()) {
        case 'taxi':
          stop.title = building.address && localeName(type, building.address.country, building.address.city);
          stop.kind = 'taxi';
          stop.information = stop[type] && stop[type][0];
          stop.location = stop.information && stop.information.name;
          break;  
        case 'villo':
        case 'velo':
        case 'velib':  
          stop.title = building.address && localeName(type, building.address.country, building.address.city);
          stop.kind = 'bikes';
          stop.information = stop[type];
          stop.location = stop.information && stop.information.name;
          break;
        default:
          stop.title = building.address && localeName(type, building.address.country);
          stop.kind = 'publicTransport';
          stop.information = stop[type] && stop[type][0];
          stop.location = stop.information && stop.information.start;
        break;
      }
      
      const lineStyle = stop.information && stop.information.line && stop.information.line.color && stop.information.line.text_color ? {
        backgroundColor: stop.information.line.color,
        color: stop.information.line.text_color
      } : {};
      return stop.information && (
        <MobilityCard key={index}
          location={stop.location}
          title={stop.title}
          serviceType={stop.kind}
          distance={stop.distance}
          info={stop.information}
          lineStyle={lineStyle}
          onHandleClick={this.handleSelect.bind(this, stop)} />
      );
    });
  }

  renderMapView(stops) {
    const buildingLoc = this.props.building.current.geolocation;
    const places = stops.map(stop => {
      if (stop.type.toLowerCase() === 'taxi') {
        return null;
      }
      const place = {};
      const type = stop.type;
      switch (type.toLowerCase()) {
        case 'villo':
        case 'velo':
        case 'velib':
          place.icon = ICONS.bike;
          break;
        case 'train':
        case 'rer':
          place.icon = ICONS.train;
          break;
        case 'tramway':
        case 'subway':
        case 'metro':
          place.icon = ICONS.metro;
          break;
        case 'bus':
          place.icon = ICONS.bus;
          break;
      }
      place.name = stop[type] && (stop[type].name || (stop[type][0] && stop[type][0].start));
      place.latitude = stop.coord[1];
      place.longitude = stop.coord[0];
      place.line = stop[type] && (stop[type].line || (stop[type][0] && stop[type][0].line));
      place.selectedItem = stop;
      return place;
    }).filter(stop => {return stop });
    return buildingLoc && (
      <MapView
        mainLocation={{
          latitude: buildingLoc[1],
          longitude: buildingLoc[0]
        }}
        places={places}
        onViewDetail={this.handleSelect.bind(this)}
      />
    );
  }

  renderTaxiPopup() {
    const taxi = this.state.selectedTaxi && this.state.selectedTaxi.information;

    return (
      <Dialog
        modal={false}
        open={this.state.isOpenTaxiModal}
        onRequestClose={this.handleCloseTaxiModal}
        >
        <TaxiCard
          taxi={taxi}
          callTaxi={this.handleCallTaxi}
          goToWebsite={this.goToTaxiWebsite}
        />  
      </Dialog>
    )
  }

  render () {
    const {formatMessage} = this.props.intl;
    const filtered = this.filterTransports(this.state.stops, this.state.filters);
    const stops = isBrowser && (this.state.viewMode === 'map' ? this.renderMapView(filtered) : this.renderListView(filtered, formatMessage));
    const mainView = this.state.isLoading ? (
      <div style={styles.loading}>
        <CircularProgress size={60} />
      </div>
    ) : (
      <div style={styles.stopsWrapper}>
        {stops}
      </div>
      );
    
    const popup = this.renderTaxiPopup();
    
    return (
      <ColorBackground color='#eceff1'>
        <FullHeightDiv>
          <Filter 
            transports={this.state.stops}
            filters={this.state.filters}
            open={this.state.openFilter}
            toggleFilter={this.handleFilterToggle}
            onFinish={this.handleFilter}
          >
          <TitleBar
            title={formatMessage({id: 'moveList.title'})}
            leftButton={<RoutedBackButton/>}
            icon={<SmallMoveIcon/>}
            errorMsg={this.state.isBlockedLocation ? formatMessage({id: 'warning.locationService'}) : null}
          />
          <ContentContainer>
            <FilterTools>
              <FeatureToggle feature='feature_switch_views'>
                <ViewButtonWrapper>
                  <IconButton style={{
                    ...styles.viewButton,
                    borderRight: 'none',
                    borderRadius: '4px 0 0 4px',
                    backgroundColor: this.state.viewMode === 'list' ? '#dcdcdc' : '#ffffff'
                  }} icon={<ListViewIcon />} onTouchTap={this.switchViewMode.bind(this, 'list')} />
                  <div style={styles.line} />
                  <IconButton style={{
                    ...styles.viewButton,
                    borderLeft: 'none',
                    borderRadius: '0 4px 4px 0',
                    backgroundColor: this.state.viewMode === 'map' ? '#dcdcdc' : '#ffffff'
                  }} icon={<MapViewIcon />} onTouchTap={this.switchViewMode.bind(this, 'map')} />
                </ViewButtonWrapper>
              </FeatureToggle>
              <PushButton style={styles.filterButton} label='filter' noMargin handleClick={this.handleFilterToggle}/>
            </FilterTools>
            {mainView}
            {popup}
          </ContentContainer>
          </Filter>
        </FullHeightDiv>
      </ColorBackground>
    );
  }
}

TransportList.propTypes = {
  intl: intlShape.isRequired,
  building: PropTypes.object,
  transport: PropTypes.object,
  user: PropTypes.object,
  retrieveBuilding: PropTypes.func,
  findEtaNextTransports: PropTypes.func,
  updateUser: PropTypes.func
};

TransportList.contextTypes = {
  router: PropTypes.object
};

TransportList.fetchData = ({store, location, params, history}) => {
  const p1 = store.dispatch(retrieveBuilding());
  const p2 = store.dispatch(findEtaNextTransports());
  return Promise.all([p1, p2]);
};

const mapStateToProps = state => ({
  building: state.building,
  transport: state.transport,
  user: state.user
});

const mapDispatchToProps = {
  retrieveBuilding,
  findEtaNextTransports,
  updateUser,
  filterTransports
};

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(TransportList));
