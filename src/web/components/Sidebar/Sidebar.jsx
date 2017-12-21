import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { logout } from '../../../redux/actions/user';
import {withRouter} from 'react-router-dom';
import {
  AccountIcon,
  AboutIcon,
  WhiteBuildingIcon,
  ReportIcon,
  LogoutIcon,
  ServiceIcon,
  UsersIcon
} from '../UI/Icons';
import {injectIntl, intlShape} from 'react-intl';
import Item from './Item';
import FeatureToggle from '../UI/FeatureToggle';
import clientStorage from '../../../redux/helpers/clientStorage';
//--intend for server-render
const isBrowser = typeof window !== 'undefined';

export class Sidebar extends Component {
  constructor () {
    super();

    this.state = {
      open: false
    };

    this.renderAdminView = this.renderAdminView.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (!nextProps.user.isAuthenticated && this.props.user.isAuthenticated !== nextProps.user.isAuthenticated) {
      this.context.router.history.push('/login');
    }
  }

  renderAdminView(formatMessage) {
    return (
      isBrowser && clientStorage.getObject('user') && clientStorage.getObject('user').flatTurtleAdmin && (
        <div>
          <FeatureToggle feature='feature_manage_buildings'>
            <Item
              icon={<WhiteBuildingIcon />}
              label={formatMessage({id: 'menu.manageBuildings'})}
              target='/manage-buildings'/>
          </FeatureToggle>
          <FeatureToggle feature='feature_manage_services'>
            <Item
              icon={<ServiceIcon />}
              label={formatMessage({id: 'menu.manageServices'})}
              target='/manage-services'
            />
          </FeatureToggle>
          <FeatureToggle feature='feature_manage_users'>
            <Item
              icon={<UsersIcon />}
              label={formatMessage({id: 'menu.manageUsers'})}
              target='/manage-users'/>
          </FeatureToggle>
        </div>
      )
    );
  }

  renderOwnerView(formatMessage) {
    const buildingId = this.props.building.current.id;
    const isOwner = this.props.user.info.ownedBuildings && this.props.user.info.ownedBuildings.indexOf(buildingId) >= 0;
    return (!this.props.user.info.flatTurtleAdmin && isOwner) ? (
        <div>
          <FeatureToggle feature='feature_manage_services'>
            <Item
              icon={<ServiceIcon />}
              label={formatMessage({id: 'menu.manageServices'})}
              target='/manage-services'
            />
          </FeatureToggle>
        </div>
      ) : null;
  }

  render () {
    const {formatMessage} = this.props.intl;
    const translateContent = this.props.open ? -80 : 0; // in percentage
    const translateMenu = this.props.open ? 0 : 100;    // in percentage
    const opacity = this.props.open ? 1 : 0;
    const isShowReportProblem = this.props.building.current.concierge && this.props.building.current.concierge.email;

    const styles = {
      wrapperContent: {
        transform: 'translateX(' + translateContent + '%)',
        transition: '0.3s'
      },
      wrapperMenu: {
        backgroundColor: '#2457a7',
        top: 0,
        position: 'absolute',
        right: 0,
        width: '80%',
        height: '100%',
        transition: '0.3s',
        transform: 'translateX(' + translateMenu + '%)',
        opacity: opacity
      }
    };

    return (
      <div className={'full-height'} style={{
        position: 'relative'
      }}>
        <div className={'full-height'} style={styles.wrapperContent}>
          {this.props.children}
        </div>
        <div style={styles.wrapperMenu}>
          <ul style={{
            display: 'flex',
            flexDirection: 'column',
            height: '100%'
          }}>
            <Item
              icon={<WhiteBuildingIcon />}
              label={formatMessage({id: 'menu.selectBuilding'})}
              target='/select-building' />
            <Item
              icon={<WhiteBuildingIcon />}
              label={formatMessage({id: 'menu.building'})}
              target='/building-info' />
            {isShowReportProblem && <Item
              icon={<ReportIcon />}
              label={formatMessage({ id: 'menu.reportProblem' })}
              target='/report' />
            }
            {this.renderAdminView(formatMessage)}
            {this.renderOwnerView(formatMessage)}
            <Item
              icon={<AccountIcon />}
              label={formatMessage({id: 'menu.account'})}
              target='/account' />
            {/* <Item
              icon={<SettingsIcon />}
              label={formatMessage({id: 'menu.settings'})}
              target='/settings' /> */}
            {/*<Item
              icon={<HelpIcon />}
              label={formatMessage({id: 'menu.help'})}
              target='/help' />*/}
            <Item
              icon={<AboutIcon />}
              label={formatMessage({id: 'menu.about'})}
              target='/about' />
            <Item
              icon={<LogoutIcon />}
              label={formatMessage({id: 'menu.logout'})}
              handleClick={this.props.logout} />
          </ul>
        </div>
      </div>
    );
  }
}

Sidebar.propTypes = {
  open: PropTypes.bool.isRequired,
  intl: intlShape.isRequired,
  user: PropTypes.object.isRequired,
  logout: PropTypes.func.isRequired
};

Sidebar.contextTypes = {
  router: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  user: state.user,
  building: state.building
});

export default connect(mapStateToProps, {logout})(withRouter(injectIntl(Sidebar)));
