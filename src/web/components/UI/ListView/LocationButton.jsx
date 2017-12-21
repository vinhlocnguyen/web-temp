import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { LocationIcon } from '../Icons';

class LocationButton extends Component {
  render () {
    const style = {
      width: '36px',
      height: '36px'
    };

    return (
      <a style={style} href={`geo:${this.props.coords}?q=${this.props.coords}(Inspira)`}>
        <LocationIcon />
      </a>
    );
  }
}

LocationButton.propTypes = {
  coords: PropTypes.string.isRequired
};

export default LocationButton;
