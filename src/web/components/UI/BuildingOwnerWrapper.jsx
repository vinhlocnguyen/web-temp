import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import NotFound from '../NotFound';
import clientStorage from '../../../redux/helpers/clientStorage';
//--intend for server-render
const isBrowser = typeof window !== 'undefined';

export class BuildingOwnerWrapper extends Component {
  render() {
    const isAdmin = isBrowser && clientStorage.getObject('user') && clientStorage.getObject('user').flatTurtleAdmin;
    const currentBuilding = clientStorage.getItem('buildingId');
    const isOwner = currentBuilding && this.props.user.info && this.props.user.info.ownedBuildings && this.props.user.info.ownedBuildings.indexOf(currentBuilding) >= 0;
    const view = (isAdmin || isOwner) ? React.cloneElement(this.props.children) : (this.props.isShowErrorPage ? <NotFound /> : null);
    return view;
  }
}
BuildingOwnerWrapper.contextTypes = {
  router: PropTypes.object.isRequired
};

BuildingOwnerWrapper.propTypes = {
  isShowErrorPage: PropTypes.bool,
  user: PropTypes.object.isRequired,
  children: PropTypes.node.isRequired
};

const mapStateToProps = state => ({
  user: state.user
});

export default connect(mapStateToProps)(BuildingOwnerWrapper);
