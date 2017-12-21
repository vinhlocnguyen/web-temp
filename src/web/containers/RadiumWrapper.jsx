import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Radium from 'radium';

class RadiumWrapper extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className={this.props.className}>
        {React.cloneElement(this.props.children, {
          radiumConfig: this.props.radiumConfig
        })}
      </div>
    );
  }
}

RadiumWrapper.propTypes = {
  radiumConfig: PropTypes.object,
  className: PropTypes.string
};

export default Radium(RadiumWrapper);
