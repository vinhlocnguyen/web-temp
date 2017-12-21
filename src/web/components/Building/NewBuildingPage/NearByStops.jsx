import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { injectIntl, intlShape } from 'react-intl';
import ListViewItem from '../../UI/ListView/ListViewItem';
import RemoveButton from '../../UI/ListView/RemoveButton';
import AddButton from '../../UI/ListView/AddButton';
import TextField from '../../UI/TextField';
import { findNearbyStops } from '../../../../redux/actions/building';
import {
  ListEditText,
  ListEditPhoneNumber,
  Separator
} from '../../UI/ListView';
import ColoredButton from '../../UI/ColoredButton';
import Snackbar from 'material-ui/Snackbar';

const isBrowser = typeof window !== 'undefined';
const maxSearchDistance = isBrowser && parseInt(window.__ENV__.max_stops_search_distance);
const defaultSearchDistance = isBrowser && window.__ENV__.default_stops_search_distance;
const styles = {
  stepContainer: {
    display: 'flex',
    flexDirection: 'column',
    padding: '20px 0',
    overflow: 'auto',
    height: '100%',
    width: '100%'
  },
  stepTitle: {
    color: '#0e81a7',
    fontWeight: 'bold',
    fontFamily: 'Montserrat',
    textAlign: 'center'
  },
  wrapper: {
  },
  title: {
    color: '#34b1d7',
    margin: '10px 20px 0',
    fontFamily: 'Montserrat',
    fontSize: 16
  },
  list: {
    background: '#fff',
    margin: '10px 20px 20px',
    overflow: 'auto',
    maxHeight: 200,
    minHeight: 10
  },
  taxiList: {
    background: '#fff',
    margin: '10px 20px 20px',
    overflow: 'auto',
    maxHeight: 270,
    minHeight: 10
  },
  separator: {
    borderBottom: '1px solid rgba(0, 0, 0, 0.12)'
  }
};

class NearByStops extends Component {
  constructor(props) {
    super(props);
    this.state = {
      distance: {
        value: defaultSearchDistance,
        lastInserted: null
      },
      findNearbyStopsJob: null,
      newTaxiName: '',
      newTaxiPhone: '',
      newTaxiWebsite: ''
    }

    this.handleChangeDistance = this.handleChangeDistance.bind(this);
    this.handleSearchNearByStop = this.handleSearchNearByStop.bind(this);
    this.initNewTaxi = this.initNewTaxi.bind(this);
    this.addTaxi = this.addTaxi.bind(this);
  }

  initNewTaxi() {
    this.setState({
      newTaxiName: '',
      newTaxiPhone: '',
      newTaxiWebsite: ''
    });
  }

  handleSearchNearByStop() {
    const formatMessage = this.props.intl.formatMessage;
    const distance = this.state.distance.value;
    const lastInserted = this.state.distance.lastInserted;
    if (distance <= 0) {
      this.setState({
        distance: {
          value: distance,
          lastInserted: lastInserted,
          error: formatMessage({id: 'error.greaterThanZero'})
        }
      });
      clearInterval(this.state.findNearbyStopsJob);
      this.setState({
        findNearbyStopsJob: null
      });
      return;
    }

    if (distance > maxSearchDistance) {
      this.setState({
        distance: {
          value: distance,
          lastInserted: lastInserted,
          error: formatMessage({id: 'error.maxStopsSearchDistance'}, {maxDistance: maxSearchDistance}) // `Maximum is ${maxSearchDistance} km.`
        }
      });
      clearInterval(this.state.findNearbyStopsJob);
      this.setState({
        findNearbyStopsJob: null
      });
      return;
    }

    const { address, region } = this.props;
    
    const now = new Date();

    if (!lastInserted) {
      return; 
    }

    if ((now.getTime() - lastInserted.getTime()) > 1000) {
      clearInterval(this.state.findNearbyStopsJob);
      this.setState({
        findNearbyStopsJob: null
      });
      this.props.doFindNearbyStops(region, address, distance);
    }
  }

  handleChangeDistance(e) {
    this.setState({
      distance: {
        value: e.target.value,
        error: '',
        lastInserted: new Date()
      }
    });

    if (!e.target.value || this.state.findNearbyStopsJob) {
      return;
    }

    let findNearbyStopsJob = window && setInterval(this.handleSearchNearByStop,1500);      
    this.setState({
      findNearbyStopsJob: findNearbyStopsJob
    });
  }

  addTaxi() {
    const { newTaxiName, newTaxiPhone, newTaxiWebsite } = this.state;
    let taxi = {
      name: newTaxiName,
      phone: newTaxiPhone,
      website: newTaxiWebsite,
      stopType: 'Taxi',
      provider: 'none'
    }
    const index = this.props.nearByStops
      .filter(item => { return item.stopType === 'Taxi' })
      .map(item => { return item.name })
      .indexOf(newTaxiName);
    
    if (index < 0) {
      this.props.onHandleChange('nearByStops.add', taxi);
      this.initNewTaxi();
      // TODO find a way to notifi user about state of add taxi
    } else {
      // TODO show message error
    }
  }

  renderSelectedStations(selected) {
    const formatMessage = this.props.intl.formatMessage;
    const selectedItems = selected && selected.map((item, index) =>
      <ListViewItem
        key={index}
        title={item.name || item.stationName}
        content={item.stopType}
        style={styles.separator}
        button={<RemoveButton onHandleClick={() => this.props.onHandleChange('nearByStops.remove', item)} />}
      />
    );
    return (
      <div style={styles.wrapper}>
        <div style={styles.title}>{formatMessage({id: 'newbuilding.nearByStops.selectedTitle'})}</div>
        <div style={styles.list}>
          {selectedItems}
        </div>
      </div>
    );
  }
  renderStations(stations) {
    // const selected = this.props.nearByStops.map(item => JSON.stringify(item));
    // const filtered = stations && stations.filter(item => !selected.includes(JSON.stringify(item)));
    const selected = this.props.nearByStops.map(item => {
      if (item.stopId || item.stationId) {
        return (item.stopId || item.stationId).toString();
      } else {
        // return JSON.stringify(item);
        return item.stationName || item.name;
      }
    });
    const filtered = stations && stations.filter(item => {
      if (item.stopId || item.stationId) {
        return !selected.includes((item.stopId || item.stationId).toString());
      } else {
        // return !selected.includes(JSON.stringify(item));
        return !selected.includes(item.stationName || item.name);
      }
    });
    return filtered && filtered.map((item, index) =>
      <ListViewItem
        key={index}
        content={item.name || item.stationName}
        style={styles.separator}
        button={<AddButton onHandleClick={() => this.props.onHandleChange('nearByStops.add', item)} />}
      />
    );
  }

  renderNewTaxi() {
    const formatMessage = this.props.intl.formatMessage;
    return (
      <div style={styles.taxiWrapper}>
        <div style={styles.title}>{formatMessage({id: 'newbuilding.nearByStops.taxi'})}</div>
        <div style={styles.taxiList}>
          <ListEditText
            title={formatMessage({id: 'newbuilding.taxi.name'})}
            value={this.state.newTaxiName}
            onChange={e => {this.setState({newTaxiName: e.target.value})}}
          />
          <ListEditPhoneNumber
            title={formatMessage({id: 'newbuilding.taxi.phone'})}
            value={this.state.newTaxiPhone}
            onChange={value => this.setState({newTaxiPhone: value})}
          />
          <Separator/>
          <ListEditText
            title={formatMessage({id: 'newbuilding.taxi.website'})}
            value={this.state.newTaxiWebsite}
            onChange={e => {this.setState({newTaxiWebsite: e.target.value})}}
          />
          <Separator />
          <ColoredButton
            label='Add taxi'
            handleClick={this.addTaxi}
          />
        </div>
      </div>
    )
  }

  renderSuggestions(suggestions) {
    return suggestions && suggestions.map((item, index) => (
      <div style={styles.wrapper} key={index}>
        <div style={styles.title}>{item.type}</div>
        <div style={styles.list}>
          {this.renderStations(item.stopPoints || item.stations)}
        </div>
      </div>
    ));
  }

  render() {
    const formatMessage = this.props.intl.formatMessage;
    const suggestions = this.props.building.suggestionStops;
    return (
      <div style={styles.stepContainer}>
        <div style={styles.stepTitle}>
          {formatMessage({id: 'newbuilding.nearByStops.title'})}
        </div>
        <ListViewItem
          title="Search distance (km)"  
          content={
            <TextField
              label='Distance in Km'
              value={this.state.distance.value}
              onChange={this.handleChangeDistance}
              errorText={this.state.distance.error}
            />
          }
        />
        {this.renderSelectedStations(this.props.nearByStops)}
        {this.renderSuggestions(suggestions)}
        {this.renderNewTaxi()}
      </div>
    );
  }
}

NearByStops.propTypes = {
  intl: intlShape.isRequired,
  building: PropTypes.object.isRequired,
  nearByStops: PropTypes.array.isRequired,
  onHandleChange: PropTypes.func.isRequired,
  address: PropTypes.string,
  region: PropTypes.string,
  doFindNearbyStops: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  building: state.building
});

const mapDispatchToProps = {
  findNearbyStops
}

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(NearByStops));
