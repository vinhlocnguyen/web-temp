import PropTypes from 'prop-types';
import React, { Component } from 'react';
import {intlShape, injectIntl} from 'react-intl';
import {
  ListEditImage,
  ListEditText,
  ListEditRichText,
  ListEditSelector,
  ListEditDate,
  FloatingButton,
  ListViewItem,
  Separator
} from './ListView';
import SliderItem from './SliderItem';
import Chip from 'material-ui/Chip';
import Checkbox from './Checkbox';
import moment from 'moment';
import styled from 'styled-components';
import { media } from '../styleUlti';

const SliderWrapper = styled.span`
  display: flex;
  flex-direction: column;
  flex-grow: 2;
`;
const ClosingDayWrapper = styled.div`
  padding: 10px 0;
`;
const ClosingDayList = styled.div`
  display: flex,
  flex-direction: row;
  flex-wrap: wrap;
`;
const WeeklyOptions = styled.div`
  display: flex;
  flex-direction: row;
`;
const DayCheckbox = styled.div`
  display: flex;
  flex-grow: 1
`;
const DaysOfMonth = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
`;
const ListViewItemContentTitle = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const styles = {
  closingDay: {
    color: 'white',
    margin: '5px'
  }
};

export class MeetingRoomItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      maxNbPersons: (props.room && props.room.maxNbPersons) ? props.room.maxNbPersons : 2,
      daySelected: '01'
    }
    this.handleChangeCapacity = this.handleChangeCapacity.bind(this);
    this.handleCheckDay = this.handleCheckDay.bind(this);
    this.handleChooseDayOfMonth = this.handleChooseDayOfMonth.bind(this);
    this.handleRemoveDayOfMonth = this.handleRemoveDayOfMonth.bind(this);
    this.handleAddClosingDay = this.handleAddClosingDay.bind(this);
  }

  handleChangeCapacity(e, value) {
    this.setState({
      maxNbPersons: value
    });

    this.props.handleChange('maxNbPersons', value);
  }

  handleCheckDay(day) {
    let days = this.props.room.daysOfWeek || [];
    let index = days.indexOf(day);
    if (index < 0) {
      days.push(day);
    } else {
      days.splice(index, 1);
    }
    this.props.handleChange('daysOfWeek', days);
  }

  handleChooseDayOfMonth(day) {    
    let days = this.props.room.daysOfMonth;
    let index = days.indexOf(day);
    if (index >= 0) {
      return;
    }
    days.push(day);
    this.setState({
      daySelected: day
    });
    this.props.handleChange('daysOfMonth', days);
  }

  handleRemoveDayOfMonth(day) {
    let days = this.props.room.daysOfMonth;
    let index = days.indexOf(day);
    if (index < 0) return;
    days.splice(index, 1);
    this.props.handleChange('daysOfMonth', days);
  }

  handleAddClosingDay(day) {
    let days = this.props.room.closingDays;
    let index = days.indexOf(day);
    if (index >= 0) {
      return;
    }
    days.push(moment(day).utc());
    this.props.handleChange('closingDays', days);
  }

  handleRemoveClosingDay(day) {
    let days = this.props.room.closingDays;
    let index = days.indexOf(day);
    if (index < 0) return;
    days.splice(index, 1);
    this.props.handleChange('closingDays', days);
  }

  renderWeeklyOptions() {
    const formatMessage = this.props.intl.formatMessage;
    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const days = daysOfWeek.map((d, index) => {
      let isChecked = (this.props.room.daysOfWeek && this.props.room.daysOfWeek.length)
        ? (this.props.room.daysOfWeek.indexOf(d) >= 0)
        : false;
      return (
        <DayCheckbox key={index}>
          <input type="checkbox" value={d} checked={isChecked} onChange={e => this.handleCheckDay(e.target.value)}/>
          <label>{d}</label>
        </DayCheckbox>
      )
    })
    return (
      <ListViewItem
        title={formatMessage({ id: 'meetingRoomEditPage.repeat_on' })}
        content={
          <WeeklyOptions>
            {days}
          </WeeklyOptions>
        }>
      </ListViewItem>
    )
  }

  renderMonthlyOptions() {
    const formatMessage = this.props.intl.formatMessage;
    const datesOfMonth = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24", "25", "26", "27", "28", "29", "30", "31"];
    let days = this.props.room.daysOfMonth || [];
    const choosenDay = days.map((d, index) => {
      return (
        <Chip style={styles.closingDay}
          key={index}
          onRequestDelete={() => this.handleRemoveDayOfMonth(d)}
          >{d}
        </Chip>
      )
    });
    
    return (
      <div>
        <ListEditSelector
          items={datesOfMonth.map(item => {return item})}
          title='Choose day'
          selected={this.state.daySelected}
          onChange={e => this.handleChooseDayOfMonth(e)}
        />
        <DaysOfMonth>
          {choosenDay}
        </DaysOfMonth>  
      </div>
    )
  }

  renderClosingDays(closingDays) {
    return closingDays.map((day, index) => {
      let sday = moment(new Date(day.toString())).format('MM/DD/YYYY');
      return (
        <Chip style={styles.closingDay}
          key={index}
          onRequestDelete={() => this.handleRemoveClosingDay(day)}
          >{sday}
        </Chip>
      )
    })
  }

  render() {
    const {formatMessage} = this.props.intl;
    const room = this.props.room;
    const closingDayItems = this.renderClosingDays(this.props.room.closingDays || []);
    const scheduleTime = ['daily', 'weekly', 'monthly'];
    const weekScheduleOptions = this.renderWeeklyOptions();
    const montlySchedule = this.renderMonthlyOptions();
    const availableParentsRoom = [{id: -1, name: 'None'}]
      .concat(this.props.meetingRooms)
      .map(room => {return room && room.name})
      .filter(r => {
        if (room && room.name) {
          return r && r.name !== room.name;
        } else {
          return r;
        }
      });

    return (
      <div>
        <ListEditText
          title={formatMessage({ id: 'meetingRoomEditPage.name' })}
          value={room.name.value}
          errorText={room.name.error}
          onChange={e => (this.props.handleChange('name', e.target.value))}
        />
        <Separator />
        <ListEditRichText
          title={formatMessage({id: 'meetingRoomInfo.description'})}
          value={room.description}
          onChange={e => (this.props.handleChange('description', e.target.value))}
        />
        <Separator />
        <ListEditText
          title={formatMessage({id: 'meetingRoomInfo.floor'})}
          value={room.floor.value}
          errorText={room.floor.error}
          onChange={e => (this.props.handleChange('floor', e.target.value))}
        />
        <Separator />
        <ListEditText
          title={formatMessage({id: 'meetingRoomInfo.room'})}
          value={room.roomNumber.value}
          errorText={room.roomNumber.error}
          onChange={e => (this.props.handleChange('roomNumber', e.target.value))}
        />
        <Separator />
        <ListEditText
          title={formatMessage({id: 'meetingRoomEditPage.price'})}
          value={room.price.value.toString()}
          errorText={room.price.error}
          onChange={e => (this.props.handleChange('price', e.target.value))}
        />
        <Separator />
        <ListEditText
          title={formatMessage({id: 'meetingRoomEditPage.currency'})}
          value={room.currency.value}
          errorText={room.currency.error}
          onChange={e => (this.props.handleChange('currency', e.target.value))}
        />
        <Separator />
        <div>
          <ListEditSelector
            items={scheduleTime.map(item => {return item})}
            title={formatMessage({id: 'meetingRoomEditPage.schedule_type'})}
            selected={room.scheduleType || 'daily'}
            onChange={e => this.props.handleChange('schedule.type', e)}
          />
          {room.scheduleType === 'weekly' &&
            weekScheduleOptions
          }
          {room.scheduleType === 'monthly' &&
            montlySchedule
          }
          <Separator />
          <ListEditText
            title={formatMessage({id: 'meetingRoomEditPage.opening_hours'})}
            value={room.openingHour.value}
            errorText={room.openingHour.error}
            onChange={e => this.props.handleChange('openingHour', e.target.value)}
          />
          <Separator />
          <ListEditText
            title={formatMessage({id: 'meetingRoomEditPage.closing_hours'})}
            value={room.closingHour.value}
            errorText={room.closingHour.error}
            onChange={e => this.props.handleChange('closingHour', e.target.value)}
          />
        </div>
        <Separator />
        <ListViewItem
          content={<ListViewItemContentTitle>
            <div>Capacity</div>
          </ListViewItemContentTitle>}>

          <SliderWrapper>
            <SliderItem
              step={1}
              onChange={this.handleChangeCapacity}
              value={room.maxNbPersons}
              min={2}
              max={50} />
          </SliderWrapper>
        </ListViewItem>
        <Separator />

        <ListViewItem
          content={<ListViewItemContentTitle>
            <div>{formatMessage({id: 'meetingRoomInfo.catering_included'})}</div>
          </ListViewItemContentTitle>}
          button={<Checkbox onCheck={e => (this.props.handleChange('isCateringIncluded', e))}
            checked={room.isCateringIncluded} />}
        />
        <Separator />

        <ListEditText
          title={formatMessage({id: 'meetingRoomEditPage.overlap'})}
          value={room.overlap}
          onChange={e => (this.props.handleChange('overlap', e.target.value))}
        />
        <Separator />

        <ListEditText
          title={formatMessage({id: 'meetingRoomEditPage.min_time_block'})}
          value={room.minTimeBlock}
          onChange={e => (this.props.handleChange('minTimeBlock', e.target.value))}
        />
        <Separator />

        <ListEditText
          title={formatMessage({id: 'meetingRoomEditPage.max_time_block'})}
          value={room.maxTimeBlock}
          onChange={e => (this.props.handleChange('maxTimeBlock', e.target.value))}
        />
        <Separator />

        <ClosingDayWrapper>
          <ListEditDate
            title={formatMessage({id: 'meetingRoomEditPage.closing_days'})}
            onChange={this.handleAddClosingDay}
          />
          <ClosingDayList>
            {closingDayItems}
          </ClosingDayList>
        </ClosingDayWrapper>
        <Separator />

        <ListEditSelector
          items={availableParentsRoom}
          title={formatMessage({id: 'meetingRoomEditPage.belong_to'})}
          selected={room.parent || 'None'}
          onChange={room => this.props.handleChange(room)}
        />
        <Separator />

        <ListEditImage
          title={formatMessage({id: 'meetingRoomEditPage.banner'})}
          image={room.banner || (room.image && room.image.full)}
          onChange={this.props.handleChange.bind(this, 'banner')}
          onRemove={this.props.handleChange.bind(this, 'banner.remove')}
          placeholder={'450x180'}
          />
        <ListEditImage
          title={formatMessage({id: 'meetingRoomEditPage.thumbnail'})}
          image={room.thumbnail || (room.image && room.image.thumbnail)}
          onChange={this.props.handleChange.bind(this, 'thumbnail') }
          onRemove={this.props.handleChange.bind(this, 'thumbnail.remove')}
          placeholder={'100x100'}
          />}
      </div>
    );
  }
}

MeetingRoomItem.propTypes = {
  intl: intlShape.isRequired,
  room: PropTypes.object,
  meetingRooms: PropTypes.array,
  handleChange: PropTypes.func
};

export default injectIntl(MeetingRoomItem);
