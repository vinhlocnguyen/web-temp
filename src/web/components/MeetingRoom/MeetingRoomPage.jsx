import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { FormattedMessage, intlShape, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import {
  MeetingRoomCard,
  GenericItem
} from '../UI/ListView';
import {
  ListViewIcon,
  MapViewIcon,
  SmallWorkIcon
} from '../UI/Icons';
import IconButton from '../UI/IconButton';
import TitleBar from '../UI/TitleBar';
import RoutedBackButton from '../RoutedBackButton';
import PushButton from '../UI/PushButton';
import ColorBackground from '../Backgrounds/ColorBackground';
import { update as updateUser } from '../../../redux/actions/user';
import { retrieveBuilding } from '../../../redux/actions/building';
import time from '../../../redux/helpers/time';
import FeatureToggle from '../UI/FeatureToggle';
import clientStorage from '../../../redux/helpers/clientStorage';
import Filter from './Filter';
import styled from 'styled-components';
import { media, ContentContainer, FullHeightDiv } from '../styleUlti';
// redux action
import { getMeetingRooms, selectMeetingRoom } from '../../../redux/actions/meetingRoom';

const NotFound = styled.span`
  font-family: Montserrat;
  font-size: 13px;
  line-height: 1;
  color: red;
  margin-bottom: 5px;
`;
const FilterTools = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin: 14px;
  align-items: center;
`;
const ComponentWrapper =  styled.div`
  height: 100%;
  overflow: auto;
`;
const styles = {
  filterButton: {
    width: '60px',
    height: '20px',
    borderRadius: '2px',
    backgroundColor: '#0c78be',
    fontSize: '15px',
    lineHeight: '20px',
    padding: '5px'
  }
};

//--intend for server-render
const isBrowser = typeof window !== 'undefined';

export class MeetingRoomPage extends Component {
  constructor(props) {
    super(props);
    const buildingId = this.props.building.current.id;
    let rooms = this.props.meetingRoom.list[buildingId] ? this.props.meetingRoom.list[buildingId] : [];
    this.state = {
      openFilter: false,
      meetingRooms: rooms,
      viewMode: isBrowser && ((clientStorage.getObject('user') && clientStorage.getObject('user').uiOptions.live.defaultView) || 'list'),
      isBlockedLocation: false
    };
    this.handleFilterToggle = this.handleFilterToggle.bind(this);
    this.handleFilter = this.handleFilter.bind(this);
  }

  componentDidMount() {
    if (this.props.building.current.id && !this.props.meetingRoom.list.length) {
      this.setState({
        isWaiting: true
      });
      this.props.getMeetingRooms().then(meetingRooms => {
        this.setState({
          meetingRooms: this.props.meetingRoom.list[this.props.building.current.id]
        });
  
        this.handleFilter(this.props.meetingRoom.filterCondition);
        this.setState({
          isWaiting: false
        });
      });
    }
  }

  handleFilterToggle() {
    this.setState({
      openFilter: !this.state.openFilter
    });
  }

  handleSelect(meetingRoom) {
    this.props.selectMeetingRoom(meetingRoom);
    this.context.router.history.push(`/meeting-rooms/${meetingRoom.id}`);
  }

  doFilter(filterCondition) {
    if (!filterCondition) {
      return;
    }
    let result = this.props.meetingRoom.list[this.props.building.current.id];
    if (filterCondition.isCateringIncluded) {
      result = result.filter(mr => {
        return mr.isCateringIncluded;
      });
    }

    if (filterCondition.capacity) {
      result = result.filter(mr => {
        return mr.maxNbPersons >= filterCondition.capacity;
      });
    }

    if (filterCondition.isOpenNow) {
      result = result.filter(mr => {
        let schedule = mr.schedule['daily'] || mr.schedule['monthly'] || mr.schedule['weekly'] || {};
        let start = schedule.opening_hour;
        let end = schedule.closing_hour;
        return time.nowIsInTime(start, end);
      });
    }

    this.setState({
      meetingRooms: result
    });
  }

  // input:
  // filter: condition
  handleFilter(filterCondition) {
    this.doFilter(filterCondition);
  }

  renderListView(meetingRooms) {
    //returns if there is no service
    if (!meetingRooms || !meetingRooms.length) {
      return (
        <GenericItem>
          <NotFound>
            <FormattedMessage id='meetingRoomPage.noMeetingRoomFound' />
          </NotFound>
        </GenericItem>
      );
    } else {
      // render filtered meeting rooms as list
      return meetingRooms.map(mr => {
        let generalInfo = [];
        mr.maxNbPersons && generalInfo.push('Max: ' + mr.maxNbPersons);
        mr.isCateringIncluded && generalInfo.push('Catering included');
        // let imgSrc = mr.image && `https://storage.googleapis.com/drops-storage-eu-west1/staging/${mr.image.thumbnail}`;
        return <MeetingRoomCard
          key={mr.id}
          title={mr.name}
          description={mr.description}
          currency={mr.currency}
          image={mr.image && mr.image.thumbnail}
          price={mr.price}
          generalInfo={generalInfo.join(', ')}
          open={mr.openingHours && (mr.openingHours.from + ' - ' + mr.openingHours.to)}
          onHandleClick={this.handleSelect.bind(this, mr)}
        />
      });
    }
  }

  render(){
    const meetingRooms = this.state.meetingRooms;
    const components = isBrowser && this.renderListView(meetingRooms);
    const {formatMessage} = this.props.intl;
    return (
      <ColorBackground color='#eceff1'>
        <FullHeightDiv>
          <ContentContainer>
          <Filter
            open={this.state.openFilter}
            toggleFilter={this.handleFilterToggle}
            onFinish={this.handleFilter}
          >
            <TitleBar
              title={formatMessage({id: 'meetingRoomPage.title'})}
              icon={<SmallWorkIcon/>}
              leftButton={<RoutedBackButton/>}
              errorMsg={this.state.isBlockedLocation ? formatMessage({id: 'warning.locationService'}) : null} />
            <FilterTools>
              <FeatureToggle feature='feature_meeting_room_sorting'>
                <div></div>
              </FeatureToggle>
              <PushButton style={styles.filterButton} label='filter' noMargin handleClick={this.handleFilterToggle}/>
            </FilterTools>

            <ComponentWrapper>
              {components}
            </ComponentWrapper>
          </Filter>
          </ContentContainer>
        </FullHeightDiv>
      </ColorBackground>
    );
  }
}

MeetingRoomPage.propTypes = {
  intl: intlShape.isRequired,
  building: PropTypes.object.isRequired,
};

MeetingRoomPage.contextTypes = {
  router: PropTypes.object
};

MeetingRoomPage.fetchData = ({store, location, params, history}) => {
  return store.dispatch(retrieveBuilding());
};

const mapStateToProps = state => ({
  building: state.building,
  meetingRoom: state.meetingRoom,
  user: state.user
});

const mapDispatchToProps = {
  updateUser,
  getMeetingRooms,
  selectMeetingRoom
};

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(MeetingRoomPage));
