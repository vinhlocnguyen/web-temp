import React, { Component } from 'react';
import ReactCSSTransitionGroup from 'react-transition-group/CSSTransitionGroup';
import { getAllCategories } from '../../redux/actions/category';
import { connect } from 'react-redux';
import cookie from 'react-cookie';
import ErrorBoundary from '../components/ErrorBoundary';
import Routes from '../routes';
import { Switch } from 'react-router-dom';
import clientStorage from '../../redux/helpers/clientStorage';
const isBrowser = typeof window !== 'undefined';
class App extends Component {
  componentDidMount() {
    // if (cookie.load('authToken')) {
    if (isBrowser && clientStorage.getItem('isAuthenticated') === 'true') {
      if (!this.props.category || !this.props.category.list.length) {
        this.props.getAllCategories();
      }
    }
  }
  render() {
    const action = this.props.history.action;
    return (
      <ErrorBoundary>
        <ReactCSSTransitionGroup
          transitionName={action === 'POP' ? 'reversePageSwap' : 'pageSwap'}
          transitionEnterTimeout={500}
          transitionLeaveTimeout={500}
        >
          <Routes key={this.props.history.location.pathname} />
        </ReactCSSTransitionGroup>
      </ErrorBoundary>
    );
  }
};

App.fetchData = ({store}) => {
  const p1 = store.dispatch(getAllCategories());
	return Promise.all([p1]);
}

const mapStateToProps = state => ({
  category: state.category,
  user: state.user
});

const mapActionsToProps = {
  getAllCategories
};

export default connect(mapStateToProps, mapActionsToProps)(App);
