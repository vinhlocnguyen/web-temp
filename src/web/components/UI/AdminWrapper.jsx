import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import NotFound from '../NotFound';
import clientStorage from '../../../redux/helpers/clientStorage';
//--intend for server-render
const isBrowser = typeof window !== 'undefined';

export class AdminWrapper extends Component {
  render() {
    const view = isBrowser && clientStorage.getObject('user') && clientStorage.getObject('user').flatTurtleAdmin
      ? React.cloneElement(this.props.children) : (this.props.isShowErrorPage ? <NotFound /> : null);
    return view;
  }
}
AdminWrapper.contextTypes = {
  router: PropTypes.object.isRequired
};

AdminWrapper.propTypes = {
  isShowErrorPage: PropTypes.bool,
  user: PropTypes.object.isRequired,
  children: PropTypes.node.isRequired
};

const mapStateToProps = state => ({
  user: state.user
});

export default connect(mapStateToProps)(AdminWrapper);
