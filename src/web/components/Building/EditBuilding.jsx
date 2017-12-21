import PropTypes from 'prop-types';
import React, { Component } from 'react';
import {FormattedMessage, intlShape, injectIntl} from 'react-intl';
import { connect } from 'react-redux';
import ColorBackground from '../Backgrounds/ColorBackground';
import TitleBar from '../UI/TitleBar';
import CircularProgress from 'material-ui/CircularProgress';
import Snackbar from 'material-ui/Snackbar';
import RoutedBackButton from '../RoutedBackButton';
import {
  ListAutoComplete,
  ListEditImage,
  ListEditText,
  ListEditPhoneNumber,
  FloatingButton,
  Separator
} from '../UI/ListView';
import Checkbox from '../UI/Checkbox';
import {
  retrieveBuilding,
  editBuilding,
  findNearbyStops,
  countUsersInBuilidng,
  deleteBuilding,
  getBuildingById
} from '../../../redux/actions/building';
import timeHelper from '../../../redux/helpers/time';
import ErrorMessage from '../Features/ErrorMessage';
import { resetError } from '../../../redux/actions/error';
import { suggestAddress } from '../../../redux/actions/suggestion';
import AdminWrapper from '../UI/AdminWrapper';
import BuildingOwnerWrapper from '../UI/BuildingOwnerWrapper';
import BorderButton from '../UI/BorderButton';
import ColoredButton from '../UI/ColoredButton';
import DeleteButton from '../UI/DeleteButton';
import NearByStops from './NewBuildingPage/NearByStops';
import ReactCSSTransitionGroup from 'react-transition-group/CSSTransitionGroup';
import validation from '../../../redux/helpers/validation';
import FeatureToggle from '../UI/FeatureToggle';
import ConfirmMessage from '../Features/ConfirmMessage';
import clientStorage from '../../../redux/helpers/clientStorage';
import styled from 'styled-components';
import { media, FullHeightDiv, ContentContainer } from '../styleUlti';

const Wrapper = styled.div`
  height: calc(100% - 66px);
`;
const Container = ContentContainer.extend`
  position: relative;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
`;
const Main = styled.div`
  top: 0;
  left: 0;
  width: 100%;
`;
const ButtonWrapper = styled.div`
  width: 100%;
`;

const styles = {
  checkboxField: {
    margin: '10px 0px'
  },
  checkboxLabel: {
    color: '#22b1d7'
  }
};

export class EditBuilding extends Component {
  constructor(props) {
    super(props);
    let building = props.match.params.id ? props.building.selected : props.building.current;
    if (!building) {
      building = {};
    }
    const opening = building.openingHours && timeHelper.localeTimeFromDatetime(building.openingHours.from);
    const closing = building.openingHours && timeHelper.localeTimeFromDatetime(building.openingHours.to);
    this.state = {
      pageTitle: building.name,
      name: building.name,
      openingHour: opening,
      closingHour: closing,
      nearByStops: building.nearbyStops ? building.nearbyStops : [],
      region: building.region,
      stepIndex: 0,
      action: 'next',
      address: building.address && building.address.fullAddress,
      phone: building.concierge && building.concierge.phone,
      email: building.concierge && building.concierge.email,
      hasMeetingRooms: building.hasMeetingRooms,
      isActive: building.isActive,
      owner: undefined,
      banner: undefined,
      isWaiting: false,
      isShowNotification: false,
      error: null,
      isShowError: false,
      previousIndex: 0,
      isShowConfirmMsg: false,
      usersInBuildingCount: this.renderSpinner(),
      yesDisabled: true,
      isShowDeleteNotification: false
    };

    this.handleSave = this.handleSave.bind(this);
    this.renderInformation = this.renderInformation.bind(this);
    this.renderNearByStop = this.renderNearByStop.bind(this);
    this.onEditNearByStopClicked = this.onEditNearByStopClicked.bind(this);
    this.onEditMeetingRoomsClicked = this.onEditMeetingRoomsClicked.bind(this);
    this.onPreviousBtnClicked = this.onPreviousBtnClicked.bind(this);
    this.validateBuildingInfo = this.validateBuildingInfo.bind(this);
    this.handleDeleteBuilding = this.handleDeleteBuilding.bind(this);
    this.doFindNearbyStops = this.doFindNearbyStops.bind(this);
  }

  renderSpinner() {
    return (
      <CircularProgress size={20} thickness={1} />
    );
  }

  doFindNearbyStops(region, address, distance, cb) {
    this.setState({
      isWaiting: true
    });

    this.props.findNearbyStops(
      region,
      address,
      distance
    ).then(_ => {
      this.checkErrors();
      this.setState({
        isWaiting: false
      });
      cb && cb();
    });
  }

  componentDidMount() {
    if (Object.keys(this.props.building.current).length === 0) {
      this.props.retrieveBuilding();
    }

    if (this.props.match.params.id && Object.keys(this.props.building.selected) === 0) {
      this.props.getBuildingById(this.props.match.params.id);
    }
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

  onEditMeetingRoomsClicked() {
    const buildingId = this.props.match.params.id || this.props.building.current.id;
    this.context.router.history.push(`/edit-building/${buildingId}/meeting-rooms`);
  }

  onEditNearByStopClicked() {
    if (this.validateBuildingInfo()) {
      this.setState({
        previousIndex: this.state.stepIndex
      });
      const region = this.props.match.params.id ? this.props.building.selected : this.props.building.current.region;
      const address = this.state.address;
      this.setState({
        isWaiting: true
      });
      this.props.findNearbyStops(
        region,
        address
      ).then(_ => {
        this.checkErrors();
        this.setState({
          isWaiting: false,
          stepIndex: this.state.stepIndex + 1,
          action: 'next'
        });
      });
    }
  }

  onPreviousBtnClicked() {
    this.setState({
      stepIndex: this.state.stepIndex - 1,
      action: 'previous'
    });
  }

  handleChange(field, e) {
    switch (field) {
      case 'name':
        this.setState({
          name: e.target.value
        });
        return;
      case 'openingHour':
        this.setState({
          openingHour: e.target.value
        });
        return;
      case 'closingHour':
        this.setState({
          closingHour: e.target.value
        });
        return;
      case 'address':
        this.setState({
          address: e
        });
        return;
      case 'phone':
        this.setState({
          phone: e
        });
        return;
      case 'email':
        this.setState({
          email: e.target.value
        });
        return;
      case 'owner':
        this.setState({
          owner: e
        });
        return;
      case 'banner':
        this.setState({
          banner: e
        });
        return;
      case 'hasMeetingRooms':
        this.setState({
          hasMeetingRooms: e
        });
        return;
      case 'owner.remove':
        return this.setState({
          owner: ''
        });
      case 'nearByStops.remove':
        const removedStops = this.handleRemoveStop(e, this.state.nearByStops);
        return this.setState({nearByStops: removedStops});
      case 'nearByStops.add':
        const addedStops = this.state.nearByStops.concat(e);
        return this.setState({ nearByStops: addedStops });
      case 'activeBuilding':
        return this.setState({ isActive: e });  
    }
  }

  handleRemoveStop(e, stops) {
    if (e.stopType.toLowerCase() === 'taxi') {
      return this.state.nearByStops.filter(item => !(item.name === e.name && item.stopType === e.stopType));
    } else {
      return this.state.nearByStops.filter(item => !(item.stopType === e.stopType && e.coord[0] === item.coord[0] && e.coord[1] === item.coord[1]));
    }
  }

  validateBuildingInfo() {
    const validEmail = validation.email(this.state.email, true);
    const validAddress = validation.isRequired(this.state.address);

    this.setState({
      conciergeEmailError: validEmail.error
    });

    return (validEmail.valid && validAddress.valid);
  }

  handleSave() {
    if (this.validateBuildingInfo()) {
      const params = {
        name: this.state.name,
        address: this.state.address,
        openingHours: {
          from: this.state.openingHour,
          to: this.state.closingHour
        },
        concierge: {
          email: this.state.email,
          phone: this.state.phone
        },
        hasMeetingRooms: this.state.hasMeetingRooms,
        isActive: this.state.isActive,
        ownerImage: this.state.owner,
        image: this.state.banner,
        nearbyStops: this.state.nearByStops,
      };

      // save
      this.props.editBuilding(params, this.props.match.params.id).then(building => {
        this.checkErrors();
        let newState = {isWaiting: false};
        if (!this.props.error) {
          newState.isShowNotification = true;
        }
        this.setState(newState);
      });
      this.setState({
        isWaiting: true
      });
    }
  }

  handleSuggestAddress(value) {
    this.props.suggestAddress(value);
    this.handleChange('address', value);
  }

  btnDeleteBuildingClicked(id) {
    this.setState({
      isShowConfirmMsg: true
    });
    const buildingId = this.props.match.params.id ? this.props.building.selected.id : this.props.building.current.id;
    this.props.countUsersInBuilidng(buildingId)
      .then(res => {
        this.setState({
          yesDisabled: false,
          usersInBuildingCount: (<span style={res.response > 0 ? { color: 'red' } : { color: 'green' }}>{res.response}</span>)
        });
      });
  }

  handleDeleteBuilding() {
    const buildingId = this.props.match.params.id ? this.props.building.selected.id : this.props.building.current.id;
    this.props.deleteBuilding(buildingId)
      .then(res => {
        this.setState({
          isShowConfirmMsg: false,
          isShowDeleteNotification: true
        });
        // this.context.router.push('/select-building');
        window && clientStorage.removeItem('buildingId');
      });
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

  renderInformation(mainBanner, formatMessage, building) {
    return (
      <div>
        <ListEditImage
          title={formatMessage({id: 'buildingInfo.banner'})}
          image={mainBanner}
          onChange={this.handleChange.bind(this, 'banner')}
        />
        <ListEditText
          title={formatMessage({id: 'buildingInfo.name'})}
          value={this.state.name}
          onChange={this.handleChange.bind(this, 'name')}
        />
        <Separator />
        <ListEditText
          title={formatMessage({id: 'buildingInfo.openingHour'})}
          value={this.state.openingHour}
          onChange={this.handleChange.bind(this, 'openingHour')}
          />
        <Separator />
        <ListEditText
          title={formatMessage({id: 'buildingInfo.closingHour'})}
          value={this.state.closingHour}
          onChange={this.handleChange.bind(this, 'closingHour')}
        />
        <Separator />
        <ListAutoComplete
          title={formatMessage({id: 'buildingInfo.address'})}
          value={this.state.address}
          onChange={this.handleSuggestAddress.bind(this)}
          source={this.props.suggestion.addresses}
        />
        <Separator/>
        <AdminWrapper>
          <div>
            <ListEditPhoneNumber
              title={formatMessage({ id: 'buildingInfo.phone' })}
              value={this.state.phone}
              onChange={this.handleChange.bind(this, 'phone')}
            />
            <Separator />
            <ListEditText
              title={formatMessage({ id: 'buildingInfo.email' })}
              value={this.state.email}
              onChange={this.handleChange.bind(this, 'email')}
              errorText={this.state.conciergeEmailError}
            />
            <Separator />
          </div>
        </AdminWrapper>
        <Checkbox
          style={styles.checkboxField}
          labelStyle={styles.checkboxLabel}
          checked={this.state.hasMeetingRooms}
          onCheck={this.handleChange.bind(this, 'hasMeetingRooms')}
          label={formatMessage({ id: 'buildingInfo.hasMeetingRoom' })}
        />
        <AdminWrapper>
          <div>
            <Checkbox
              style={styles.checkboxField}
              labelStyle={styles.checkboxLabel}
              checked={this.state.isActive}
              onCheck={this.handleChange.bind(this, 'activeBuilding')}
              label={formatMessage({ id: 'buildingInfo.isActive' })}
            />
            <ListEditImage
              title={formatMessage({ id: 'buildingInfo.owner' })}
              image={building.ownerImage}
              onRemove={this.handleChange.bind(this, 'owner.remove')}
              onChange={this.handleChange.bind(this, 'owner')}
            />
          </div>
        </AdminWrapper>
      </div>
    )
  }

  renderNearByStop() {
    const { address, region } = this.state;
    const building = {address, region}
    return (
      <NearByStops
        address={this.state.address}
        region={this.state.region}
        nearByStops={this.state.nearByStops}
        onHandleChange={this.handleChange.bind(this)}
        doFindNearbyStops={this.doFindNearbyStops}
      />
    )
  }

  render () {
    const building = this.props.match.params.id ? this.props.building.selected : this.props.building.current;
    // banner
    const mainBanner = building.image && building.image.full;
    const { formatMessage } = this.props.intl;
    const buildingInfo = this.renderInformation(mainBanner, formatMessage, building);
    const nearByStops = this.renderNearByStop();
    const children = React.Children.toArray([buildingInfo, nearByStops]);
    const action = this.state.action || 'next';
    const confirmDeleteBuildingMsg = <FormattedMessage
    id='building.confirmDeleteMsg'
    values={{
      count: this.state.usersInBuildingCount
    }} />
    return (
      <BuildingOwnerWrapper>
        <ColorBackground color="#ffffff">
          <TitleBar
            title={this.state.pageTitle}
            leftButton={<RoutedBackButton/>}
          />
          <Wrapper className='page'>
            <Container>
              <Main>
                <ReactCSSTransitionGroup
                  transitionName={action === 'previous' ? 'reversePageSwap' : 'pageSwap'}
                  transitionEnterTimeout={500}
                  transitionLeaveTimeout={500}
                >
                  {children[this.state.stepIndex]}
                </ReactCSSTransitionGroup>
              </Main>
              <ButtonWrapper>
                {this.state.hasMeetingRooms && <FeatureToggle feature='dummy_meeting_rooms'>
                  <BorderButton
                    label={formatMessage({ id: 'button.editMeetingRooms' })}
                    visible={this.state.stepIndex == 0}
                    handleClick={this.onEditMeetingRoomsClicked} />
                </FeatureToggle>}
                <BorderButton
                  label={formatMessage({ id: 'button.editNearByStop' })}
                  visible={this.state.stepIndex == 0}
                  handleClick={this.onEditNearByStopClicked} />
                <BorderButton
                  label={formatMessage({ id: 'button.previous' })}
                  visible={this.state.stepIndex > 0}
                  handleClick={this.onPreviousBtnClicked} />
                <ColoredButton
                  label={formatMessage({ id: 'buildingInfo.submit' })}
                  handleClick={this.handleSave} />
                <AdminWrapper>
                  <DeleteButton
                    label={formatMessage({ id: 'button.deleteBuilding' })}
                    handleClick={this.btnDeleteBuildingClicked.bind(this)} />
                </AdminWrapper>
              </ButtonWrapper>
            </Container>
            {this.renderWaiting()}
            <Snackbar
              open={this.state.isShowNotification}
              message={formatMessage({id: 'buildingInfo.updatingSuccess'})}
              autoHideDuration={1000}
              onRequestClose={() => this.setState({ isShowNotification: false })}
            />
            <Snackbar
              open={this.state.isShowDeleteNotification}
              message={formatMessage({ id: 'buildingInfo.DeleteBuilingSuccess' })}
              autoHideDuration={1000}
              onRequestClose={() => this.setState({ isShowDeleteNotification: false })}
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
              message={confirmDeleteBuildingMsg}
              open={this.state.isShowConfirmMsg}
              noButton={formatMessage({ id: 'manageServices.confirmDeleteService.noButton' })}
              noButtonStyle={{color: 'grey'}}
              yesButton={formatMessage({ id: 'manageServices.confirmDeleteService.yesButton' })}
              yesButtonStyle={{ color: 'red' }}
              yesDisabled={this.state.yesDisabled}
              handleClose={() => {
                this.setState({
                  isShowConfirmMsg: false,
                  yesDisabled: true,
                  usersInBuildingCount: this.renderSpinner()
                });
              }}
              handleYesBtn={this.handleDeleteBuilding.bind(this, null)}
            />
          </Wrapper>
        </ColorBackground>
      </BuildingOwnerWrapper>
    );
  }
}

EditBuilding.propTypes = {
  intl: intlShape.isRequired,
  building: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
  suggestion: PropTypes.object.isRequired,
  error: PropTypes.object,
  retrieveBuilding: PropTypes.func,
  editBuilding: PropTypes.func,
  resetError: PropTypes.func,
  suggestAddress: PropTypes.func,
  params: PropTypes.object,
};

EditBuilding.contextTypes = {
  router: PropTypes.object
};

EditBuilding.fetchData = ({store, location, params, history}) => {
  const p1 = store.dispatch(getBuildingById(params.id));
  const p2 = store.dispatch(retrieveBuilding());
  return Promise.all([p1, p2]);
};

const mapStateToProps = state => ({
	building: state.building,
  user: state.user,
  error: state.error,
  suggestion: state.suggestion,
  meetingRoom: state.meetingRoom
});

const mapDispatchToProps = {
  retrieveBuilding,
  editBuilding,
  resetError,
  suggestAddress,
  findNearbyStops,
  countUsersInBuilidng,
  deleteBuilding,
  getBuildingById
};

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(EditBuilding));
