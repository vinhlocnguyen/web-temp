import PropTypes from 'prop-types';
import React, { Component } from 'react';
import RoutedBackButton from '../RoutedBackButton';
import { intlShape, injectIntl, FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import TitleBar from '../UI/TitleBar';
import ColorBackground from '../Backgrounds/ColorBackground';
import BorderButton from '../UI/BorderButton';
import BuildingOwnerWrapper from '../UI/BuildingOwnerWrapper'
import {
  ClockIcon,
  SmallCapacityIcon,
  SmallCateringIcon
} from '../UI/Icons';
import {
  ListViewImageWithText,
  GenericItem,
  Separator,
  ListViewItem,
  FloatingButton,
  Rating,
  ListEditDate,
  ListEditText
} from '../UI/ListView';
import { getMeetingRoom, bookMeetingRoom, resetError } from '../../../redux/actions/meetingRoom';
import { retrieveBuilding } from '../../../redux/actions/building';
import validation from '../../../redux/helpers/validation';
import FeatureToggle from '../UI/FeatureToggle';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import moment from 'moment';
import ErrorMessage from '../Features/ErrorMessage';
import timeHelper from '../../../redux/helpers/time';
import CircularProgress from 'material-ui/CircularProgress';
import Snackbar from 'material-ui/Snackbar';
import styled from 'styled-components';
import { media, ContentContainer } from '../styleUlti';

const ContactItem = styled.div`
  display: flex;
  margin: 5px 0 5px;
  align-items: center;
  cursor: pointer;
`;
const Catering = styled.span`
  font-family: Montserrat;
  font-size: 12px;
  font-weight: 300;
  line-height: 1.5;
  color: #4a4a4a;
  text-transform: capitalize;
`;
const Icon = styled.div`
  width: 24px;
  margin-right: 10px;
`;
const ReservationInfo = styled.div`
  font-size: 12px;
  color: #22b1d7;
  font-weight: 600;
  margin-bottom: 5px;
  cursor: auto;
`;
const EditButton = styled(Link)`
  text-decoration: none;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  margin: 0 14px;
`;
const RoomInfo = styled.div`
  color: white;
  position: absolute;
  bottom: 0px;
  padding: 5px 15px;
`;
const RoomName = styled.div`
  font-weight: bold;
  font-size: 16px;
  text-transform: capitalize;
`;
const RoomPosition = styled.p`
  font-size: 12px;
`;
const OpeningHour = styled.div`
  margin-left: 34px;
`;
const ClosingDays = styled.div`
  display: flex;
  margin: 5px 0 5px;
  align-items: center;
`;
const TextDecoration = styled.div`
  font-family: Montserrat;
  font-size: 14px;
  font-weight: 300;
  line-height: 1;
  color: #4a4a4a;
`;
const DailyScheduleWrapper = styled.div`
  display: flex;
  margin: 5px 0 5px;
  align-items: center;
  font-family: Montserrat;
  font-size: 14px;
  font-weight: 300,
  line-height: 1,
  color: #4a4a4a;
`;
const ScheduleTitle = styled.div`
  display: flex;
  margin: 5px 0 5px;
  align-items: center;
`;
const RoomInfoWrapper = styled.div`
  overflow: auto;
`

const styles = {
  ratingStar: {
    margin: '0px 2px'
  }
};

export class MeetingRoomInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpenBookingDialog: false,
      bookDate: new Date(),
      bookFromTime: '',
      bookToTime: '',
      isShowError: false,
      isWaiting: false,
      error: null,
      isShowNotification: false,
      errorMessage: ''
    }

    this.handleBookRoom = this.handleBookRoom.bind(this);
    this.handleCloseDialog = this.handleCloseDialog.bind(this);
    this.validateBookingInfo = this.validateBookingInfo.bind(this);
  }
  componentDidMount() {
    if (Object.keys(this.props.meetingRoom.selected).length === 0) {
      this.props.getMeetingRoom(this.props.match.params.id);
    }
    if (Object.keys(this.props.building.current).length === 0) {
      this.props.retrieveBuilding();
    }
  }

  validateBookingInfo(bookingInfo) {
    let newState = {};
    let validFromTime = validation.isRequired(this.state.bookFromTime);
    let validToTime = validation.isRequired(this.state.bookToTime);
    
    if (!(validFromTime.valid && validToTime.valid)) {
      this.setState({
        fromTimeError: validFromTime.error,
        toTimeError: validToTime.error
      });
      return false;
    }

    validFromTime = validation.openingTime(this.state.bookFromTime);
    validToTime = validation.openingTime(this.state.bookToTime);
    if (!(validFromTime && validToTime)) {
      this.setState({
        fromTimeError: validFromTime.error,
        toTimeError: validToTime.error
      });
      return false;
    }

    // Check if book date in the past
    const today = moment();
    const bookDate = moment(this.state.bookDate);
    if (today.isAfter(bookDate, 'day')) {
      this.setState({
        errorMessage: 'Book date should be in the future.',
        isShowError: true
      });
      return false;
    }

    const startDate = moment(this.state.bookFromTime, 'HH:mm');
    const endDate = moment(this.state.bookToTime,  'HH:mm');
    if (startDate.isAfter(endDate)) { // start > end
      this.setState({
        errorMessage: 'Start time should before end time.',
        isShowError: true
      });
      return false;
    }

    return true;
  }

  handleBookRoom() {
    if (!this.validateBookingInfo()) {
      return;
    }

    const buildingId = this.props.building.current.id;
    const meetingRoomId = this.props.meetingRoom.selected.id;
    const fromTime =  this.state.bookFromTime.trim().split(':');
    const endTime = this.state.bookToTime.trim().split(':');
    let startDate = moment(this.state.bookDate);
    let endDate = moment(this.state.bookDate);
    
    startDate.hour(fromTime[0]);
    startDate.minute(fromTime[1]);
    endDate.hour(endTime[0]);
    endDate.minute(endTime[1]);
    const params = {
      startDate: startDate,
      endDate: endDate
    }
    this.setState({
      isWaiting: true
    });
    this.props.bookMeetingRoom(buildingId, meetingRoomId, params)
      .then(() => {
        let newState = {};
        if (this.props.meetingRoom.error) {
          newState = {
            error: this.props.meetingRoom.error.status,
            errorMessage: this.props.meetingRoom.error.error,
            isShowError: true
          }
        } else {
          newState = {
            isOpenBookingDialog: false,
            isShowNotification: true
          }
        }
        newState.isWaiting = false;
        this.setState(newState);
      });
  }

  handleCloseDialog(){
    this.setState({
      isOpenBookingDialog: false,
      bookDate: new Date(),
      bookFromTime: '',
      bookToTime: ''
    });
  }

  renderSchedule(room, formatMessage) {
    if (room && room.schedule) {
      let scheduleType = ['daily', 'weekly', 'monthly'].filter(t => {
        return room.schedule[t]
      })[0];

      if (!scheduleType) {
        return null;
      }

      const schedule = room.schedule[scheduleType];
      switch(scheduleType) {
        case 'weekly':
          return this.renderWeeklySchedule(schedule, formatMessage);
          break;
        case 'monthly':
          return this.renderMonthlySchedule(schedule, formatMessage);
        default:
          return this.renderDailySchedule(schedule, formatMessage);
      }
    } else {
      return null;
    }
  }

  renderDailySchedule(schedule, formatMessage) {
    return (
      <DailyScheduleWrapper>
        <Icon><ClockIcon /></Icon>
        {formatMessage({ id: 'meetingRoomInfo.schedule.daily' })}
        {`
            ${timeHelper.convertToGMTFromTime(schedule.opening_hour).format('HH:mm')} - 
            ${timeHelper.convertToGMTFromTime(schedule.closing_hour).format('HH:mm')}
          `}
      </DailyScheduleWrapper>
    )
  }

  renderWeeklySchedule(schedule, formatMessage) {
    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const days = daysOfWeek.filter(d => {
      return schedule.days.indexOf(d) >= 0
    }).join(', ');

    return (
      <TextDecoration>
        <ScheduleTitle>
          <Icon><ClockIcon /></Icon>
          {formatMessage({ id: 'meetingRoomInfo.schedule.weekly' })}
          {days}
        </ScheduleTitle>
        <OpeningHour>
          {`
            ${timeHelper.convertToGMTFromTime(schedule.opening_hour).format('HH:mm')} - 
            ${timeHelper.convertToGMTFromTime(schedule.closing_hour).format('HH:mm')}
          `}
        </OpeningHour>
      </TextDecoration>
    )
  }

  renderMonthlySchedule(schedule, formatMessage) {
    const daysOfMonth = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24", "25", "26", "27", "28", "29", "30", "31"];
    const days = daysOfMonth.filter(d => {
      return schedule.days.indexOf(d) >= 0
    }).join(', ');

    return (
      <TextDecoration>
        <ScheduleTitle>
          <div style={styles.icon}><ClockIcon /></div>
          {formatMessage({ id: 'meetingRoomInfo.schedule.monthly' })}
          {days}
        </ScheduleTitle>
        <OpeningHour>
          {`
            ${timeHelper.convertToGMTFromTime(schedule.opening_hour).format('HH:mm')} - 
            ${timeHelper.convertToGMTFromTime(schedule.closing_hour).format('HH:mm')}
          `}
        </OpeningHour>
      </TextDecoration>
    )
  }

  renderClosingDays(closingDays, formatMessage) {
    return closingDays && closingDays.length ? (
      <ListViewItem
        style={{padding: 0, marginTop: 5}}
        title={formatMessage({ id: 'meetingRoomInfo.closingDays' })}
        content={
          <ClosingDays>
            {
              closingDays.map(d => {
                return moment(d).format('MM/DD/YYYY');
              }).join(', ')
            }
          </ClosingDays>
        }
      />
    ) : null;
  }

  renderWaiting() {
    return this.state.isWaiting ? (
      <div className='loading'>
        <CircularProgress size={60} />
      </div>
    ) : null;
  }

  render () {
    const {formatMessage} = this.props.intl;
    const room = this.props.meetingRoom.selected;
    const building = this.props.building.current;
    const dialogActions = [
      <FlatButton
        label={formatMessage({ id: 'button.cancel' })}
        labelStyle={styles.dialog}
        onTouchTap={this.handleCloseDialog}
        style={styles.button}
      />,
      <FlatButton
        label={formatMessage({ id: 'button.book' })}
        labelStyle={styles.dialog}
        primary
        onTouchTap={this.handleBookRoom}
        style={styles.button}
      />
    ];
    // edit button
    const EditButton = () => this.props.user.info.flatTurtleAdmin
    ? (
      <Link
        to={`/meeting-rooms/${room.id}/edit`}
        style={styles.editButton}
      >
        <FormattedMessage id='button.edit'/>
      </Link>
    ) : null;
    const schedule = this.renderSchedule(room, formatMessage);
    const closingDays = this.renderClosingDays(room.closing_days, formatMessage);
    return (
      <ColorBackground color='#ffffff'>
        <TitleBar
          title={room.name}
          leftButton={<RoutedBackButton />}
          rightButton={<BuildingOwnerWrapper>
            <EditButton
              to={`/meeting-rooms/${room.id}/edit`}>
              <FormattedMessage id='button.edit'/>
            </EditButton>
          </BuildingOwnerWrapper>} />
        <ContentContainer>
        <RoomInfoWrapper>
          {room.image && room.image.full && <ListViewImageWithText imageUrl={room.image.full} >
            <RoomInfo>
              <RoomName>{room.name}</RoomName>
              <div><Rating score={5} style={styles.ratingStar}/></div>
              <RoomPosition>{formatMessage({id: 'meetingRoomInfo.room'})} {room.room}, {formatMessage({id: 'meetingRoomInfo.floor'})} {room.floor}</RoomPosition>
            </RoomInfo>
          </ListViewImageWithText>}

          <GenericItem>
            {(!room.image || !room.image.full) && <div style={{
                color: '#4a4a4a',
                margin: '10px 0px'
              }}>
              <RoomName>{room.name}</RoomName>
              <div style={{margin: '5px 0px'}}><Rating score={5} style={styles.ratingStar}/></div>
              <RoomPosition>{formatMessage({id: 'meetingRoomInfo.room'})} {room.room}, {formatMessage({id: 'meetingRoomInfo.floor'})} {room.floor}</RoomPosition>
            </div>}

            <ContactItem>
              <span style={styles.reservationInfo}>{formatMessage({id: 'meetingRoomInfo.reservation_info'})}</span>
            </ContactItem>

            {schedule} 
            {closingDays}

            {room.isCateringIncluded && <ContactItem>
              <Icon><SmallCateringIcon /></Icon>
              <Catering>{formatMessage({id: 'meetingRoomInfo.catering_included'})}</Catering>
            </ContactItem>}

            {room.maxNbPersons && <ContactItem>
              <Icon><SmallCapacityIcon /></Icon>
              <Catering>{room.maxNbPersons}</Catering>
            </ContactItem>}
          </GenericItem>
          <Separator />
          {room.min_time_block && room.max_time_block && <div>
            <ListViewItem
              title='Duration min - max'
              content={[room.min_time_block, room.max_time_block].join(' - ')}
            />
            <Separator />
          </div>}
          <ListViewItem
            title='Description'
            content={room.description}
          />

          <FloatingButton
            label={formatMessage({id: 'meetingRoomInfo.book_button'})}
            onHandleClick={() => this.setState({isOpenBookingDialog: true})}
          />
          <Dialog
            actions={dialogActions}
            modal={false}
            open={this.state.isOpenBookingDialog}
            onRequestClose={this.handleCloseDialog}
          >
            <div style={styles.datetimeWrapper}>
              <ListEditDate
                title={formatMessage({id: 'meetingRoomInfo.dialog.date'})}
                value={this.state.bookDate}
                errorText={this.state.bookDateError}
                onChange={e => this.setState({bookDate: e})}
              />
              <ListEditText
                title={formatMessage({id: 'meetingRoomInfo.dialog.fromTime'})}
                value={this.state.bookFromTime}
                errorText={this.state.fromTimeError}
                onChange={e => this.setState({bookFromTime: e.target.value})}
              />
              <Separator />
              <ListEditText
                title={formatMessage({id: 'meetingRoomInfo.dialog.toTime'})}
                value={this.state.bookToTime}
                errorText={this.state.toTimeError}
                onChange={e => this.setState({bookToTime: e.target.value})}
              />
              <Separator />
            </div>
            {this.renderWaiting()}
          </Dialog>
          <ErrorMessage
            error={this.state.error}
            open={this.state.isShowError}
            message={this.state.errorMessage}
            handleClose={() => {
              this.props.resetError();
              this.setState({
                error: null,
                errorMessage: '',
                isShowError: false
              });
            }}
          />
          <Snackbar
            open={this.state.isShowNotification}
            message={formatMessage({ id: 'meetingRoomInfo.bookingSuccess' })}
            autoHideDuration={1000}
            onRequestClose={() => this.setState({ isShowNotification: false })}
          />
        </RoomInfoWrapper>
        </ContentContainer>
      </ColorBackground>
    );
  }
}

MeetingRoomInfo.propTypes = {
  intl: intlShape.isRequired,
  meetingRoom: PropTypes.object.isRequired,
  building: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired
};

MeetingRoomInfo.contextTypes = {
  router: PropTypes.object
};

MeetingRoomInfo.fetchData = ({store, location, params, history}) => {
  const p1 = store.dispatch(getMeetingRoom(params.id));
  const p2 = store.dispatch(retrieveBuilding());
  return Promise.all([p1, p2]);
};

const mapStateToProps = state => ({
  meetingRoom: state.meetingRoom,
  building: state.building,
  user: state.user,
  error: state.error
});

const mapDispatchToProps = {
  getMeetingRoom,
  retrieveBuilding,
  bookMeetingRoom,
  resetError
};

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(MeetingRoomInfo));
