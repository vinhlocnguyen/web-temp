import PropTypes from 'prop-types';
import React, { Component } from 'react';
import BackButton from './UI/BackButton';

/*
 * Wrapping back behaviour around the pure UI component 'BackButton'
 */
class RoutedBackButton extends Component {
  render () {
    return (
      <BackButton handleClick={() => (this.context.router.history.goBack())} />
    );
  }
}

RoutedBackButton.contextTypes = {
  router: PropTypes.object.isRequired
};

export default RoutedBackButton;
