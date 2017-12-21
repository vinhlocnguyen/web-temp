import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import cookie from 'react-cookie';
import clientStorage from '../redux/helpers/clientStorage';
import ReactCSSTransitionGroup from 'react-transition-group/CSSTransitionGroup';
//--intend for server-render
const isBrowser = typeof window !== 'undefined';

//google analytics
// authorization
const requireBuildingSelection = (props) => {
  return props.isServer ? props.selectedBuilding : (isBrowser && clientStorage.getItem('buildingId'));
};

const requireAuth = (props) => {
  return props.isServer ? props.isAuthenticated : (isBrowser && clientStorage.getItem('isAuthenticated') === 'true');
};

const RequireAuthRoute = ({ component: Component, ...props }) => (
  <Route {...props} render={props => {
    const staticContext = props.staticContext || {};
    const isAuthenticated = requireAuth(staticContext);
    if (!staticContext.isServer) {
      if (!isBrowser) {
        return null;
      }
    }
    
    if (!isAuthenticated) {
      return <Redirect to={{
        pathname: '/login',
        state: { nextPathname: props.location.pathname }
      }} />
    }
    return <Component {...props} />
  }} />
);

const RequireAuthAndBuildingRoute = ({ component: Component, ...props }) => (
  <Route {...props} render={props => {
    const staticContext = props.staticContext || {};
    if (!staticContext.isServer) {
      if (!isBrowser) {
        return null;
      }
    }

    const isAuth = requireAuth(staticContext);
    const buildingId = requireBuildingSelection(staticContext);    
    if (!isAuth) {
      return <Redirect to={{
        pathname: '/login',
        state: { nextPathname: props.location.pathname }
      }} />
    }
    // Prevent redirect if not auth. Note: code still run here althou isAuth = false
    if (!buildingId && isAuth) {
      return <Redirect to={{
        pathname: '/select-building',
        state: { hasBackButton: false }
      }} />
    }
    return (buildingId && isAuth) ? <Component {...props} /> : null;
  }} />
);

import {
  HomePage,
  LoginPage,
  RegisterPage,
  TransportList,
  TimeTable,
  LivePage,
  LiveDetail,
  LiveEditPage,
  SelectBuildingPage,
  WorkPage,
  MeetingRoomPage,
  MeetingRoomInfoPage,
  MeetingRoomEditPage,
  ChangePasswordPage,
  ForgotPasswordPage,
  RetrievePasswordPage,
  CallbackPage,
  CalendarPage,
  ProblemReportPage,
  ResolveReportPage,
  AboutPage,
  HelpPage,
  ListBuildingPage,
  NewBuildingPage,
  AccountPage,
  VerifiedNumberPage,
  BuildingInfoPage,
  EditBuilding,
  ManageUserPage,
  MapPage,
  ManageMeetingRooms,
  CreateServicePage,
  UserDetailPage,
  ManageServicePage
} from './components';

const routes = (props) => (
  <Switch>
    <RequireAuthAndBuildingRoute exact path='/' component={HomePage} {...props} />
    <Route path='/login' component={LoginPage} {...props} />
    <Route exact path='/register' component={RegisterPage} {...props} />
    <RequireAuthRoute exact path='/change-password' component={ChangePasswordPage} {...props} />
    <Route exact path='/forgot-password' component={ForgotPasswordPage} {...props} />
    <Route exact path='/retrieve-password' component={RetrievePasswordPage} {...props} />
    <Route exact path='/callback' component={CallbackPage} {...props} />
    <RequireAuthAndBuildingRoute exact path='/move' component={TransportList} {...props} />
    <RequireAuthAndBuildingRoute exact path='/move/:stopType' component={TimeTable} {...props} />
    <RequireAuthRoute exact path='/select-building' component={SelectBuildingPage} {...props} />
    <RequireAuthAndBuildingRoute exact path='/live' component={LivePage} {...props} />
    <RequireAuthAndBuildingRoute exact path='/live/:id' component={LiveDetail} {...props} />
    <RequireAuthAndBuildingRoute exact path='/live/:id/edit' component={LiveEditPage} {...props} />
    <RequireAuthAndBuildingRoute exact path='/work' component={WorkPage} {...props} />
    <RequireAuthAndBuildingRoute exact path='/meeting-rooms' component={MeetingRoomPage} {...props} />
    <RequireAuthAndBuildingRoute exact path='/meeting-rooms/:id' component={MeetingRoomInfoPage} {...props} />
    <RequireAuthAndBuildingRoute exact path='/meeting-rooms/:id/edit' component={MeetingRoomEditPage} {...props} />
    <RequireAuthAndBuildingRoute exact path='/report' component={ProblemReportPage} {...props} />
    <RequireAuthAndBuildingRoute exact path='/resolve-report' component={ResolveReportPage} {...props} />
    <RequireAuthAndBuildingRoute exact path='/map' component={MapPage} {...props} />
    <RequireAuthRoute exact path='/about' component={AboutPage} {...props} />
    <RequireAuthRoute exact path='/help' component={HelpPage} {...props} />
    <RequireAuthAndBuildingRoute exact path='/building-info' component={BuildingInfoPage} {...props} />
    <RequireAuthAndBuildingRoute exact path='/edit-building' component={EditBuilding} {...props} />
    <RequireAuthAndBuildingRoute exact path='/edit-building/:id' component={EditBuilding} {...props} />
    <RequireAuthAndBuildingRoute exact path='/edit-building/:id/meeting-rooms' component={ManageMeetingRooms} {...props} />
    <RequireAuthAndBuildingRoute exact path='/manage-buildings' component={ListBuildingPage} {...props} />
    <RequireAuthAndBuildingRoute exact path='/new-building' component={NewBuildingPage} {...props} />
    <RequireAuthAndBuildingRoute exact path='/manage-users' component={ManageUserPage} {...props} />
    <RequireAuthAndBuildingRoute exact path='/manage-services' component={ManageServicePage} {...props} />
    <RequireAuthRoute exact path='/account' component={AccountPage} {...props} />
    <RequireAuthAndBuildingRoute exact path='/users/:id' component={UserDetailPage} {...props} />
    <RequireAuthAndBuildingRoute exact path='/create-service/:type' component={CreateServicePage} {...props} />
    <RequireAuthRoute exact path='/verify-phone-number' component={VerifiedNumberPage} {...props} />
    <RequireAuthRoute exact path='/calendar' component={CalendarPage} {...props} />
  </Switch>
);
//     <Route path='calendar' getComponent={
//       (nextState, callback) => {
//         System.import('./components/Work/CalendarPage').then(loadRoute(callback)).catch(errorLoading);
//       }
//     } onEnter={requireAuth} />
//   </Route>
// );

export default routes;