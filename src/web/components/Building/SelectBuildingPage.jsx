import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { intlShape, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import ColorBackground from '../Backgrounds/ColorBackground';
import SearchBar from '../UI/SearchBar';
import CircularProgress from 'material-ui/CircularProgress';
import { getAllBuildings, searchBuilding, nextToMe, selectBuilding, retrieveBuilding } from '../../../redux/actions/building';
import { clearMeetingRoom } from '../../../redux/actions/meetingRoom';
import { resetError } from '../../../redux/actions/error';
import {
  ListViewImage
} from '../UI/ListView';
import BuildingCard from '../UI/ListView/BuildingCard';
import ErrorMessage from '../Features/ErrorMessage';
import styled from 'styled-components';
import { media, TouchTapDiv, ContentContainer, FullHeightDiv } from '../styleUlti';
import ReactGA from 'react-ga';

const Greeting = styled.div`
  color: rgb(12, 120, 190);
  text-align: center;
  font-weight: bold;
  font-size: 18px;
  padding: 20px 20px 6px;
  font-family: Montserrat;
  line-height: 1.2;
`;
const SuggestedTitle = styled.div`
  margin: 20px 14px 12px;
  color: rgb(34, 177, 215);
  font-family: Montserrat;
  font-size: 16px;
`;
const ListWrapper = FullHeightDiv.extend`
  overflow: auto;
`;
const Loading = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 20px;
`;

export class SelectBuildingPage extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      text: '',
      isLoading: true,
      error: null,
      isShowError: false
    };
    this.handleSearch = this.handleSearch.bind(this);
    this.handleNextToMe = this.handleNextToMe.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    this.props.getAllBuildings().then(_ => {
      this.props.clearMeetingRoom();
      this.setState({isLoading: false});
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

  handleSearch() {
    ReactGA.event({
      category: 'Building',
      action: 'Search for buildings'
    });
    this.props.searchBuilding(this.state.text).then(_ => {
      this.checkErrors();
    });
  }

  handleSelect(id) {
    this.props.selectBuilding(id).then(_ => {
      this.checkErrors();
      this.props.retrieveBuilding().then(_ => {
        this.checkErrors();
        this.context.router.history.push('/');
      });
    });
  }

  handleNextToMe() {
    ReactGA.event({
      category: 'Building',
      action: 'Find next to me'
    });
    if (navigator.geolocation) {
      this.setState({ isLoading: true });
      navigator.geolocation.getCurrentPosition(function(position) {
        this.props.nextToMe(position.coords.latitude, position.coords.longitude).then(_ => {
          this.checkErrors();
        });
        this.setState({ isLoading: false });
      }.bind(this));
    }
  }

  handleChange(e) {
    this.setState({text: e.target.value}, this.handleSearch);
  }

  renderList(list) {
    const components = list.map(item =>
      <BuildingCard
        key={item.id}
        title={item.name}
        status={item.isActive}
        content={item.address}
        onHandleClick={this.handleSelect.bind(this, item.id)}
      />
    );
    return components;
  }

  renderFetching() {
    return (
      <Loading>
        <CircularProgress size={60} />
      </Loading>
    );
  }

  render() {
    const user = this.props.user.info;
    const {formatMessage} = this.props.intl;
    const list = this.renderList(this.props.building.list);
    const mainView = this.state.isLoading
      ? this.renderFetching()
      : (
        <div>
          {list}
        </div>
      );
    return (
      <ColorBackground color="#eceff1">
        <ListWrapper>
          <ContentContainer>
          <ListViewImage
            imageUrl={require('../../assets/images/demo-img.png')}
            caption={formatMessage({id: 'building.imageCaption'})}
          />
          <Greeting>
            {formatMessage({id: 'building.greeting'}, {name: user.firstName})}
          </Greeting>
          <SearchBar
            placeholder={formatMessage({id: 'building.search'})}
            handleChange={this.handleChange}
            text={this.state.text}
          />
          <SuggestedTitle>
            {formatMessage({id: 'building.result'})}
          </SuggestedTitle>
          <div>{mainView}</div>
          <ErrorMessage
            error={this.state.error}
            open={this.state.isShowError}
            handleClose={() => {
              this.props.resetError();
              this.setState({
                error: null,
                isShowError: false
              });
            }} />
          </ContentContainer>
        </ListWrapper>
      </ColorBackground>
    );
  }
}

SelectBuildingPage.contextTypes = {
  router: PropTypes.object.isRequired
};

SelectBuildingPage.propTypes = {
  intl: intlShape.isRequired,
  building: PropTypes.object,
  getAll: PropTypes.func,
  searchBuilding: PropTypes.func,
  getAllBuildings: PropTypes.func,
  nextToMe: PropTypes.func,
  selectBuilding: PropTypes.func,
  retrieveBuilding: PropTypes.func,
  resetError: PropTypes.func,
  user: PropTypes.object,
  error: PropTypes.object
};

SelectBuildingPage.fetchData = ({store}) => {
  return store.dispatch(getAllBuildings());
};

const mapStateToProps = state => ({
  building: state.building,
  user: state.user,
  error: state.error
});

const mapDispatchToProps = {
  getAllBuildings,
  searchBuilding,
  nextToMe,
  selectBuilding,
  retrieveBuilding,
  clearMeetingRoom,
  resetError
};

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(SelectBuildingPage));
