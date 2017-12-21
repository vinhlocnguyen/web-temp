import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { ICONS } from '../../constants/map';
import { subway, velib } from '../../../redux/helpers/localeName';

//--intend for server-render
const isBrowser = typeof window !== 'undefined';
const L = isBrowser ? require('leaflet') : undefined;
if (isBrowser) {
  require('leaflet_css');
  require('leaflet_awesome_markers');
  require('leaflet_markers_css');
}

class MiniMap extends Component {
  componentDidMount() {
    this.initMap();
  }

  componentWillUpdate() {
    if(window.LMiniMap) {
      window.LMiniMap.off();
      window.LMiniMap.remove();
      window.LMiniMap = null;
    }
  }

  componentDidUpdate() {
    this.initMap();
  }

  getIcon(icon) {
    if (icon) {
      return isBrowser ? L.AwesomeMarkers.icon({
        icon: icon,
        prefix: 'fa',
        markerColor: 'black'
      }) : {};
    } else {
      return isBrowser ? L.AwesomeMarkers.icon({
        icon: 'fa-cutlery',
        prefix: 'fa',
        markerColor: 'black'
      }) : {};
    }
  }

  initMap() {
    const building = this.props.building;
    const stop = this.props.stop;
    // icon
    let icon;
    switch (stop.stopType) {
      case 'rer':
      case 'metro':
        icon = 'subway';
        break;
      case 'tramway':
        icon = 'train';
        break;
      default: icon = 'bus';
    }
    //create position
    const latlng = [building.geolocation[1], building.geolocation[0]];
    const buildingMarker = L.marker(latlng, { icon: ICONS.building });
    if(window.LMiniMap) {
      window.LMiniMap.off();
      window.LMiniMap.remove();
    }
    // initiate leaflet map
    const map = this.map = new L.Map('minimap', {
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

    window.LMiniMap = map;

    buildingMarker.addTo(map);
    const markers = [buildingMarker];
    // add stop markers
    if (stop) {
      const marker = L.marker(
        [stop.coord.lat, stop.coord.lon],
        {
          icon: this.getIcon(icon),
          title: stop.title
        }
      );
      markers.push(marker);
      marker.addTo(map);
    }

    // make a fit-bounds when the markers are over two items only.
    if (markers.length > 1) {
      const group = new L.featureGroup(markers);
      map.fitBounds(group.getBounds(), {
        maxZoom: 18
      });
    }

    const cartoDBPositron = L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png', {
      attribution: '&copy; Drops &copy; Flatturtle',
      maxZoom: 18
    });
    cartoDBPositron.addTo(map);
    // locale stop-type name
    const localeStop = (type) => {
      switch (type) {
        case 'tramway':
          return subway(building.address.country);
        default:
          return 'bus';
      }
    };
    // const title = localeStop(this.props.stopType) + ' stops';
    const title = stop.title;
    // redirect to full map page
    map.on('click', () => {
      this.context.router.history.push({
        pathname: '/map',
        query: {
          title: title,
          stops: JSON.stringify([this.props.stop]),
          icon: icon
        }
      });
    });
  }

  render() {
    return (
      <div id='minimap' style={{width: '100%', height: '25%'}} />
    );
  }
}

MiniMap.contextTypes = {
  router: PropTypes.object.isRequired
};

MiniMap.propTypes = {
  building: PropTypes.object.isRequired,
  stop: PropTypes.object,
  stopType: PropTypes.string
};

export default MiniMap;
