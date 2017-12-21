import React, { Component } from 'react';

// Code splitting
// getComponent is a function that returns a promise for a component
// It will not be called until the first mount
// function asyncComponent(getComponent) {
//   return class AsyncComponent extends Component {
//     static Component = null;
//     state = { Component: AsyncComponent.Component };

//     componentWillMount() {
//       if (!this.state.Component) {
//         getComponent().then(Component => {
//           AsyncComponent.Component = Component
//           this.setState({ Component })
//         })
//       }
//     }
//     render() {
//       const { Component } = this.state
//       if (Component) {
//         return <Component {...this.props} />
//       }
//       return <div style={{color: 'black'}}>...Loading</div>
//     }
//   }
// }

// const HomePage = asyncComponent(() =>
//   System.import('./HomePage/HomePage').then(module => module.default)
// );
// const LoginPage = asyncComponent(() =>
//   System.import('./LoginPage').then(module => module.default)
// );
// const TransportList = asyncComponent(() =>
//   System.import('./Move/TransportList').then(module => module.default)
// );
// const LivePage = asyncComponent(() => System.import('./Live/LivePage').then(module => module.default));

import HomePage from './HomePage/HomePage';
import LoginPage from './LoginPage';
import TransportList from './Move/TransportList';
import LivePage from './Live/LivePage';
import LiveDetail from './Live/LiveDetail';
import LiveEditPage from './Live/LiveEditPage';
import RegisterPage from './RegisterPage';
import TimeTable from './Move/TimeTable';
import SelectBuildingPage from './Building/SelectBuildingPage';
import WorkPage from './Work/WorkPage';
import MeetingRoomPage from './MeetingRoom/MeetingRoomPage';
import MeetingRoomInfoPage from './MeetingRoom/MeetingRoomInfoPage';
import MeetingRoomEditPage from './MeetingRoom/MeetingRoomEditPage';
import ChangePasswordPage from './ChangePasswordPage';
import ForgotPasswordPage from './ForgotPasswordPage';
import RetrievePasswordPage from './RetrievePasswordPage';
import CallbackPage from './CallbackPage';
import CalendarPage from './Work/CalendarPage';
import ProblemReportPage from './ProblemReportPage/ProblemReportPage';
import ResolveReportPage from './ProblemReportPage/ResolveReportPage';
import AboutPage from './AboutPage';
import HelpPage from './HelpPage';
import ListBuildingPage from './Building/ListBuildingPage';
import NewBuildingPage from './Building/NewBuildingPage/NewBuildingPage';
import AccountPage from './AccountPage/Index';
import VerifiedNumberPage from './VerifiedNumberPage/Index';
import BuildingInfoPage from './Building/BuildingInfoPage';
import EditBuilding from './Building/EditBuilding';
import ManageUserPage from './ManageUserPage';
import MapPage from './Move/MapPage';
import ManageMeetingRooms from './Building/ManageMeetingRooms';
import CreateServicePage from './Service/CreateServicePage';
import UserDetailPage from './UserDetailPage';
import ManageServicePage from './Service/ManageServicePage';

export {
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
}