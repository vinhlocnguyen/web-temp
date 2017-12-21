import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { FormattedMessage, intlShape, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import {
  GenericItem
} from '../UI/ListView';
import {
  ListViewIcon,
  MapViewIcon,
  SmallLiveIcon
} from '../UI/Icons';
import IconButton from '../UI/IconButton';
import TitleBar from '../UI/TitleBar';
import RoutedBackButton from '../RoutedBackButton';
import PushButton from '../UI/PushButton';
// import MapView from '../UI/MapView';
import ColorBackground from '../Backgrounds/ColorBackground';
import Filter from './Filter';
import { filterServices } from '../../../redux/actions/service';
import { update as updateUser } from '../../../redux/actions/user';
import { retrieveBuilding, updateServiceInBuilding } from '../../../redux/actions/building';
import time from '../../../redux/helpers/time';
import { calculateServicesDistance } from '../../../redux/helpers/distance';
import FeatureToggle from '../UI/FeatureToggle';
import clientStorage from '../../../redux/helpers/clientStorage';
import ServiceList from '../Service/ServiceList';
import { media, ContentContainer } from '../styleUlti';
import styled from 'styled-components';

const SortByLabel = styled.span`
  font-family: Montserrat;
  font-size: 15px;
  font-weight: 300;
  line-height: 1.1;
  color: #4a4a4a;
`;
const AllNearbyLabel = styled.span`
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
`;

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

export class LivePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      openFilter: false,
      pinnedServices: [],
      liveServices: [],
      viewMode: isBrowser && ((clientStorage.getObject('user') && clientStorage.getObject('user').uiOptions.live.defaultView) || 'list'),
      isBlockedLocation: false,
    };
    this.handleFilterToggle = this.handleFilterToggle.bind(this);
    this.handleFilter = this.handleFilter.bind(this);
  }

  componentDidMount() {
    if (Object.keys(this.props.building.current).length === 0) {
      this.props.retrieveBuilding();
    }
    
    calculateServicesDistance(this.props.building.current, this.props.user.info.isUseMyLocation).then(result => {
      let [liveServices, pinnedServices] = this.getLiveServices(result.services, this.props.building.current.pinnedLiveServices);
      this.setState({
        liveServices: liveServices,
        pinnedServices: pinnedServices,
        isBlockedLocation: result.isBlockedLocation
      });
      this.props.updateServiceInBuilding(result.services);
    });
  }

  getLiveServices(services, pinnedList) {
    return services.reduce((result, svc) => {
      if (!svc.isShowOnWork) {
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

  filter(services) {
    if (services) {
      let filtered = services;

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
    const pinnedServices = this.filter(this.state.pinnedServices);
    const services = this.filter(this.state.liveServices);;
    const {formatMessage} = this.props.intl;
    return (
      <ColorBackground color='#eceff1'>
        <div className="full-height">
          <Filter
            open={this.state.openFilter}
            toggleFilter={this.handleFilterToggle}
            onFinish={this.handleFilter}
          >
            <TitleBar
              title={formatMessage({id: 'livePage.title'})}
              icon={<SmallLiveIcon/>}
              leftButton={<RoutedBackButton/>}
              errorMsg={this.state.isBlockedLocation ? formatMessage({id: 'warning.locationService'}) : null} />
            <ContentContainer>
              <FilterTools>
                <FeatureToggle feature='feature_service_sorting'>
                  <div>
                    <SortByLabel>Sort by:</SortByLabel>
                    <AllNearbyLabel>&nbsp;All nearby</AllNearbyLabel>
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
                    <Line />
                    <IconButton style={{
                      ...styles.viewButton,
                      borderLeft: 'none',
                      borderRadius: '0 4px 4px 0',
                      backgroundColor: this.state.viewMode === 'map' ? '#dcdcdc' : '#ffffff'
                    }} icon={<MapViewIcon />} onTouchTap={this.switchViewMode.bind(this, 'map')} />
                  </ViewButtonWrapper>
                </FeatureToggle>
                <PushButton style={styles.filterButton} label='filter' noMargin handleClick={this.handleFilterToggle}/>
              </FilterTools>
              <ServiceList
                services={services}
                pinnedServices={pinnedServices}
                building={this.props.building}
                viewMode={this.state.viewMode}
                context={this.context} />
            </ContentContainer>
          </Filter>
        </div>
      </ColorBackground>
    );
  }
}

LivePage.propTypes = {
  intl: intlShape.isRequired,
  building: PropTypes.object.isRequired,
  service: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
  retrieveBuilding: PropTypes.func.isRequired,
  filterServices: PropTypes.func.isRequired,
  updateUser: PropTypes.func.isRequired
};

LivePage.contextTypes = {
  router: PropTypes.object
};

LivePage.fetchData = ({store, location, params, history}) => {
  return store.dispatch(retrieveBuilding());
};

const mapStateToProps = state => ({
  building: state.building,
  service: state.service,
  user: state.user
});

const mapDispatchToProps = {
  retrieveBuilding,
  filterServices,
  updateUser,
  updateServiceInBuilding
};

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(LivePage));
