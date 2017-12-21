import PropTypes from 'prop-types';
import React, { Component } from 'react';
import styled from 'styled-components';
const ComingSoon = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  justify-content: center;
  align-items: center;
  font-family: Montserrat;
  font-size: 20px;
  line-height: 1;
  color: #4a4a4a;
`;
class FeatureToggle extends Component {
  isActive() {
    return window.__ENV__[this.props.feature] && JSON.parse(window.__ENV__[this.props.feature]);
  }

  render() {
    if (typeof window !== 'undefined' && (this.isActive() || window.__ENV__.NODE_ENV === 'development' || process.env.NODE_ENV === 'test')) {
      return React.cloneElement(this.props.children);
    }
    return this.props.isPage ? (
      <ComingSoon>
        COMING SOON
      </ComingSoon>
    ) : null;
  }
}

FeatureToggle.propTypes = {
  feature: PropTypes.string.isRequired,
  children: PropTypes.node,
  isPage: PropTypes.bool
};

export default FeatureToggle;
