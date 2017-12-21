import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { FormattedMessage, intlShape, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import CircularProgress from 'material-ui/CircularProgress';
import ColorBackground from '../Backgrounds/ColorBackground';
import TitleBar from '../UI/TitleBar';
import RoutedBackButton from '../RoutedBackButton';
import Snackbar from 'material-ui/Snackbar';
import { Palette } from '../../theme';
import { update as updateUser, getUser } from '../../../redux/actions/user';
import PersonalSettings from './PersonalSettings';
import TransportSettings from './TransportSettings';
import ErrorMessage from '../Features/ErrorMessage';
import { resetError } from '../../../redux/actions/error';
import { findEtaNextTransports, retrieveBuilding } from '../../../redux/actions/building';
import styled from 'styled-components';
import { media, ContentContainer, FullHeightDiv, TouchTapDiv } from '../styleUlti';

const TabBar = styled.div`
  height: 50px;
  background-color: #ffffff;
  font-family: Montserrat;
  font-size: 15px;
  line-height: 1.1;
  text-align: center;
  boxshadow: 0 1px 0 0 rgba(0, 0, 0, 0.12);
  display: flex;
  flex-direction: row;
  text-transform: uppercase;
  margin-bottom: 10px;
`;
const StyledTab = styled(TouchTapDiv)`
  border: ${props => props.active === 'true' ? '' : 'none'};
  box-sizing: ${props => props.active === 'true' ? 'border-box' : ''};
  border-bottom: ${props => props.active === 'true' ? '2px solid #0c78be': ''};
  color: ${props => props.active === 'true' ? '#0c78be' : '#9b9b9b'};
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 50%;
`;

class AccountPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      slideIndex: 0,
      isShowMessage: false,
      isWaiting: false,
      message: '',
      error: null,
      isShowError: false
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleUpdateUser = this.handleUpdateUser.bind(this);
    this.handleShowMessage = this.handleShowMessage.bind(this);
    this.selectTab = this.selectTab.bind(this);
  }

  componentDidMount() {
    // calculate go-home time
    if (Object.keys(this.props.building.current).length === 0) {
      this.props.retrieveBuilding();
    }
    if (Object.keys(this.props.user.info).length === 0) {
      this.props.getUser();
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

  handleChange(value) {
    this.setState({
      slideIndex: value
    });
  };

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
  selectTab(e, index) {
    e.preventDefault();
    if (Object.keys(this.props.transport.publicTransports).length === 0) {
      this.setState({isWaiting: true});
      this.props.findEtaNextTransports().then(_ => {
        this.setState({slideIndex: index, isWaiting: false});
      });
    } else {
      this.setState({slideIndex: index});
    }
  }

  render() {
    const {formatMessage} = this.props.intl;
    return (
      <ColorBackground color='#ffffff'>
        <FullHeightDiv>
          <TitleBar
            title={formatMessage({id: 'account.title'})}
            leftButton={<RoutedBackButton/>}
          />
          <ContentContainer>
          <TabBar>
            <StyledTab
              active={this.state.slideIndex === 0 ? 'true' : 'false'}
              onTouchTap={(e) => { this.selectTab(e, 0); }}>
              <FormattedMessage id='account.personal' />
            </StyledTab>
            <StyledTab
              active={this.state.slideIndex === 1 ? 'true' : 'false'}
              onTouchTap={(e) => { this.selectTab(e, 1); }}>
              <FormattedMessage id='account.transport' />
            </StyledTab>
          </TabBar>

          {this.state.slideIndex === 0 && (<PersonalSettings
            user={this.props.user}
            building={this.props.building}
            isUpdating={this.state.isUpdating}
            onUpdateUser={this.handleUpdateUser}
            onShowMessage={this.handleShowMessage}/>
          )}
          {this.state.slideIndex === 1 && (<TransportSettings
            user={this.props.user}
            isUpdating={this.state.isUpdating}
            onUpdateUser={this.handleUpdateUser}
            onShowMessage={this.handleShowMessage}/>
          )}
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
            }}/>
          </ContentContainer>
        </FullHeightDiv>
      </ColorBackground>
    );
  }
}

AccountPage.fetchData = ({store}) => {
  const p1 = store.dispatch(retrieveBuilding());
  const p2 = store.dispatch(getUser());
  return Promise.all([p1, p2]);
};

AccountPage.contextTypes = {
  router: PropTypes.object.isRequired
};

AccountPage.propTypes = {
  intl: intlShape.isRequired,
  user: PropTypes.object,
  building: PropTypes.object,
  error: PropTypes.object,
  transport: PropTypes.object,
  findEtaNextTransports: PropTypes.func,
  updateUser: PropTypes.func,
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
  updateUser,
  resetError,
  findEtaNextTransports,
  retrieveBuilding
};

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(AccountPage));
