import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage, injectIntl, intlShape } from 'react-intl';
import { SortableContainer, SortableElement, arrayMove, SortableHandle } from 'react-sortable-hoc';
import BorderButton from '../UI/BorderButton';
import { listServices, deleteService, getBuildingByService } from '../../../redux/actions/service';
import { retrieveBuilding, editBuilding, removeService, addService, pinService, unpinService } from '../../../redux/actions/building';
import ColorBackground from '../Backgrounds/ColorBackground';
import TitleBar from '../UI/TitleBar';
import RoutedBackButton from '../RoutedBackButton';
require('../../assets/styles/form.scss');
import ListViewItem from '../UI/ListView/ListViewItem';
import RemoveButton from '../UI/ListView/RemoveButton';
import AddButton from '../UI/ListView/AddButton';
import { distanceFromLocation } from '../../../redux/helpers/distance';
import { SERVICE_RANGE } from '../../../../config';
import Checkbox from '../UI/Checkbox';
import Snackbar from 'material-ui/Snackbar';
import CircularProgress from 'material-ui/CircularProgress';
import ErrorMessage from '../Features/ErrorMessage';
import { resetError } from '../../../redux/actions/error';
import AdminWrapper from '../UI/AdminWrapper';
import BuildingOwnerWrapper from '../UI/BuildingOwnerWrapper';
import update from 'react-addons-update';
import ConfirmMessage from '../Features/ConfirmMessage';
import styled from 'styled-components';
import { media, ContentContainer, FullHeightDiv, TouchTapDiv } from '../styleUlti';

//--intend for server-render
const isBrowser = typeof window !== 'undefined';
const ManageServicePageWrapper = ContentContainer.extend`
  display: block;
`

const Title = styled.div`
  color: #34b1d7;
  margin: 10px 20px 0;
  font-family: Montserrat;
  font-size: 16px;
`;
const TabBar = styled.div`
  height: 50px;
  background-color: #ffffff;
  font-family: Montserrat;
  font-size: 15px;
  line-height: 1.1;
  text-align: center;
  box-shadow: 0 1px 0 0 rgba(0, 0, 0, 0.12);
  display: flex;
  flex-direction: row;
  text-transform: uppercase;
  margin-bottom: 10px;
`;
const StyledTab = styled(TouchTapDiv)`
  height: 100%;
  border: none;
  color: ${props => props.active ? '#0c78be' : '#9b9b9b'};
  box-sizing: ${props => props.active === 'true' ? 'border-box' : ''};
  border-bottom: ${props => props.active === 'true' ? '2px solid #0c78be' : ''};
  display: flex;
  justify-content: center;
  align-items: center;
  width: 50%;
  ${media.tablet`
    border: ${props=> props.active === 'true' ? '2px solid #0c78be' : ''}
  `}
`;
const Filter = styled.div`
  display: flex;
  align-items: center;
  margin: 0px 20px;
  color: #4A4A4A;
`;
const FilterInput = styled.input`
  width: 30px;
`;
const ActiveServices = styled.div`
  bakground: #ffffff;
  margin: 10px 20px 20px;
`;
const ListServices = styled.div`
  bakground: #ffffff;
  margin; 10px 20px 20px;
`;
const ServiceItem = styled.div`
  display: flex;
  flex-firection: row;
  align-items: center;
  padding: 0 10px;
  color: #17282D;
  border-bottom: 1px solid rgba(0, 0, 0, 0.12);
`;
const WrapperContent = styled.div`
  overflow: auto;
  height: calc(100% - 120px);
`;
const UnpinButton = styled(TouchTapDiv) `
  border: 1px solid;
  color: red;
  padding: 5px;
  margin: 17px 0px;
  cursor: pointer;
`;
const PinButton = styled(TouchTapDiv) `
  border: 1px solid;
  color: #0c78be;
  padding: 5px;
  margin: 17px 0px;
  cursor: pointer;
`;
const ButtonWrapper = styled.div`
  display: flex;
  flex-direction: row;
`;

const styles = {
  separator: {
    borderBottom: '1px solid rgba(0, 0, 0, 0.12)'
  },
  delSvcBtn: {
    marginTop: '-15px',
    width: '36px',
    height: '36px',
    cursor: 'pointer'
  }
};

const SortableItem = SortableElement(({ value }) =>
  <div>
    {value}
  </div>
);

export const SortableList = SortableContainer(({ items }) => {
  return (
    <div>
      {items.map((value, index) => (
        <SortableItem key={`item-${index}`} index={index} value={value} />
      ))}
    </div>
  );
});

export class ManageServicePage extends Component {
  constructor(props) {
    super(props);
    const pinnedServices = (props.building.current && props.building.current.pinnedLiveServices) || []
    this.state = {
      distanceFilter: SERVICE_RANGE,
      activeFilter: true,
      isShowNotification: false,
      error: null,
      isShowError: false,
      isWaiting: false,
      isShowConfirmMsg: false,
      serviceToBeRemoved: null,
      slideIndex: 0,
      pinnedList: pinnedServices
    };

    //bindings functions
    this.handleInputFilter = this.handleInputFilter.bind(this);
    this.handleActiveFilter = this.handleActiveFilter.bind(this);
    this.handleCreateService = this.handleCreateService.bind(this);
    this.onSortEnd = this.onSortEnd.bind(this);
    this.changePinnedServiceOrder = this.changePinnedServiceOrder.bind(this);
  }

  componentDidMount() {
    if (Object.keys(this.props.building.current).length === 0) {
      this.props.retrieveBuilding();
    }
    if (Object.keys(this.props.service.list).length === 0) {
      this.props.listServices();
    }
    this.setState({
      includedByBuildings: this.renderSpinner()
    });
  }

  renderSpinner() {
    return (
      <CircularProgress size={20} thickness={1} />
    )
  }

  componentWillReceiveProps(nextProps) {
    const pinnedList = this.state.slideIndex === 0
      ? nextProps.building.current.pinnedLiveServices
      : nextProps.building.current.pinnedWorkServices
    this.setState({
      pinnedList: pinnedList
    });
  }

  checkErrors() {
    // show error
    if (this.props.error) {
      this.setState({
        error: this.props.error.status,
        isShowError: true
      });
    }
  }

  handleCreateService(type) {
    this.context.router.history.push(`/create-service/${type}`);
  }

  addService(id) {
    this.props.addService(id).then(_ => {
      this.checkErrors();
    });
  }

  removeService(id) {
    this.props.removeService(id).then(_ => {
      this.checkErrors();
    });
  }

  btnPinServiceClicked(service, type) {
    const pinnedList = this.state.pinnedList;
    const params = {
      type: type,
      service: {
        service: service.id,
        order: pinnedList.length + 1
      }
    }

    this.props.pinService(params).then(_ => {
      this.checkErrors();
    });
  }

  btnUnpinServiceClicked(e, service, type) {
    e.preventDefault();
    const params = {
      type,
      serviceId: service.id
    }
    this.props.unpinService(params).then(_ => {
      this.checkErrors();
    });
  }

  btnDeleteServiceClicked(id) {
    this.setState({
      isShowConfirmMsg: true,
      serviceToBeRemoved: id
    });

    this.props.getBuildingByService(id)
      .then(res => {
        const buildingNames = res.response.map(b => {
          return b.name
        }).join(', ');
        this.setState({
          includedByBuildings: buildingNames
        });
      });
  }

  handleDeleteService() {
    this.props.deleteService(this.state.serviceToBeRemoved).then(_ => {
      this.checkErrors();
      this.setState({
        isShowConfirmMsg: false,
        includedByBuildings: this.renderSpinner()
      });
    });
  }

  handleActiveFilter(isChecked) {
    this.setState({
      activeFilter: isChecked
    });
  }

  handleInputFilter(e) {
    this.setState({
      distanceFilter: e.target.value
    });
  }

  selectTab(e, index) {
    e.preventDefault();
    let pinnedList = [];
    if (index === 0) {
      pinnedList = this.props.building.current.pinnedLiveServices || [];
    } else {
      pinnedList = this.props.building.current.pinnedWorkServices || [];
    }
    this.setState({ slideIndex: index, pinnedList: pinnedList });
  }

  getLiveServices(services) {
    const svcs = services;
    return svcs.filter(svc => {
      return !svc.isShowOnWork;
    });
  }

  getWorkServices(services) {
    const svcs = services;
    return svcs.filter(svc => {
      return svc.isShowOnWork;
    });
  }

  getPinnedService(services, type) {
    const svcs = services;
    const pinnedServices = type === 'live'
      ? this.props.building.current.pinnedLiveServices
      : this.props.building.current.pinnedWorkServices;
    const pinnedIds = pinnedServices.map(svc => svc.service.toString());
    return svcs.reduce((result, svc) => {
      let index = pinnedIds.indexOf(svc.id.toString());
      if (index >= 0) {
        svc.order = pinnedServices[index].order;
        result.push(svc);
      }
      return result;
    }, []);
  }

  onSortEnd = ({ oldIndex, newIndex }) => {
    const pinnedList = this.changePinnedServiceOrder(oldIndex + 1, newIndex + 1);
    this.setState({
      pinnedList: arrayMove(pinnedList, oldIndex, newIndex)
    });
    let params = {};
    if (this.state.slideIndex === 0) {
      params = { pinnedLiveServices: pinnedList };
    } else {
      params = { pinnedWorkServices: pinnedList }
    }
    this.props.editBuilding(params, this.props.building.current.id);
  }

  changePinnedServiceOrder(oldOrder, newOrder) {
    let pinnedServices = this.state.pinnedList;
    if (newOrder > oldOrder) {
      pinnedServices = pinnedServices.map(svc => {
        if (svc.order === oldOrder) {
          svc.order = newOrder;
        } else if (svc.order > oldOrder && svc.order <= newOrder) {
          svc.order--;
        }

        return svc;
      });
    } else if (newOrder < oldOrder) {
      pinnedServices = pinnedServices.map(svc => {
        if (svc.order === oldOrder) {
          svc.order = newOrder;
        } else if (svc.order < oldOrder && svc.order >= newOrder) {
          svc.order++;
        }
        return svc;
      });
    }

    return pinnedServices;
  }

  renderPinnedServices(type) {
    const buildingServices = this.props.building.current.services;
    const pinnedServices = type === 'live'
      ? this.props.building.current.pinnedLiveServices.map(svc => svc.service)
      : this.props.building.current.pinnedWorkServices.map(svc => svc.service);
    let services = type === 'live' ? this.getLiveServices(buildingServices) : this.getWorkServices(buildingServices);
    services = this.getPinnedService(services, type);
    services = services.sort((a, b) => {
      if (a.order > b.order) {
        return 1;
      }

      if (a.order < b.order) {
        return -1;
      }

      return 0;
    }).map((service, index) => (
      <ListViewItem
        key={index}
        title={service.name}
        content={service.address}
        style={styles.separator}
        button={
          <ButtonWrapper>
            <UnpinButton onTouchTap={e => this.btnUnpinServiceClicked(e, service, type)}>
              Unpin
            </UnpinButton>
            <RemoveButton onHandleClick={this.removeService.bind(this, service.id)} />
          </ButtonWrapper>
        }
      />
    ));
    return (<SortableList items={services} distance={10} onSortEnd={this.onSortEnd} />)
  }

  renderActiveServices(type) {
    const buildingServices = this.props.building.current.services;
    const pinnedServices = type === 'live'
      ? this.props.building.current.pinnedLiveServices.map(svc => svc.service)
      : this.props.building.current.pinnedWorkServices.map(svc => svc.service);
    const activeServices = buildingServices.filter(svc => {
      return pinnedServices.indexOf(svc.id) < 0
    });
    const services = type === 'live' ? this.getLiveServices(activeServices) : this.getWorkServices(activeServices);
    return services && services.map((service, index) => (
      <ListViewItem
        key={index}
        title={service.name}
        content={service.address}
        style={styles.separator}
        button={
          <ButtonWrapper>
            <PinButton onTouchTap={e => this.btnPinServiceClicked(service, type)}>
              Pin
            </PinButton>
            <RemoveButton onHandleClick={this.removeService.bind(this, service.id)} />
          </ButtonWrapper>
        }
      >
      </ListViewItem>
    ));
  }

  renderSuggestion(type) {
    let suggestion = this.props.service.list;
    const building = this.props.building.current;
    // get services not in current building services list
    if (building.services) {
      const ids = building.services.map(item => item.id);
      suggestion = suggestion.filter(item => !ids.includes(item.id));
    }
    suggestion = type === 'live' ? this.getLiveServices(suggestion) : this.getWorkServices(suggestion);
    // get services nearby (default 1km range)
    if (this.state.activeFilter && building.geolocation) {
      const isInRange = (buildingLoc, serviceLoc) => {
        if (!serviceLoc || !serviceLoc.length) {
          return true;
        }
        const coord1 = {
          lon: buildingLoc[0],
          lat: buildingLoc[1]
        };
        const coord2 = {
          lon: serviceLoc[0],
          lat: serviceLoc[1]
        };
        return distanceFromLocation(coord1, coord2) < (this.state.distanceFilter * 1000);
      };
      suggestion = suggestion.filter(item => isInRange(building.geolocation, item.geolocation));
    }
    // render suggestion
    return suggestion.map((service, index) =>
      <ListViewItem
        key={index}
        title={service.name}
        content={service.address}
        style={styles.separator}
        button={<AddButton onHandleClick={this.addService.bind(this, service.id)} />}
        buttonRemove={<AdminWrapper><RemoveButton style={styles.delSvcBtn} onHandleClick={this.btnDeleteServiceClicked.bind(this, service.id)} /></AdminWrapper>}
      />
    );
  }

  renderWaiting() {
    return this.state.isWaiting
      ? (
        <div className='loading'>
          <CircularProgress size={60} />
        </div>
      )
      : null;
  }

  renderLiveServices(formatMessage) {
    const pinnedServices = this.renderPinnedServices('live');
    const activeServices = this.renderActiveServices('live');
    const suggestServices = this.renderSuggestion('live');
    return (
      <WrapperContent>
        <Title>
          {formatMessage({ id: 'manageServices.currentServices' })}
        </Title>
        <ActiveServices>
          {pinnedServices}
        </ActiveServices>
        <ActiveServices>
          {activeServices}
        </ActiveServices>
        <div style={styles.suggestServices}>
          <Title>
            {formatMessage({ id: 'manageServices.chooseService' })}
          </Title>
          <Filter>
            <Checkbox
              checked={this.state.activeFilter}
              onCheck={this.handleActiveFilter}
              label={<FormattedMessage
                id='manageServices.distanceFilter'
                values={{
                  input: <input value={this.state.distanceFilter} onChange={this.handleInputFilter} style={styles.inputFilter} />
                }}
              />}
              labelStyle={{ color: '#666' }}
            />
          </Filter>
          <div style={styles.listServices}>
            {suggestServices}
          </div>
        </div>
        <BorderButton
          label={formatMessage({ id: 'button.createService' })}
          handleClick={() => this.handleCreateService('live')}
        />
      </WrapperContent>
    )
  }

  renderWorkServices(formatMessage) {
    const pinnedServices = this.renderPinnedServices('work');
    const activeServices = this.renderActiveServices('work');
    const suggestServices = this.renderSuggestion('work');
    return (
      <WrapperContent>
        <Title>
          {formatMessage({ id: 'manageServices.currentServices' })}
        </Title>
        <div style={styles.activeServices}>
          {pinnedServices}
        </div>
        <div style={styles.activeServices}>
          {activeServices}
        </div>
        <div style={styles.suggestServices}>
          <Title>
            {formatMessage({ id: 'manageServices.chooseService' })}
          </Title>
          <div style={styles.filter}>
            <Checkbox
              checked={this.state.activeFilter}
              onCheck={this.handleActiveFilter}
              label={<FormattedMessage
                id='manageServices.distanceFilter'
                values={{
                  input: <input value={this.state.distanceFilter} onChange={this.handleInputFilter} style={styles.inputFilter} />
                }}
              />}
              labelStyle={{ color: '#666' }}
            />
          </div>
          <ListServices>
            {suggestServices}
          </ListServices>
        </div>
        <BorderButton
          label={formatMessage({ id: 'button.createService' })}
          handleClick={() => this.handleCreateService('work')}
        />
      </WrapperContent>
    )
  }

  render() {
    const { formatMessage } = this.props.intl;
    const activeServices = this.renderActiveServices();
    const suggestServices = this.renderSuggestion();
    const confirmDeleteServiceMsg = <FormattedMessage
      id='manageServices.confirmDeleteService'
      values={{
        buildingList: this.state.includedByBuildings
      }}
    />
    return (
      <BuildingOwnerWrapper>
        <ColorBackground color='#eceff1'>
          <TitleBar
            title={formatMessage({ id: 'manageServices.title' })}
            leftButton={<RoutedBackButton />} />
          <ManageServicePageWrapper>
            <TabBar>
              <StyledTab active={`${this.state.slideIndex === 0}`}
                onTouchTap={(e) => { this.selectTab(e, 0); }}>
                <FormattedMessage id='manageServices.liveTab' />
              </StyledTab>
              <StyledTab active={`${this.state.slideIndex === 1}`}
                onTouchTap={(e) => { this.selectTab(e, 1); }}>
                <FormattedMessage id='manageServices.workTab' />
              </StyledTab>
            </TabBar>
            {this.state.slideIndex === 0 && this.renderLiveServices(formatMessage)}
            {this.state.slideIndex === 1 && this.renderWorkServices(formatMessage)}
            {this.renderWaiting()}
            <Snackbar
              open={this.state.isShowNotification}
              message={formatMessage({ id: 'manageServices.creationSuccess' })}
              autoHideDuration={2000}
              onRequestClose={() => this.setState({ isShowNotification: false })}
            />
            <ErrorMessage
              error={this.state.error}
              open={this.state.isShowError}
              handleClose={() => {
                this.props.resetError();
                this.setState({
                  error: null,
                  isShowError: false
                });
              }}
            />
            <ConfirmMessage
              message={confirmDeleteServiceMsg}
              open={this.state.isShowConfirmMsg}
              noButton={formatMessage({ id: 'manageServices.confirmDeleteService.noButton' })}
              noButtonStyle={{ color: 'grey' }}
              yesButton={formatMessage({ id: 'manageServices.confirmDeleteService.yesButton' })}
              yesButtonStyle={{ color: 'red' }}
              handleClose={() => {
                this.setState({
                  isShowConfirmMsg: false,
                  serviceToBeRemoved: null,
                  includedByBuildings: this.renderSpinner()
                });
              }}
              handleYesBtn={this.handleDeleteService.bind(this, null)}
            />
          </ManageServicePageWrapper>
        </ColorBackground>
      </BuildingOwnerWrapper>
    );
  }
}

ManageServicePage.propTypes = {
  intl: intlShape.isRequired,
  building: PropTypes.object.isRequired,
  service: PropTypes.object.isRequired,
  error: PropTypes.object,
  createService: PropTypes.func,
  listServices: PropTypes.func,
  retrieveBuilding: PropTypes.func,
  removeService: PropTypes.func,
  addService: PropTypes.func
};

ManageServicePage.fetchData = ({ store }) => {
  const p1 = store.dispatch(retrieveBuilding());
  const p2 = store.dispatch(listServices());
  return Promise.all([p1, p2]);
};

ManageServicePage.contextTypes = {
  router: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  service: state.service,
  building: state.building,
  error: state.error
});

const mapDispatchToProps = {
  listServices,
  retrieveBuilding,
  editBuilding,
  removeService,
  addService,
  pinService,
  unpinService,
  resetError,
  deleteService,
  getBuildingByService
};

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(ManageServicePage));
