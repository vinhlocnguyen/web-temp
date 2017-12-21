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

const styles = {
  wrapper: {
    overflow: 'auto',
    height: '100%'
  },
  notificationWrapper: {
    height: '56px',
    fontFamily: 'Montserrat',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    color: '#6b6b6b',
    padding: '0 20px',
    fontSize: 14,
    borderBottom: '1px solid #e6e6e6',
    borderTop: '1px solid #e6e6e6'
  },
  highlightNotification: {
    fontWeight: 'bold',
    color: '#2283bf'
  },
  notificationNumber: {
    borderRadius: '50%',
    backgroundColor: '#ff1944',
    color: '#ffffff',
    width: 20,
    height: 20,
    textAlign: 'center',
    lineHeight: '20px',
    fontSize: 11
  },
  reservationWrapper: {
    display: 'flex',
    flexDirection: 'column'
  },
  mainContainer: {
    display: 'flex',
    fontFamily: 'Montserrat',
    flexDirection: 'row'
    // marginBottom: 5
  },
  scheduleWrapper: {
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column'
  },
  scheduleItem: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    width: 90,
    // height: 90,
    backgroundColor: '#ffffff',
    color: '#4d4d4d',
    marginBottom: '1px',
    fontSize: 14,
    padding: '15px 0'
  },
  scheduleSelected: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    width: 90,
    // height: 90,
    backgroundColor: '#0d79bd',
    color: '#ffffff',
    marginBottom: '1px',
    fontSize: 14,
    padding: '15px 0'
  },
  meetingWrapper: {
    flexGrow: 4,
    display: 'flex',
    flexDirection: 'column',
    padding: 7
  },
  meetingCard: {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    boxShadow: '0px 4px 8px -2px rgba(0,0,0,0.25)',
    marginBottom: 15,
    padding: 10
  },
  meetingThumb: {
    width: '25%',
    height: 80,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10
  },
  meetingContent: {
    flexGrow: 3
  },
  meetingTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4f4f4f',
    lineHeight: '30px'
  },
  meetingRoom: {
    fontSize: 14,
    color: '#97d4e8',
    lineHeight: '20px'
  },
  meetingTime: {
    fontSize: 14,
    color: '#666666',
    lineHeight: '20px'
  },
  timeStyle: {
    fontSize: '16px',
    textAlign: 'center',
    lineHeight: 1,
    padding: 5
  }
};

//--intend for server-render
const isBrowser = typeof window !== 'undefined';

class CalendarPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedDate: moment(),
      meetings: []
    };
  }

  componentDidMount() {
    // retrieve building if it doesn't exist
		if (Object.keys(this.props.building.current).length === 0) {
			this.props.retrieveBuilding();
		}
    if (!this.props.user.bookings) {
      this.props.retrieveMeetingRoomBookings();
    }
    this.filterMeetings(moment());
  }

  filterMeetings(date) {
    if (this.props.user.bookings) {
      const list = this.props.user.bookings.filter(meeting => {
        return date.isSame(meeting.startDate, 'year') &&
              date.isSame(meeting.startDate, 'month') &&
              date.isSame(meeting.startDate, 'day');
      });
      this.setState({
        selectedDate: date,
        meetings: list
      });
    }
  }

  calculateMeetingsSoon() {
    if (this.props.user.bookings) {
      return this.props.user.bookings.filter(meeting => {
        return moment().isBetween(moment(meeting.startDate).subtract(2, 'hour'), meeting.startDate);
      }).length;
    }
    return 0;
  }

  renderMeetings(meetings) {
    return meetings.map((meeting, index) => {
      const endTime = new Date(meeting.endDate);
      return (
        <div key={index} style={styles.meetingCard}>
          <div style={styles.meetingThumb}>
            <img src={require('../../assets/images/demo-meeting-room-2.jpg')} style={{maxWidth: '100%'}} />
          </div>
          <div style={styles.meetingContent}>
            <div style={styles.meetingTitle}>{meeting.meetingTitle}</div>
            <div style={styles.meetingRoom}>Room {meeting.meetingRoom.room} - floor {meeting.meetingRoom.floor}</div>
            <div style={styles.meetingTime}>Until: {endTime.getHours()}</div>
            <div>icon</div>
          </div>
        </div>
      );
    });
  }

  render() {
    const {formatMessage} = this.props.intl;
    const meetings = this.renderMeetings(this.state.meetings);
    const notifications = this.calculateMeetingsSoon();
    const hasMeetingRooms = this.props.building.current && this.props.building.current.hasMeetingRooms;

    return (
      <ColorBackground color='#eceff1'>
      <div className="full-height">
          <TitleBar
            title={formatMessage({ id: 'workPage.title' })}
            icon={<SmallWorkIcon />}
            leftButton={<RoutedBackButton />} />
          <div style={styles.wrapper}>
            <Switch status={hasMeetingRooms}>
              <div style={styles.notificationWrapper}>
                <div>
                  <FormattedMessage
                    id='workPage.notification'
                    values={{
                      countView: <span style={styles.highlightNotification}>{notifications}</span>,
                      count: notifications
                    }} />
                </div>
                <div>
                  <div style={styles.notificationNumber}>{notifications}</div>
                  <span />
                </div>
              </div>
            </Switch>
            <Switch status={hasMeetingRooms}>
              <div style={styles.reservationWrapper}>
                <DatePickerView
                  onHandleChange={this.filterMeetings.bind(this)}
                  value={this.state.selectedDate}
                />
                <div style={styles.mainContainer}>
                  <div style={styles.scheduleWrapper}>
                    <div style={styles.scheduleItem}>
                      <div style={styles.timeStyle}>7:00 AM</div>
                    </div>
                    <div style={styles.scheduleSelected}>
                      <div style={styles.timeStyle}>
                        8:00 AM
                  <div style={{ fontSize: '12px', color: '#6daed6', marginTop: 2 }}>to 9:00 AM</div>
                      </div>
                    </div>
                    <div style={styles.scheduleItem}>
                      <div style={styles.timeStyle}>9:00 AM</div>
                    </div>
                    <div style={styles.scheduleItem}>
                      <div style={styles.timeStyle}>10:00 AM</div>
                    </div>
                    <div style={styles.scheduleItem}>
                      <div style={styles.timeStyle}>11:00 AM</div>
                    </div>
                    <div style={styles.scheduleItem}>
                      <div style={styles.timeStyle}>12:00 AM</div>
                    </div>
                    <div style={styles.scheduleItem}>
                      <div style={styles.timeStyle}>04:00 PM</div>
                    </div>
                  </div>
                  <div style={styles.meetingWrapper}>{meetings}</div>
                </div>
              </div>
            </Switch>
          </div>
      </div>
    </ColorBackground>
    );
  }
}

CalendarPage.propTypes = {
  intl: intlShape.isRequired,
  user: PropTypes.object.isRequired,
  building: PropTypes.object.isRequired
};

CalendarPage.propTypes = {
  router: PropTypes.object.isRequired
};

CalendarPage.fetchData = ({store}) => {
  const p1 = store.dispatch(retrieveMeetingRoomBookings());
  const p2 = store.dispatch(retrieveBuilding());
  return Promise.all([p1, p2]);
};

const mapStateToProps = state => ({
  user: state.user,
  building: state.building
});

const mapDispatchToProps = {
  retrieveBuilding,
  retrieveMeetingRoomBookings
};

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(CalendarPage));
