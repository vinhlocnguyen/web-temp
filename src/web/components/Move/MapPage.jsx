import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { SmallMoveIcon } from '../UI/Icons';
import TitleBar from '../UI/TitleBar';
import RoutedBackButton from '../RoutedBackButton';
import { ICONS } from '../../constants/map';
import { retrieveBuilding } from '../../../redux/actions/building';

//--intend for server-render
const isBrowser = typeof window !== 'undefined';
const L = isBrowser ? require('leaflet') : undefined;
if (isBrowser) {
  require('leaflet_css');
  require('leaflet_awesome_markers');
  require('leaflet_markers_css');
}

const styles = {
  map: {
    height: '100%',
    color: '#000'
  }
};

export class MapPage extends Component {
  componentDidMount() {
    if (Object.keys(this.props.building.current).length === 0) {
      this.props.retrieveBuilding().then(_ => {
        this.init(this.props.building);
      });
    } else {
      this.init(this.props.building);
    }
  }

  getIcon() {
    if (this.props.location.query && this.props.location.query.icon) {
      switch (this.props.location.query.icon) {
        case 'velib': return ICONS.bike;
        default: return isBrowser ? L.AwesomeMarkers.icon({
          icon: this.props.location.query.icon,
          prefix: 'fa',
          markerColor: 'black'
        }) : {};
      }
    } else {
      return isBrowser ? L.AwesomeMarkers.icon({
        icon: 'fa-cutlery',
        prefix: 'fa',
        markerColor: 'black'
      }) : {};
    }
  }

  init(building) {
    //create position
    const latlng = [building.current.geolocation[1], building.current.geolocation[0]];
    const buildingMarker = L.marker(latlng, { icon: ICONS.building });

    // initiate leaflet map
    const map = this.map = new L.Map('map', {
      zoomControl: true,
      zoom: 16,
      center: latlng,
      layers: [],
      dragging: true,
      touchZoom: true,
      scrollWheelZoom: true,
      doubleClickZoom: true,
      boxZoom: false,
      keyboard: false,
      attributionControl: false
    });

    buildingMarker.addTo(map);

    // marker array
    const markers = [buildingMarker];

    const query = this.props.location.query;
    // passed a specific position
    if (query.longitude && query.latitude) {
      const marker1 = L.marker([query.latitude, query.longitude], {icon: this.getIcon()});
      marker1.addTo(map);
      markers.push(marker1);
    }

    // add stop markers
    if (query.stops) {
      const stops = JSON.parse(query.stops);
      for (let i = 0; i < stops.length; i++) {
        const marker2 = L.marker(
          [stops[i].coord.lat, stops[i].coord.lon],
          {
            icon: this.getIcon(),
            title: "direction: " + stops[i].direction
          }
        );
        marker2.addTo(map);
        markers.push(marker2);
      }
    }
    // make a fit-bounds when the markers are over two items only.
    if (markers.length > 1) {
      const group = new L.featureGroup(markers);
      map.fitBounds(group.getBounds(), {
        maxZoom: 18
      });
    }

    map.on('locationfound', (e) => {
      var radius = e.accuracy / 2;
      L.marker(e.latlng, {icon: ICONS.bike}).addTo(map);
      L.circle(e.latlng, radius).addTo(map);
    });

    // if (navigator.geolocation) {
    //   navigator.geolocation.getCurrentPosition((position) => {
    //     var radius = position.coords.accuracy / 2;
    //     L.marker([position.coords.latitude, position.coords.longitude], {icon: ICONS.bike}).addTo(map);
    //     L.circle([position.coords.latitude, position.coords.longitude], radius, {weight: 1}).addTo(map);
    //   });
    // }

    const cartoDBPositron = L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png', {
      attribution: '&copy; Drops &copy; Flatturtle',
      maxZoom: 18
    });
    cartoDBPositron.addTo(map);
  }

  render() {
    return (
      <div
        className={'full-height'}
        style={{
          position: 'relative'
        }}>
        <TitleBar
          title={this.props.location.query.title}
          leftButton={<RoutedBackButton />} />

        <div id='map' style={styles.map} />
      </div>
    );
  }
}

MapPage.propTypes = {
  building: PropTypes.object.isRequired,
  location: PropTypes.object
};

MapPage.fetchData = ({store, location, params, history}) => {
  return store.dispatch(retrieveBuilding());
};

const mapStateToProps = state => ({
  building: state.building
});

const mapDispatchToProps = {
  retrieveBuilding
}

export default connect(mapStateToProps, mapDispatchToProps)(MapPage);
