import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { FormattedMessage, intlShape, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import CircularProgress from 'material-ui/CircularProgress';
import Chip from 'material-ui/Chip';
import ColorBackground from './Backgrounds/ColorBackground';
import TitleBar from './UI/TitleBar';
import AdminWrapper from './UI/AdminWrapper';
import ColoredButton from './UI/ColoredButton';
import { ListViewItem, FloatingButton, Separator, ListEditSelector, } from './UI/ListView';
import RoutedBackButton from './RoutedBackButton';
import Snackbar from 'material-ui/Snackbar';
import { Palette } from '../theme';
import { updateUserById, grantAdmin, getUserById } from '../../redux/actions/user';
import ErrorMessage from './Features/ErrorMessage';
import { resetError } from '../../redux/actions/error';
import { retrieveBuilding, getAllBuildings } from '../../redux/actions/building';
import styled from 'styled-components';
import { media, ContentContainer, FullHeightDiv } from './styleUlti';

const WrapperContent = styled.div`
  overlofw: auto;
  height: calc(100% - 66px);
`;
const OwnedBuildingList = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
`;
const OwnedBuilding = styled(Chip) `
  color: white;
  argin: 5px;
`;

class UserDetailPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isShowMessage: false,
      isWaiting: false,
      message: '',
      user: props.user.selected,
      ownedBuildings: props.user.selected.ownedBuildings || [],
      error: null,
      isShowError: false
    };

    this.handleUpdateUser = this.handleUpdateUser.bind(this);
    this.handleShowMessage = this.handleShowMessage.bind(this);
    this.handleAddOwnedBuilding = this.handleAddOwnedBuilding.bind(this);
    this.handleRemoveOwnedBuilding = this.handleRemoveOwnedBuilding.bind(this);
    this.handleGrantAdmin = this.handleGrantAdmin.bind(this);
    this.handleSave = this.handleSave.bind(this);
  }

  componentDidMount() {
    // calculate go-home time
    if (Object.keys(this.props.user.selected).length === 0) {
      this.props.getUserById(this.props.match.params.id);
    }

    if (!this.props.building.list || !this.props.building.list.length) {
      this.props.getAllBuildings();
    }
  }

  checkErrors() {
    if (this.props.error) {
      this.setState({
        error: this.props.error.status,
        isShowError: true
      });
    }
  }

  handleAddOwnedBuilding(building) {
    let buildings = this.state.ownedBuildings;
    const index = buildings.indexOf(building.id);
    if (index < 0) {
      buildings.push(building.id);
      this.setState({
        ownedBuildings: buildings
      });
    }
  }

  handleRemoveOwnedBuilding(index) {
    let buildings = this.state.ownedBuildings;
    buildings.splice(index, 1);
    this.setState({
      ownedBuildings: buildings
    });
  }

  handleUpdateUser(params) {
    this.props.updateUser(params).then(_ => {
      this.checkErrors();
      const newState = {
        isShowMessage: true,
        isWaiting: false
      };
      if (!this.props.error) {
        newState.message = <FormattedMessage id='account.personal.updatedMessage.success' />;
      } else {
        newState.message = <FormattedMessage id='account.personal.updatedMessage.failure' />;
      }
      this.setState(newState);
    });
  }

  handleGrantAdmin(e, isChecked) {
    this.setState({ isWaiting: true });
    const email = this.state.user.email;
    this.props.grantAdmin(email).then(_ => {
      this.checkErrors();
      const newState = {
        isShowMessage: true,
        isWaiting: false
      };
      if (!this.props.error) {
        newState.message = <FormattedMessage id='account.personal.updatedMessage.success' />;
      } else {
        newState.message = <FormattedMessage id='account.personal.updatedMessage.failure' />;
      }
      this.setState(newState);
    });
  }

  handleSave() {
    this.setState({ isWaiting: true });
    this.props.updateUserById(this.state.user.id, { ownedBuildings: this.state.ownedBuildings }).then(() => {
      this.checkErrors();
      const newState = {
        isShowMessage: true,
        isWaiting: false
      };
      if (!this.props.error) {
        newState.message = <FormattedMessage id='account.personal.updatedMessage.success' />;
      } else {
        newState.message = <FormattedMessage id='account.personal.updatedMessage.failure' />;
      }
      this.setState(newState);
    });
  }

  handleShowMessage(message) {
    this.setState({
      isShowMessage: true,
      isWaiting: false,
      message: message
    });
  }

  renderWaiting() {
    return (
      this.state.isWaiting
        ? <div className='loading'>
          <CircularProgress size={60} />
        </div>
        : null
    );
  }

  renderOwnedBuilding(buildings) {
    const ownedBuidlings = this.props.building.list.filter(b => {
      return buildings.indexOf(b.id) >= 0;
    });
    return ownedBuidlings.map((building, index) => {
      return (
        <OwnedBuilding
          key={index}
          onRequestDelete={() => this.handleRemoveOwnedBuilding(index)}
        >{building.name}
        </OwnedBuilding>
      )
    });
  }

  render() {
    const { formatMessage } = this.props.intl;
    const ownedBuildings = this.renderOwnedBuilding(this.state.ownedBuildings);
    const buildingList = this.props.building.list.filter(b => {
      return b.isActive && this.state.ownedBuildings.indexOf(b.id) < 0
    });
    return (
      <ColorBackground color='#ffffff'>
        <AdminWrapper>
          <FullHeightDiv>
            <TitleBar
              title={this.state.user.firstName + ' ' + this.state.user.lastName}
              leftButton={<RoutedBackButton />}
            />
            <ContentContainer>
              <WrapperContent>
                <ListViewItem
                  title={formatMessage({ id: 'account.personal.firstName' })}
                  content={this.state.user.firstName}
                />
                <ListViewItem
                  title={formatMessage({ id: 'account.personal.lastName' })}
                  content={this.state.user.lastName}
                />
                <Separator />
                <ListViewItem
                  title={formatMessage({ id: 'account.personal.email' })}
                  content={this.state.user.email}
                />
                <ListViewItem
                  title={formatMessage({ id: 'account.personal.workEmail' })}
                  content={this.state.user.workEmail}
                />
                <Separator />
                <ListViewItem
                  title={formatMessage({ id: 'account.personal.language' })}
                  content={this.state.user.language}
                />
                <Separator />
                <ListViewItem
                  title={formatMessage({ id: 'account.personal.phone' })}
                  content={this.state.user.phone}
                />
                <Separator />
                <div>
                  <ListEditSelector
                    items={buildingList}
                    title={formatMessage({ id: 'userDetail.ownedBuildings' })}
                    selected=''
                    display='name'
                    onChange={e => this.handleAddOwnedBuilding(e)}
                  />
                  <OwnedBuildingList >
                    {ownedBuildings}
                  </OwnedBuildingList>
                </div>
                <Separator />
                <ListViewItem
                  title={formatMessage({ id: 'account.personal.building' })}
                  content={this.state.user.buildingRef && this.state.user.buildingRef.name}
                />
                <Separator />
                {this.state.user && !this.state.user.flatTurtleAdmin && <ColoredButton
                  label={formatMessage({ id: 'button.save' })}
                  handleClick={this.handleSave}
                />}
                {this.state.user && !this.state.user.flatTurtleAdmin && <ColoredButton
                  label={'Grant Admin'}
                  handleClick={this.handleGrantAdmin}
                />}
              </WrapperContent>
              {this.renderWaiting()}
              <Snackbar
                open={this.state.isShowMessage}
                message={this.state.message}
                bodyStyle={{ color: Palette.alternateTextColor }}
                autoHideDuration={1500}
                onRequestClose={() => this.setState({
                  isShowMessage: false
                })}
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
                }} />
            </ContentContainer>
          </FullHeightDiv>
        </AdminWrapper>
      </ColorBackground>
    );
  }
}

UserDetailPage.fetchData = ({ store, location, params, history }) => {
  const p1 = store.dispatch(getAllBuildings());
  const p2 = store.dispatch(getUserById(params.id));
  return Promise.all([p1, p2]);
};

UserDetailPage.contextTypes = {
  router: PropTypes.object.isRequired
};

UserDetailPage.propTypes = {
  intl: intlShape.isRequired,
  user: PropTypes.object,
  building: PropTypes.object,
  error: PropTypes.object,
  transport: PropTypes.object,
  updateUserById: PropTypes.func,
  resetError: PropTypes.func
};

const mapStateToProps = state => {
  return {
    user: state.user,
    error: state.error,
    transport: state.transport,
    building: state.building
  };
};

const mapDispatchToProps = {
  updateUserById,
  grantAdmin,
  getUserById,
  resetError,
  retrieveBuilding,
  getAllBuildings
};

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(UserDetailPage));
