import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import {SmallMoveIcon} from '../UI/Icons';
import { connect } from 'react-redux';
import ColorBackground from '../Backgrounds/ColorBackground';
import TitleBar from '../UI/TitleBar';
import MiniMap from '../UI/MiniMap';
import RoutedBackButton from '../RoutedBackButton';
import { GenericItem, ScheduleCard } from '../UI/ListView';
import { findEtaNextTransports, retrieveBuilding } from '../../../redux/actions/building';
import localeName from '../../../redux/helpers/localeName';
import styled from 'styled-components';
import { media, ContentContainer, FullHeightDiv } from '../styleUlti';

const Container = styled.div`
  height: calc(100% - 60px);
  overflow: auto;
`;
const NotFound = styled.span`
  font-family: Montserrat;
  font-size: 13px;
  line-height: 1;
  color: red;
  margin-bottom: 5px;
`;

export class TimeTable extends Component {
  componentDidMount() {
    if (Object.keys(this.props.building.current).length === 0) {
      this.props.retrieveBuilding();
    }
    if (Object.keys(this.props.transport.publicTransports).length === 0) {
      this.props.findEtaNextTransports();
    }
  }

  renderTimeTable(schedules) {
    if (!schedules || schedules.length === 0) {
      return (
        <GenericItem><NotFound>
          <FormattedMessage id='timetable.notScheduleFound' />
        </NotFound></GenericItem>
      );
    } else {
      return schedules.map((entry, index) => {
        const hours = entry.datetime ? entry.datetime.slice(9, 11) : "0" + (new Date(parseInt(entry.time) * 1000)).getHours();
        const minutes = entry.datetime ? entry.datetime.slice(11, 13) : "0" + (new Date(parseInt(entry.time) * 1000)).getMinutes();
          return (
            <ScheduleCard
              key={index}
              start={entry.start}
              direction={entry.direction}
              time={`${hours.substr(hours.length - 2, 2)}:${minutes.substr(minutes.length - 2, 2)}`}
              onHandleClick={() => {}}
            />
          );
        });
      }
  }

  renderMiniMap(stop) {
    const point = {
      stopType: stop.type.toLowerCase(),
      coord: {
        lon: stop.coord[0],
        lat: stop.coord[1]
      },
      title: this.props.location.query.name
    };
    return this.props.building.current.geolocation && (
      <MiniMap
        building={this.props.building.current}
        stop={point}
      />
    );
  }

  render () {
    const params = this.props.match.params;
    const query = this.props.location.query;
    const stop = this.props.transport.publicTransports.find(item => {
      return item.type === params.stopType && parseFloat(query.longitude) === item.coord[0] && parseFloat(query.latitude) === item.coord[1];
    });
    const timetable = this.renderTimeTable(stop[params.stopType]);
    const minimap = this.renderMiniMap(stop);
    // locale title name
    const building = this.props.building.current;
    const title = building.address && localeName(this.stopType, building.address.country, building.address.city);
    return (
      <ColorBackground color='#eceff1'>
        <FullHeightDiv>
          <TitleBar
            title={query.name}
            leftButton={<RoutedBackButton />}
            icon={<SmallMoveIcon/>}/>
          <ContentContainer>
            <Container>
              {minimap}
              {timetable}
            </Container>
          </ContentContainer>
        </FullHeightDiv>
      </ColorBackground>
    );
  }
}

TimeTable.fetchData = ({store, location, params, history}) => {
  const p1 = store.dispatch(findEtaNextTransports());
  const p2 = store.dispatch(retrieveBuilding());
  return Promise.all([p1, p2]);
};

TimeTable.propTypes = {
  transport: PropTypes.object.isRequired,
  building: PropTypes.object.isRequired,
  findEtaNextTransports: PropTypes.func.isRequired,
  retrieveBuilding: PropTypes.func.isRequired,
  params: PropTypes.object
};

const mapStateToProps = state => ({
  transport: state.transport,
  building: state.building
});

const mapDispatchToProps = {
  findEtaNextTransports,
  retrieveBuilding
};

export default connect(mapStateToProps, mapDispatchToProps)(TimeTable);
