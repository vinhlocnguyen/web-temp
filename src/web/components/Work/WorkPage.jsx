import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import {SmallWorkIcon, ProblemIcon} from '../UI/Icons';
import Switch from '../UI/Switch';
import TitleBar from '../UI/TitleBar';
import DatePickerView from '../UI/DatePickerView';
import RoutedBackButton from '../RoutedBackButton';
import ColorBackground from '../Backgrounds/ColorBackground';
import ColoredButton from '../UI/ColoredButton';
import {intlShape, injectIntl, FormattedMessage} from 'react-intl';
import moment from 'moment';
import { retrieveMeetingRoomBookings } from '../../../redux/actions/user';
import { retrieveBuilding, updateServiceInBuilding } from '../../../redux/actions/building';
import FeatureToggle from '../UI/FeatureToggle';
// for services
import PushButton from '../UI/PushButton';
import {
  ListViewIcon,
  MapViewIcon,
  SmallLiveIcon
} from '../UI/Icons';
import IconButton from '../UI/IconButton';
import Filter from '../Live/Filter';
import { filterServices } from '../../../redux/actions/service';
import { update as updateUser } from '../../../redux/actions/user';
import time from '../../../redux/helpers/time';
import { calculateServicesDistance } from '../../../redux/helpers/distance';
import clientStorage from '../../../redux/helpers/clientStorage';
import ServiceList from '../Service/ServiceList';
import styled from 'styled-components';
import { ContentContainer } from '../styleUlti';

const Wrapper = styled.div`
  overflow: auto;
  height: 100%;
`;

const NotificationWrapper = styled.div`
  height: 56px;
  font-family: Montserrat;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-direction: row;
  background-color: #ffffff;
  color: #6b6b6b;
  padding: 0 20px;
  font-size: 14;
  border-bottom: 1px solid #e6e6e6;
  border-top: 1px solid #e6e6e6;
`;
const HightlightNotification = styled.div`
  font-weight: bold;
  color: #2283bf;
`;
const NotificationNumber = styled.div`
  border-radius: 50%;
  background-color: #ff1944;
  color: #ffffff;
  width: 20px;
  height: 20px;
  text-align: center;
  line-height: 20px;
  font-size: 11;
`;
const reservationWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;
const MainContainer = styled.div`
  display: flex;
  font-family: Montserrat;
  flex-direction: row;
`;
const SortByText = styled.div`
  font-family: Montserrat;
  font-size: 15px;
  font-weight: 300;
  line-height: 1.1;
  color: #4a4a4a;
`;
const AllNearbyText = styled.div`
  font-family: Montserrat;
  font-size: 15px;
  line-height: 1.1;
  color: #0c78be;
`;
const FilterTools = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin: 14px;
  align-items: center;
`;
const ViewButtonWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;
const Line = styled.div`
  height: 32px;
  border: 1px solid #dcdcdc;
`

const styles = {
  filterButton: {
    width: '60px',
    height: '20px',
    borderRadius: '2px',
    backgroundColor: '#0c78be',
    fontSize: 15,
    lineHeight: '20px',
    padding: '5px'
  },
  viewButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 28,
    height: 28,
    padding: 2,
    border: '1px solid #dcdcdc'
  }
};

//--intend for server-render
const isBrowser = typeof window !== 'undefined';

class WorkPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      openFilter: false,
      workServices: [],
      pinnedServices: [],
      viewMode: isBrowser && ((clientStorage.getObject('user') && clientStorage.getObject('user').uiOptions.live.defaultView) || 'list'),
      isBlockedLocation: false,
    };

    this.handleFilterToggle = this.handleFilterToggle.bind(this);
    this.handleFilter = this.handleFilter.bind(this);
  }

  componentDidMount() {
    // retrieve building if it doesn't exist
		if (Object.keys(this.props.building.current).length === 0) {
			this.props.retrieveBuilding();
		}

    // for services
    calculateServicesDistance(this.props.building.current, this.props.user.info.isUseMyLocation).then(result => {
      const [workServices, pinnedServices] = this.getWorkServices(result.services, this.props.building.current.pinnedWorkServices);
      this.setState({
        workServices: workServices,
        pinnedServices: pinnedServices,
        isBlockedLocation: result.isBlockedLocation
      });
      this.props.updateServiceInBuilding(result.services);
    });
  }

  getWorkServices(services, pinnedList) {
    return services.reduce((result, svc) => {
      if (svc.isShowOnWork) {
        const pinnedSvc = pinnedList.find(psvc => psvc.service.toString() === svc.id.toString());
        if (pinnedSvc) {
          svc.order = pinnedSvc.order;
          return [result[0], [...result[1], svc]];
        } else {
          return [[...result[0], svc], result[1]];
        }
      } else {
        return result;
      }
    }, [[], []]);
  }

  handleFilterToggle() {
    this.setState({
      openFilter: !this.state.openFilter
    });
  }

  handleFilter(filters, openNow) {
    this.props.filterServices(filters, openNow);
  }

  filterServices(services) {
    if (services) {
      let filtered = services;

      // Remove show on work page from list
      filtered = filtered.filter(item => {
        return item.isShowOnWork;
      });

      // filter services by category
      const filters = this.props.service.filters;
      if (filters.length > 0) {
        filtered = filtered.filter(item => filters.indexOf(item.category.toLowerCase()) > -1);
      } else if (filters.length == 0) {
        filtered = this.props.service.isCheckedAll ? filtered : [];
      }

      // filter services that they open now
      if (this.props.service.openNow) {
        filtered = filtered.filter(item => {
          const start = item.openingHours.from;
          const end = item.openingHours.to;
          return time.nowIsInTime(start, end);
        });
      }
      return filtered;
    } else return [];
  }

  switchViewMode(mode) {
    this.setState({
      viewMode: mode
    });
    const uiOptions = this.props.user.info.uiOptions;
    uiOptions.live.defaultView = mode;
    this.props.updateUser({uiOptions});
  }

  render() {
    const {formatMessage} = this.props.intl;
    const hasMeetingRooms = this.props.building.current && this.props.building.current.hasMeetingRooms;
    const services = this.filterServices(this.state.workServices);
    const pinnedServices = this.filterServices(this.state.pinnedServices);

    return (
      <ColorBackground color='#eceff1'>
      <div className="full-height">
        <Filter
          open={this.state.openFilter}
          toggleFilter={this.handleFilterToggle}
          onFinish={this.handleFilter}
        >
          <TitleBar
            title={formatMessage({ id: 'workPage.title' })}
            icon={<SmallWorkIcon />}
            leftButton={<RoutedBackButton />} />
          <ContentContainer>
            <FilterTools>
              <FeatureToggle feature='feature_service_sorting'>
                <div>
                  <SortByText>Sort by:</SortByText>
                  <AllNearbyText>&nbsp;All nearby</AllNearbyText>
                </div>
              </FeatureToggle>
              <FeatureToggle feature='feature_switch_views'>
                <ViewButtonWrapper>
                  <IconButton style={{
                    ...styles.viewButton,
                    borderRight: 'none',
                    borderRadius: '4px 0 0 4px',
                    backgroundColor: this.state.viewMode === 'list' ? '#dcdcdc' : '#ffffff'
                  }} icon={<ListViewIcon />} onTouchTap={this.switchViewMode.bind(this, 'list')} />
                  <div style={styles.line} />
                  <IconButton style={{
                    ...styles.viewButton,
                    borderLeft: 'none',
                    borderRadius: '0 4px 4px 0',
                    backgroundColor: this.state.viewMode === 'map' ? '#dcdcdc' : '#ffffff'
                  }} icon={<MapViewIcon />} onTouchTap={this.switchViewMode.bind(this, 'map')} />
                </ViewButtonWrapper>
              </FeatureToggle>
              <PushButton style={styles.filterButton} label='filter' noMargin handleClick={this.handleFilterToggle} />
            </FilterTools>
            <ServiceList
              services={services}
              pinnedServices={pinnedServices}
              building={this.props.building}
              viewMode={this.state.viewMode}
              context={this.context} />  
            <div>
              {hasMeetingRooms &&
                <FeatureToggle feature='dummy_meeting_rooms'>
                  <ColoredButton
                    style={{ marginTop: hasMeetingRooms ? 2 : 10 }}
                    label={formatMessage({ id: 'workPage.list_meeting_room_button' })} noMargin
                    handleClick={() => this.context.router.history.push('/meeting-rooms')} />
                </FeatureToggle>
              }
              {hasMeetingRooms && <ColoredButton
                style={{ marginTop: hasMeetingRooms ? 2 : 10 }}
                label={formatMessage({ id: 'workPage.calendar_view_button' })} noMargin
                handleClick={() => this.context.router.history.push('/calendar')} />}

              {this.props.building.current.concierge && this.props.building.current.concierge.email && <ColoredButton
                style={{ marginTop: hasMeetingRooms ? 2 : 10 }}
                icon={<ProblemIcon />}
                label={formatMessage({ id: 'workPage.report_a_problem_button' })} noMargin
                handleClick={() => this.context.router.history.push('/report')} />
              }
            </div>
          </ContentContainer>
        </Filter>
      </div>
    </ColorBackground>
    );
  }
}

WorkPage.propTypes = {
  intl: intlShape.isRequired,
  user: PropTypes.object.isRequired,
  building: PropTypes.object.isRequired
};

WorkPage.contextTypes = {
  router: PropTypes.object.isRequired
};

WorkPage.fetchData = ({store}) => {
  const p1 = store.dispatch(retrieveMeetingRoomBookings());
  const p2 = store.dispatch(retrieveBuilding());
  return Promise.all([p1, p2]);
};

const mapStateToProps = state => ({
  user: state.user,
  building: state.building,
  service: state.service,
});

const mapDispatchToProps = {
  retrieveBuilding,
  filterServices,
  updateUser,
  updateServiceInBuilding
};

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(WorkPage));
