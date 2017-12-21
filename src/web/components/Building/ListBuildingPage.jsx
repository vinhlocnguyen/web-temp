import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { intlShape, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import ColorBackground from '../Backgrounds/ColorBackground';
import BuildingCard from '../UI/ListView/BuildingCard';
import TitleBar from '../UI/TitleBar';
import FloatingButton from '../UI/ListView/FloatingButton';
import SearchBar from '../UI/SearchBar';
import RoutedBackButton from '../RoutedBackButton';
import AdminWrapper from '../UI/AdminWrapper';
import CircularProgress from 'material-ui/CircularProgress';
import { getAllBuildings, searchBuilding, getBuildingById } from '../../../redux/actions/building';
import styled from 'styled-components';
import { media, ContentContainer, FullHeightDiv } from '../styleUlti';
import ReactGA from 'react-ga';

const ListWrapper = styled.div`
  max-height: calc(100% - 140px);
  overflow: auto;
`;

class ListBuildingPage extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      text: '',
      isLoading: true
    };
    this.handleSearch = this.handleSearch.bind(this);
    this.handleCreateBuilding = this.handleCreateBuilding.bind(this);
  }

  componentDidMount() {
    this.props.getAllBuildings().then(_ => {
      this.setState({isLoading: false});
    });
  }

  handleSearch(e) {
    if (e.which === 13 && e.nativeEvent.key === 'Enter') {
      ReactGA.event({
        category: 'Building',
        action: 'Search for buildings'
      });
      this.props.searchBuilding(this.state.text);
      this.setState({
        text: ''
      });
    } else {
      this.setState({
        text: e.target.value
      });
    }
  }

  handleSelect(id) {
    this.props.getBuildingById(id).then(_ => {
      this.context.router.history.push(`/edit-building/${id}`);
    });
  }

  handleCreateBuilding() {
    this.context.router.history.push('/new-building');
  }

  renderList(list) {
    const components = list.map((item, index) =>
      <BuildingCard
        key={index}
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
      <div className='loading'>
        <CircularProgress size={60} />
      </div>
    );
  }

  render() {
    const list = this.renderList(this.props.building.list);
    const {formatMessage} = this.props.intl;
    const mainView = this.state.isLoading
      ? this.renderFetching()
      : list;
    return (
      <AdminWrapper>
        <ColorBackground color="#eceff1">
          <FullHeightDiv>
            <TitleBar
              title={formatMessage({id: 'building.title'})}
              leftButton={<RoutedBackButton />}
            />
            <ContentContainer>
              <SearchBar
                handleChange={this.handleSearch}
                text={this.state.text}
                placeholder={'search building'}
              />
              <ListWrapper>
                {mainView}
                <FloatingButton
                  label='Create new building'
                  onHandleClick={this.handleCreateBuilding}
                />
              </ListWrapper>
            </ContentContainer>
          </FullHeightDiv>
        </ColorBackground>
      </AdminWrapper>
    );
  }
}

ListBuildingPage.contextTypes = {
  router: PropTypes.object.isRequired
};

ListBuildingPage.propTypes = {
  user: PropTypes.object,
  building: PropTypes.object,
  getAll: PropTypes.func,
  searchBuilding: PropTypes.func,
  intl: intlShape.isRequired
};

ListBuildingPage.fetchData = ({store}) => {
  return store.dispatch(getAllBuildings());
};

const mapStateToProps = state => {
  return {
    user: state.user,
    building: state.building
  };
};

const mapDispatchToProps = {
  getAllBuildings,
  searchBuilding,
  getBuildingById
}

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(ListBuildingPage));
