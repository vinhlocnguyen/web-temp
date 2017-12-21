import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { FormattedMessage, intlShape, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import {
  ServiceCard,
  GenericItem
} from '../UI/ListView';
import {
  ListViewIcon,
  MapViewIcon,
  SmallLiveIcon
} from '../UI/Icons';
import IconButton from '../UI/IconButton';
import TitleBar from '../UI/TitleBar';
import RoutedBackButton from '../RoutedBackButton';
import MapView from '../UI/MapView';
import ColorBackground from '../Backgrounds/ColorBackground';
import { selectService } from '../../../redux/actions/service';
import time from '../../../redux/helpers/time';
import FeatureToggle from '../UI/FeatureToggle';
import clientStorage from '../../../redux/helpers/clientStorage';

const styles = {
  notFound: {
    fontFamily: 'Montserrat',
    fontSize: '13px',
    lineHeight: 1,
    color: 'red',
    marginBottom: '5px'
  },
  textSortby: {
    fontFamily: 'Montserrat',
    fontSize: '15px',
    fontWeight: 300,
    lineHeight: 1.1,
    color: '#4a4a4a'
  },
  textAllNearby: {
    fontFamily: 'Montserrat',
    fontSize: '15px',
    lineHeight: 1.1,
    color: '#0c78be'
  },
  filterButton: {
    width: '60px',
    height: '20px',
    borderRadius: '2px',
    backgroundColor: '#0c78be',
    fontSize: 15,
    lineHeight: '20px',
    padding: '5px'
  },
  filterTools: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    margin: '14px',
    alignItems: 'center'
  },
  viewButtonWrapper: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  viewButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 28,
    height: 28,
    padding: 2,
    border: '1px solid #dcdcdc'
  },
  line: {
    height: 32,
    border: '1px solid #dcdcdc'
  }
};

//--intend for server-render
const isBrowser = typeof window !== 'undefined';

export class ServiceList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      
    };
  }

  componentDidMount() {}

  handleSelect(service) {
    this.props.selectService(service);
    this.context.router.history.push(`/live/${service.id}`);
  }

  renderListView(services) {
    //returns if there is no service
    if (!services || !services.length) {
      return (
        <GenericItem><span style={styles.notFound}>
          <FormattedMessage id='livePage.notServiceFound' />
        </span></GenericItem>
      );
    } else {
      // render filtered services as list
      return services.map(svc =>
        <ServiceCard
          key={svc.id}
          title={svc.name}
          distance={svc.distance}
          image={svc.image && svc.image.thumbnail}
          category={svc.category}
          rating={svc.rating}
          open={svc.openingHours && (svc.openingHours.from + ' - ' + svc.openingHours.to)}
          onHandleClick={this.handleSelect.bind(this, svc)}
          />
      );
    }
  }

  renderMapView(services) {
    // render filtered services as map
    // const getLiveIcon = (category) => {
    //   switch (category) {
    //     case 'Food and beverages': return FoodMarkerIcon;
    //     case 'Hotels': return <HotelIcon />;
    //     case 'Conciergerie': return <ConciergerieIcon />;
    //     case 'Car wash': return <CarwashIcon />;
    //     case 'Fitness': return <FitnessIcon />;
    //     case 'Hairdresser': return <HairdresserIcon />;
    //     case 'Laundry': return <LaundryIcon />;
    //     default: return <FoodIcon />;
    //   }
    // };
    const buildingLoc = this.props.building.current.geolocation;
    const places = services && services.filter(item => {
      return item.geolocation && item.geolocation.length;
    }).map(item => ({
      id: item.id,
      name: item.name,
      address: item.address,
      phone: item.phoneNumber,
      latitude: item.geolocation[1],
      longitude: item.geolocation[0],
      selectedItem: item
      // icon: getLiveIcon(item.category)
    }));
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

  render() {
    const services = this.props.services.sort((a, b) => {
      if (!a.distance) {
        return 1;
      }

      if (!b.distance) {
        return -1;
      }

      if (a.distance > b.distance) {
        return 1;
      }

      if (a.distance < b.distance) {
        return -1;
      }
      return 0;
    });

    const pinnedServices = this.props.pinnedServices && this.props.pinnedServices.sort((a,b) => {
      if (a.order > b.order) {
        return 1;
      }

      if (a.order < b.order) {
        return -1;
      }
      return 0;
    });

    const renderServices = [...pinnedServices, ...services];
    const components = isBrowser && (this.props.viewMode === 'map' ? this.renderMapView(renderServices) : this.renderListView(renderServices));
    const {formatMessage} = this.props.intl;
    return (
      <div style={{
        height: '100%',
        overflow: 'auto'
      }}>
        {components}
      </div>
    );
  }
}

ServiceList.contextTypes = {
  router: PropTypes.object
};

ServiceList.propTypes = {
  intl: intlShape.isRequired,
  services: PropTypes.array.isRequired,
  pinnedServices: PropTypes.array,
  selectService: PropTypes.func.isRequired,
  building: PropTypes.object.isRequired,
  viewMode: PropTypes.string.isRequired,
  context: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  
});

const mapDispatchToProps = {
  selectService,
};

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(ServiceList));
