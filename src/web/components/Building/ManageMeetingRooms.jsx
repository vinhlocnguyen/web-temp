import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { intlShape, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import ColorBackground from '../Backgrounds/ColorBackground';
import TitleBar from '../UI/TitleBar';
import RoutedBackButton from '../RoutedBackButton';
import {
  FloatingButton,
  ListViewItem,
  Separator
} from '../UI/ListView';
import SliderItem from '../UI/SliderItem';
import CircularProgress from 'material-ui/CircularProgress';
import ErrorMessage from '../Features/ErrorMessage';
import { resetError } from '../../../redux/actions/error';
import { retrieveBuilding, getBuildingById } from '../../../redux/actions/building';
import { getMeetingRooms, removeMeetingRoom, createMeetingRoom } from '../../../redux/actions/meetingRoom';
import BorderButton from '../UI/BorderButton';
import ColoredButton from '../UI/ColoredButton';
import RemoveButton from '../UI/ListView/RemoveButton';
import MeetingRoomItem from '../UI/MeetingRoomItem';
import validation from '../../../redux/helpers/validation';
import Snackbar from 'material-ui/Snackbar';
import moment from 'moment';
import BuildingOwnerWrapper from '../UI/BuildingOwnerWrapper';
import styled from 'styled-components';
import { media, ContentContainer, FullHeightDiv } from '../styleUlti';

const Wrapper = styled.div`
  overflow: auto;
`;
const Title = styled.div`
  color: #34b1d7;
  margin: 10px 20px 0;
  font-family: Montserrat;
  font-size: 16px;
`;
const ListWrapper = styled.div`
  background: #fff;
  margin: 10px 20px 20px;
  overflow: auto;
  max-height: 200px,
  min-height: 10px
`;
const RoomInfo = styled.div`
  background: #fff;
  margin: 10px 20px 20px;
`;

const styles = {
  separator: {
    borderBottom: '1px solid rgba(0, 0, 0, 0.12)'
  }
};

export class ManageMeetingRoomPage extends Component {
  constructor(props) {
    super(props);
    this.state = this.initEmptyRoom();
    this.state.rooms = props.meetingRoom.list[props.match.params.id];
    this.state.isShowAddRoomSuccess = false;
    this.state.isShowAddRoomError = false;
    this.state.isWaiting = false;
    this.state.error = null,
    this.state.isShowError = false,

    // binding functions
    this.addRoom = this.addRoom.bind(this);
    this.removeMeetingRoom = this.removeMeetingRoom.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  initEmptyRoom() {
    return {
      name: '',
      description: '',
      openingHour: '',
      closingHour: '',
      maxNbPersons: 2,
      isCateringIncluded: false,
      roomNumber: '',
      floor: '',
      price: '0',
      currency: '€',
      banner: undefined,
      thumbnail: undefined,
      scheduleType: 'daily',
      daysOfWeek: [],
      daysOfMonth: [],
      parent: 'none',
      overlap: '1',
      closingDays: [],
      maxTimeBlock: '',
      minTimeBlock: '',
      nameError: '',
      floorError: '',
      roomError: '',
      priceError: '',
      currencyError: '',
      openingHourError: '',
      closingHourError: ''
    }
  }

  componentDidMount() {
    if (Object.keys(this.props.building.current).length === 0) {
      this.props.retrieveBuilding();
    }

    if (this.props.match.params.id && Object.keys(this.props.building.selected) === 0) {
      this.props.getBuildingById(this.props.match.params.id);
    }

    const buildingId = this.props.match.params.id;
    if (buildingId && !this.props.meetingRoom.list[buildingId]) {
      this.props.getMeetingRooms(buildingId).then(rooms => {
        this.setState({
          rooms: this.props.meetingRoom.list[buildingId] || []
        });
      });
    }
  }

  handleChange(field, e) {
    switch (field) {
      case 'name':
        this.setState({ name: e });
        return;
      case 'description':
        return this.setState({ description: e });
      case 'floor':
        return this.setState({ 'floor': e });
      case 'roomNumber':
        return this.setState({ roomNumber: e });
      case 'maxNbPersons':
        return this.setState({ maxNbPersons: e });
      case 'isCateringIncluded':
        return this.setState({ isCateringIncluded: e });
      case 'price':
        return this.setState({ price: e });
      case 'currency':
        return this.setState({ currency: e });
      case 'overlap':
        return this.setState({ overlap: parseInt(e) });
      case 'minTimeBlock':
        return this.setState({ minTimeBlock: e });
      case 'maxTimeBlock':
        return this.setState({ maxTimeBlock: e });
      case 'banner':
        return this.setState({ banner: e });
      case 'banner.remove':
        return this.setState({ banner: '' });
      case 'thumbnail':
        return this.setState({ thumbnail: e });
      case 'thumbnail.remove':
        return this.setState({ thumbnail: '' });
      case 'schedule.type':
        return this.setState({ scheduleType: e });
      case 'daysOfWeek':
        return this.setState({ daysOfWeek: e });
      case 'daysOfMonth':
        return this.setState({ daysOfMonth: e });
      case 'openingHour':
        return this.setState({ openingHour: e });
      case 'closingHour':
        return this.setState({ closingHour: e });
      case 'closingDays':
        return this.setState({ closingDays: e });
      case 'parent':
        return this.setState({ parent: e });
      default: return;
    }
  }

  removeMeetingRoom(roomId) {
    this.setState({
      isWaiting: true
    });

    this.props.removeMeetingRoom(this.props.match.params.id, roomId)
      .then(() => {
        let newState = {isWaiting: false};
        if(this.props.error) {
          newState.error = this.props.error;
          newState.isShowError = true;
        }
        this.setState(newState);
      });
  }

  validateRoom() {
    const validRequiredName = validation.isRequired(this.state.name);
    const validName = validation.name(this.state.name);
    const validFloor = validation.isRequired(this.state.floor);
    const validRoom = validation.isRequired(this.state.roomNumber);
    const validPrice = validation.isRequired(this.state.price);
    const validCurrency = validation.isRequired(this.state.currency);
    const validRequiredOpeningHour = validation.isRequired(this.state.openingHour);
    const validOpeningHour = validation.openingTime(this.state.openingHour);
    const validRequiredClosingHour = validation.isRequired(this.state.closingHour);
    const validClosingHour = validation.openingTime(this.state.closingHour);

    this.setState({
      nameError: validRequiredName.error || validName.error,
      floorError: validFloor.error,
      roomError: validRoom.error,
      priceError: validPrice.error,
      currencyError: validCurrency.error,
      openingHourError: validRequiredOpeningHour.error || validOpeningHour.error,
      closingHourError: validRequiredClosingHour.error || validClosingHour.error
    });

    return (validRequiredName.valid && validName.valid && validFloor.valid && validRoom.valid && validPrice.valid
      && validCurrency.valid && validRequiredOpeningHour.valid && validOpeningHour.valid
      && validRequiredClosingHour.valid && validClosingHour.valid);
  }

  addRoom() {
    if (!this.validateRoom()) {
      this.setState({
        isShowAddRoomError: true
      });
      return;
    }

    const {
      name,
      description,
      price,
      currency,
      maxNbPersons,
      isCateringIncluded,
      floor,
      roomNumber,
      openingHour,
      closingHour,
      banner,
      thumbnail,
      scheduleType,
      daysOfWeek,
      daysOfMonth,
      overlap,
      closingDays,
      minTimeBlock,
      maxTimeBlock,
      parent
    } = this.state;
    const params = {
      name,
      description: description ? description: undefined,
      price: parseFloat(price || 0),
      currency,
      floor,
      room: roomNumber,
      isCateringIncluded,
      maxNbPersons,
      full: banner,
      thumbnail,
      closing_days: closingDays,
      overlap: parseInt(overlap || 1),
      min_time_block: minTimeBlock ? minTimeBlock : undefined,
      max_time_block: maxTimeBlock ? maxTimeBlock : undefined,
      parent_id: (parent && parent !== 'none') ? parent : undefined
    };

    switch (scheduleType) {
      case 'weekly':
        params.schedule = { weekly: { days: daysOfWeek } };
        break;
      case 'monthly':
        params.schedule = { monthly: { days: daysOfMonth } };
        break;
      default: params.schedule = { daily: {} };
    }
    params.schedule[scheduleType].opening_hour = moment(openingHour, 'HH:mm').utc().format('HH:mm');
    params.schedule[scheduleType].closing_hour = moment(closingHour, 'HH:mm').utc().format('HH:mm');
    params.building = this.props.match.params.id;

    // TODO: Call API to create new meeting room.
    this.setState({
      isWaiting: true
    });
    this.props.createMeetingRoom(this.props.match.params.id, params)
      .then(res => {
        let newState = {isWaiting: false};
        if (!this.props.error) {
          newState.isShowAddRoomSuccess = true
          newState = Object.assign(this.initEmptyRoom(), newState);
        } else {
          newState.isShowError = true;
          newState.error = this.props.err;
        }
        this.setState(newState);
      });
  }

  renderRoomList(rooms) {
    const formatMessage = this.props.intl.formatMessage;
    const roomItems = rooms && rooms.map((item, index) =>
      <ListViewItem
        key={index}
        title={item.name}
        content={item.room}
        style={styles.separator}
        button={<RemoveButton onHandleClick={() => this.removeMeetingRoom(item.id)} />}
      />
    );
    return (
      <div>
        <Title>Added Meeting rooms</Title>
        <div style={styles.list}>
          {roomItems}
        </div>
      </div>
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

  render() {
    const { formatMessage } = this.props.intl;
    const {
      name,
      nameError,
      description,
      price,
      priceError,
      currency,
      currencyError,
      maxNbPersons,
      isCateringIncluded,
      floor,
      floorError,
      roomNumber,
      roomError,
      openingHour,
      openingHourError,
      closingHour,
      closingHourError,
      banner,
      thumbnail,
      scheduleType,
      daysOfWeek,
      daysOfMonth,
      overlap,
      closingDays,
      minTimeBlock,
      maxTimeBlock,
      parent
    } = this.state;
    const room = {
      name: {
        value: name,
        error: nameError
      },
      description,
      price: {
        value: price,
        error: priceError
      },
      currency: {
        value: currency,
        error: currencyError
      },
      maxNbPersons,
      isCateringIncluded,
      floor: {
        value: floor,
        error: floorError
      },
      roomNumber: {
        value: roomNumber,
        error: roomError
      },
      openingHour: {
        value: openingHour,
        error: openingHourError
      },
      closingHour: {
        value: closingHour,
        error: closingHourError
      },
      banner,
      thumbnail,
      scheduleType,
      daysOfWeek,
      daysOfMonth,
      overlap,
      closingDays,
      minTimeBlock,
      maxTimeBlock,
      parent
    }
    return (
      <BuildingOwnerWrapper>
        <ColorBackground color="#eceff1">
            <Wrapper>
              <TitleBar
                title={formatMessage({ id: 'meetingRooms.list' })}
                leftButton={<RoutedBackButton />}
              />
              <ContentContainer>
                {this.renderRoomList(this.state.rooms)}
                <Title>{formatMessage({ id: 'meetingRooms.new' })}</Title>
                <RoomInfo>
                  <MeetingRoomItem
                    handleChange={this.handleChange}
                    room={room}
                    meetingRooms={this.state.rooms}
                  />
                </RoomInfo>

                <ColoredButton
                  label={formatMessage({ id: 'meetingRooms.button.add' })}
                  handleClick={this.addRoom}
                />
                <Snackbar
                  open={this.state.isShowAddRoomSuccess}
                  message={formatMessage({ id: 'meetingRooms.message.addSuccess' })}
                  autoHideDuration={1000}
                  onRequestClose={() => this.setState({ isShowAddRoomSuccess: false })}
                />
                <Snackbar
                  open={this.state.isShowAddRoomError}
                  message={formatMessage({ id: 'meetingRooms.message.addFailure' })}
                  autoHideDuration={2000}
                  contentStyle={{ color: 'red' }}
                  onRequestClose={() => this.setState({ isShowAddRoomError: false })}
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

                {this.renderWaiting()}
              </ContentContainer>
            </Wrapper>
        </ColorBackground>
      </BuildingOwnerWrapper>
    );
  }
}

ManageMeetingRoomPage.propTypes = {
  intl: intlShape.isRequired
};

ManageMeetingRoomPage.fetchData = ({ store, location, params, history }) => {
  const p1 = store.dispatch(getBuildingById(params.id));
  return Promise.all([p1]);
};

const mapDispatchToProps = {
  getMeetingRooms,
  createMeetingRoom,
  removeMeetingRoom,
  retrieveBuilding,
  resetError,
  getBuildingById
};

const mapStateToProps = state => ({
  building: state.building,
  user: state.user,
  error: state.error,
  meetingRoom: state.meetingRoom
});

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(ManageMeetingRoomPage));
