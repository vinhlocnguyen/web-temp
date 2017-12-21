import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { intlShape, injectIntl } from 'react-intl';
import ColorBackground from './Backgrounds/ColorBackground';
import TitleBar from './UI/TitleBar';
import RoutedBackButton from './RoutedBackButton';
import ListViewUser from './UI/ListView/ListViewUser';
import CircularProgress from 'material-ui/CircularProgress';
import { listUser, searchUser, selectUser, removeUser } from '../../redux/actions/user';
import { resetError } from '../../redux/actions/error';
import Dialog from 'material-ui/Dialog';
import { Palette } from '../theme';
import FeatureToggle from './UI/FeatureToggle';
import SearchBar from './UI/SearchBar';
import AdminWrapper from './UI/AdminWrapper';
import Snackbar from 'material-ui/Snackbar';
import ErrorMessage from './Features/ErrorMessage';
import ConfirmMessage from './Features/ConfirmMessage';
import ReactGA from 'react-ga';
import styled from 'styled-components';
import { media, ContentContainer } from './styleUlti';

const ListViewWrapper = styled.div`
  overflow: auto;
  margin-bottom: 14px;
`;

class ManageUserPage extends Component {
  constructor() {
    super();
    // initial states
    this.state = {
      searchingText: '',
      showPopup: false,
      selectedUser: {},
      isRemoving: false,
      isWaiting: false,
      isShowNotification: false,
      error: null,
      isShowError: false,
      userToBeRemoved: null,
      isShowConfirmMsg: false
    };
    // binding actions
    this.handleSearch = this.handleSearch.bind(this);
    this.btnDeleteUserClicked = this.btnDeleteUserClicked.bind(this);
    this.closeConfirmDialog = this.closeConfirmDialog.bind(this);
  }

  componentWillMount() {
    this.props.listUser();
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

  handleSearch(e) {
    if (e.which === 13 && e.nativeEvent.key === 'Enter') {
      this.setState({isWaiting: true});
      this.props.searchUser(this.state.searchingText).then(_ => {
        this.checkErrors();
        this.setState({
          searchingText: '',
          isWaiting: false
        });
      });
    } else {
      this.setState({
        searchingText: e.target.value
      });
    }
  }

  handleSelect(index) {
    const selectedUser = this.props.user.list[index];
    this.props.selectUser(selectedUser);
    this.context.router.history.push(`/users/${selectedUser.id}`);
  }

  btnDeleteUserClicked(id) {
    this.setState({
      isShowConfirmMsg: true,
      userToBeRemoved: id
    });
  }

  handleRemoveUser() {
    this.props.removeUser(this.state.userToBeRemoved).then(_ => {
      this.checkErrors();
      const newState = { isRemoving: false };
      if (!this.props.error) {
        newState.isShowNotification = true;
      }
      this.setState(newState);
    });
    this.setState({
      isRemoving: true
    });
    this.closeConfirmDialog();
  }

  closeConfirmDialog() {
    this.setState({
      isShowConfirmMsg: false,
      userToBeRemoved: null
    });
  }

  renderList(list) {
    return list && list.map((item, index) =>
      <ListViewUser
        key={index}
        avatar={item.avatarUrl}
        name={item.firstName + ' ' + item.lastName}
        email={item.email}
        isAdmin={item.flatTurtleAdmin}
        onTouchTap={this.handleSelect.bind(this, index)}
        onRemoveUser={this.btnDeleteUserClicked.bind(this, item.id)}
      />
    );
  }

  renderWaiting() {
    return (
      <div className='loading'>
        <CircularProgress size={60} />
      </div>
    );
  }

  render() {
    const {formatMessage} = this.props.intl;
    const list = this.renderList(this.props.user.list);
    const waiting = (this.state.isWaiting || this.state.isRemoving) && this.renderWaiting();
    return (
      <FeatureToggle feature='feature_manage_users'>
        <AdminWrapper>
          <ColorBackground color='#eceff1'>
            <TitleBar
              title={formatMessage({id: 'listUser.title'})}
              leftButton={<RoutedBackButton/>}
            />
            <ContentContainer>
            <SearchBar
              text={this.state.searchingText}
              handleChange={this.handleSearch}
              placeholder={formatMessage({id: 'listUser.searching'})}
            />
            <ListViewWrapper>
              {list}
              {waiting}
            </ListViewWrapper>
            <Snackbar
              open={this.state.isShowNotification}
              message={formatMessage({id: 'listUser.removingSuccess'})}
              autoHideDuration={1000}
              onRequestClose={() => this.setState({ isShowNotification: false })} />

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
              <ConfirmMessage
                message={formatMessage({id: 'listUser.confirmDeleteUser'})}
                open={this.state.isShowConfirmMsg}
                handleClose={this.closeConfirmDialog}
                handleYesBtn={this.handleRemoveUser.bind(this)}
              />
            </ContentContainer>
          </ColorBackground>
        </AdminWrapper>
      </FeatureToggle>
    );
  }
}

ManageUserPage.contextTypes = {
  router: PropTypes.object.isRequired
};

ManageUserPage.propTypes = {
  user: PropTypes.object,
  error: PropTypes.object,
  listUser: PropTypes.func,
  searchUser: PropTypes.func,
  removeUser: PropTypes.func,
  resetError: PropTypes.func,
  intl: intlShape.isRequired
};

const mapStateToProps = state => ({
  user: state.user,
  error: state.error
});

const mapDispatchToProps = {
  listUser,
  selectUser,
  searchUser,
  removeUser,
  resetError
};

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(ManageUserPage));
