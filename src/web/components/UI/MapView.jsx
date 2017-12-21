import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { ICONS } from '../../constants/map';

//--intend for server-render
const isBrowser = typeof window !== 'undefined';
const L = isBrowser ? require('leaflet') : undefined;
if (isBrowser) {
  require('leaflet_css');
  require('leaflet_awesome_markers');
  require('leaflet_markers_css');
}

class MapView extends Component {
  constructor(props) {
    super(props);

    this.initMarkersLayer = this.initMarkersLayer.bind(this);
    this.initMap = this.initMap.bind(this);
  }

  componentDidMount() {
    this.initialize();
  }
  componentWillUpdate() {
    if(window.LMap) {
      window.LMap.off();
      window.LMap.remove();
      window.LMap = null;
    }
  }

  componentDidUpdate() {
    // this.updateMarkers();
    this.initialize();
  }

  viewDetail(selected) {
    this.props.onViewDetail(selected);
  }

  initMarkersLayer() {
    const mainLocation = this.props.mainLocation;
    const places = this.props.places;
    // for alone map
    const latitude = this.props.longitude;
    const longitude = this.props.latitude;
    const latlng = [mainLocation.latitude, mainLocation.longitude];
    const mainMarker = L.marker(latlng, {icon: ICONS.building});
    // default icon marker
    const defaultIcon = this.defaultIcon = (isBrowser && L.AwesomeMarkers.icon({
      icon: 'fa-map-marker',
      prefix: 'fa',
      markerColor: 'black'
    }));

    const markers = new L.featureGroup();
    // add main-marker to map
    markers.addLayer(mainMarker);
    // map with a specific position
    if (longitude && latitude) {
      const aloneMarker = L.marker([this.props.latitude, this.props.longitude], {icon: defaultIcon});
      markers.addLayer(aloneMarker);
    }

    // map with a array position
    this.createMarkers(markers, places);

    return markers
  }

  initMap() {
    const mainLocation = this.props.mainLocation;
    const latlng = [mainLocation.latitude, mainLocation.longitude];
    // initialize leftlet map
    if(window.LMap) {
      window.LMap.off();
      window.LMap.remove();
    }
    const map = new L.Map('map', {
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
    window.LMap = map;
    return map;
  }

  initialize() {
    const places = this.props.places;
    // for alone map
    const latitude = this.props.longitude;
    const longitude = this.props.latitude;
    const map = this.map = this.initMap();
    const markers = this.markers = this.initMarkersLayer();
    map.addLayer(markers);
    // make a fit-bounds when the markers are over two items.
    if (places.length > 0 || (longitude && latitude)) {
      map.fitBounds(markers.getBounds(), {
        maxZoom: 18
      });
    }

    const cartoDBPositron = L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png', {
      attribution: '&copy; Drops &copy; Flatturtle',
      maxZoom: 18
    });
    cartoDBPositron.addTo(map);
  }

  updateMarkers() {
    this.map.removeLayer(this.markers);
    this.markers.clearLayers();
    this.markers.addLayer(this.mainMarker);
    this.createMarkers(this.markers, this.props.places);
    this.map.addLayer(this.markers);
    this.map.fitBounds(this.markers.getBounds());
  }

  createMarkers(group, places) {
    for (let i = 0; i < places.length; i++) {
      if (places[i].name && places[i].latitude && places[i].longitude) {
        const marker = L.marker(
          [places[i].latitude, places[i].longitude],
          {icon: places[i].icon || this.defaultIcon}
        );
        const content = L.DomUtil.create('div');
        const lineStyle = places[i].line ? `background-color: ${places[i].line.color || '#0A96A0'};color: ${places[i].line.text_color || '#ffffff'}` : '';
        const line = places[i].line ? `<div class='line' style='${lineStyle}'>${places[i].line.name}</div>` : "";
        content.innerHTML = `<div class='popup'><div>${places[i].name}</div>${line}<div class='popupButton'>View detail</div></div>`;
        L.DomEvent.addListener(content, 'click', this.viewDetail.bind(this, places[i].selectedItem));
        marker.bindPopup(content, {keepInView: true, autoClose: false, className: 'mapPopup'});
        group.addLayer(marker);
      }
    }
  }

  render() {
    const styles = {
      container: {},
      map: {
        height: '100%'
      }
    };
    return (
      <div id='map' style={styles.map} />
    );
  }
}

MapView.propTypes = {
  mainLocation: PropTypes.object.isRequired,
  places: PropTypes.array,
  longitude: PropTypes.number,
  latitude: PropTypes.number,
  selectedItem: PropTypes.object,
  onViewDetail: PropTypes.func
};

export default MapView;
