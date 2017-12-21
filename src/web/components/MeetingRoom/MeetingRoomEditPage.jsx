import PropTypes from 'prop-types';
import React, { Component } from 'react';
import {intlShape, injectIntl} from 'react-intl';
import { connect } from 'react-redux';
import ColorBackground from '../Backgrounds/ColorBackground';
import TitleBar from '../UI/TitleBar';
import RoutedBackButton from '../RoutedBackButton';
import update from 'react-addons-update';
import {
  FloatingButton,
  Separator
} from '../UI/ListView';
import SliderItem from '../UI/SliderItem';
import Snackbar from 'material-ui/Snackbar';
import Chip from 'material-ui/Chip';
import CircularProgress from 'material-ui/CircularProgress';
import ErrorMessage from '../Features/ErrorMessage';
import { resetError } from '../../../redux/actions/error';
import { editMeetingRoom, getMeetingRoom, getMeetingRooms } from '../../../redux/actions/meetingRoom';
import { retrieveBuilding } from '../../../redux/actions/building';
import AdminWrapper from '../UI/AdminWrapper';
import MeetingRoomItem from '../UI/MeetingRoomItem';
import moment from 'moment';
import clientStorage from '../../../redux/helpers/clientStorage';
import timeHelper from '../../../redux/helpers/time';
import BuildingOwnerWrapper from '../UI/BuildingOwnerWrapper';
import styled from 'styled-components';
import { media, ContentContainer, FullHeightDiv } from '../styleUlti';

const Wrapper = styled.div`
  height: calc(100% - 60px);
  overflow: auto;
`;

const styles = {
  wrapper: {
    height: 'calc(100% - 60px)',
    overflow: 'auto'
  }
};

export class MeetingRoomEditPage extends Component {
  constructor(props) {
    super(props);
    const room = props.meetingRoom.selected ? props.meetingRoom.selected : {};

    const roomState = this.initStateFromRoom(room);
    this.state = {
      error: null,
      isShowError: false,
      isShowNotification: false,
      isWaiting: false,
    };
    this.state = Object.assign(this.state, roomState);

    // binding functions
    this.handleSave = this.handleSave.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    if (Object.keys(this.props.meetingRoom.selected).length === 0) {
      this.props.getMeetingRoom(this.props.match.params.id, this.props.building.current.id).then(res => {
        const roomState = this.initStateFromRoom(res.response);
        this.setState(roomState);
      });
    }

    if (Object.keys(this.props.building.current).length === 0) {
      this.props.retrieveBuilding();
    }

    if (Object.keys(this.props.meetingRoom.list).length === 0) {
      this.props.getMeetingRooms(this.props.building.current.id || clientStorage.getItem('buildingId'));
    }
  }

  initStateFromRoom(room) {
    let scheduleType = {};
    for (let p in room.schedule) {
      if (room.schedule.hasOwnProperty(p)) {
        scheduleType = {
          type: p,
          days: room.schedule[p].days,
          openingHour: room.schedule[p].opening_hour,
          closingHour: room.schedule[p].closing_hour
        }
        break;
      }
    }
    return {
      title: room.name ? room.name : '',
      name: room.name ? room.name : '',
      description: room.description ? room.description : '',
      openingHour: scheduleType.openingHour ? timeHelper.convertToGMTFromTime(scheduleType.openingHour).format('HH:mm') : '',
      closingHour: scheduleType.closingHour ? timeHelper.convertToGMTFromTime(scheduleType.closingHour).format('HH:mm') : '',
      maxNbPersons: room.maxNbPersons ? room.maxNbPersons : 2,
      isCateringIncluded: room.isCateringIncluded,
      roomNumber: room.room ? room.room : '',
      floor: room.floor ? room.floor : '',
      price: room.price || '0',
      currency: room.currency || '',
      banner: (room.image && room.image.full) ? room.image.full : '',
      thumbnail: (room.image && room.image.thumbnail) ? room.image.thumbnail : '',
      scheduleType: scheduleType.type || 'daily',
      daysOfWeek: scheduleType.days || [],
      daysOfMonth: scheduleType.days || [],
      parent: room.parent_id ? room.parent_id : 'none',
      overlap: room.overlap ? room.overlap.toString() : '1',
      closingDays: room.closing_days || [],
      maxTimeBlock: room.max_time_block || '',
      minTimeBlock: room.min_time_block || '',
      nameError: '',
      floorError: '',
      roomError: '',
      priceError: '',
      currencyError: '',
      openingHourError: '',
      closingHourError: ''

    };
  }

  checkErrors() {
    if (this.props.error) {
			this.setState({
				error: this.props.error.status,
				isShowError: true,
        isWaiting: false
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
        return this.setState({ isCateringIncluded: e});
      case 'price':
        return this.setState({ price: e });
      case 'currency':
        return this.setState({ currency: e });
      case 'overlap':
        return this.setState({ overlap: parseInt(e) });
      case 'minTimeBlock':
        return this.setState({minTimeBlock: e });
      case 'maxTimeBlock':
        return this.setState({ maxTimeBlock: e});
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

  handleSave() {
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
    const originRoom = this.props.meetingRoom.selected;
    const params = {
      name: name,
      description: description,
      price: parseFloat(price || 0),
      currency,
      floor,
      room: roomNumber,
      isCateringIncluded,
      maxNbPersons,
      full: banner,
      thumbnail,
      closing_days: closingDays && closingDays !== originRoom.closing_days ? closingDays : undefined,
      overlap: parseInt(overlap) !== originRoom.overlap ? parseInt(overlap || 1) : undefined,
      min_time_block: minTimeBlock && minTimeBlock !== originRoom.min_time_block ? minTimeBlock : undefined,
      max_time_block: maxTimeBlock && maxTimeBlock !== originRoom.max_time_block ? maxTimeBlock : undefined,
      parent_id: (parent && parent !== 'none' && parent !== originRoom.parent_id) ? parent : undefined
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

    if (JSON.stringify(params.schedule) === JSON.stringify(originRoom.schedule)) {
      delete params.schedule;
    }

    if (this.props.meetingRoom.selected.image && this.props.meetingRoom.selected.image.full === banner) {
      params.full = undefined;
    }

    if (this.props.meetingRoom.selected.image && this.props.meetingRoom.selected.image.thumbnail === thumbnail) {
      params.thumbnail = undefined;
    }

    this.setState({
      isWaiting: true
    });
    this.props.editMeetingRoom(this.props.building.current.id, this.props.match.params.id, params).then(_ => {
      this.checkErrors();
      let newState = {isWaiting: false};
      if (!this.props.error) {
        newState.isShowNotification = true;
      }
      this.setState(newState);
    });
  }

  renderWaiting() {
    return this.state.isWaiting ? (
      <div className='loading'>
        <CircularProgress size={60} />
      </div>
    ) : null;
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
    let meetingRooms = [];
    if (this.props.building.current && this.props.building.current.id) {
      meetingRooms = this.props.meetingRoom.list[this.props.building.current.id] || [];
    }
    return (
      <BuildingOwnerWrapper>
        <ColorBackground color='#ffffff'>
          <FullHeightDiv>
            <TitleBar
              title={this.state.title}
              leftButton={<RoutedBackButton />} />
            <Separator />
            {/* formatMessage({id: 'service.edit.name'}) */}
            <ContentContainer>
              <Wrapper>
                <MeetingRoomItem
                  handleChange={this.handleChange}
                  room={room}
                  meetingRooms={meetingRooms}
                />
                <Separator />
                <FloatingButton
                  label={formatMessage({ id: 'button.save' })}
                  onHandleClick={this.handleSave} />
                {this.renderWaiting()}
                <Snackbar
                  open={this.state.isShowNotification}
                  message={formatMessage({ id: 'service.edit.updatingSuccess' })}
                  autoHideDuration={1000}
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
              </Wrapper>
            </ContentContainer>
          </FullHeightDiv>
        </ColorBackground>
      </BuildingOwnerWrapper>
    );
  }
}

MeetingRoomEditPage.fetchData = ({store, location, params, history}) => {
  const p1 = store.dispatch(retrieveBuilding());
  const p2 = store.dispatch(getMeetingRooms(clientStorage.getItem('buildingId')));
  const p3 = store.dispatch(getMeetingRoom(params.id, clientStorage.getItem('buildingId')));
  return Promise.all([p1, p2, p3]);
};

MeetingRoomEditPage.propTypes = {
  intl: intlShape.isRequired,
  meetingRoom: PropTypes.object.isRequired,
  params: PropTypes.object,
  building: PropTypes.object.isRequired,
  error: PropTypes.object,
  getMeetingRoom: PropTypes.func.isRequired,
  editMeetingRoom: PropTypes.func.isRequired,
  resetError: PropTypes.func.isRequired,
  retrieveBuilding: PropTypes.func.isRequired
};

const mapDispatchToProps = {
  resetError,
  editMeetingRoom,
  getMeetingRoom,
  getMeetingRooms,
  retrieveBuilding
};

const mapStateToProps = state => ({
  meetingRoom: state.meetingRoom,
  building: state.building,
  error: state.error
});

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(MeetingRoomEditPage));
