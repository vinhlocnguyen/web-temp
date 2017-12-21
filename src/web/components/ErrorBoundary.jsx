import React, { Component } from  'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { reportError } from '../../redux/actions/error';
import ErrorPage from './ErrorPage';
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  componentDidCatch(error, info) {
    // Display fallback UI
    this.setState({ hasError: true });
    // You can also log the error to an error reporting service
    // error.info = JSON.stringify(info);
    error.info = info;    
    this.props.reportError(error);
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return <ErrorPage />
    }
    return this.props.children;
  }
}

ErrorBoundary.propTypes = {
  reportError: PropTypes.func
};

const mapStateToProps = state => ({});

export default connect(mapStateToProps, { reportError })(ErrorBoundary);