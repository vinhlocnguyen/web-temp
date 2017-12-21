import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { retrieveBuilding, calculateGoHomeTime } from '../../../redux/actions/building';
import { retrieveMeetingRoomBookings } from '../../../redux/actions/user';
import { resetError } from '../../../redux/actions/error';
import MobilityWidgets from './MobilityWidgets';
import ButtonBar from './ButtonBar';
import ColorBackground from '../Backgrounds/ColorBackground';
import ErrorMessage from '../Features/ErrorMessage';
import Avatar from '../UI/Avatar';
import Sidebar from '../Sidebar/Sidebar';
import Logo from '../UI/Logo';
import { BuildingIcon, MenuIcon } from '../UI/Icons';
//--intend for server-render
const isBrowser = typeof window !== 'undefined';
import ReactGA from 'react-ga';
import clientStorage from '../../../redux/helpers/clientStorage';
import { getUserLocation } from '../../../redux/helpers/distance';
import { update as updateUser } from '../../../redux/actions/user';
import styled from 'styled-components';
import { media, ContentContainer } from '../styleUlti';

const AvatarWrapper = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
	margin-top: 10px;
	cursor: pointer;
`

const Container = styled.div`
	display: flex;
	flex-direction: column;
`;

const ContainerInfo = styled.div`
	display: flex;
	flex-grow: 1;
	width: 100%;
	flex-direction: column;
	align-items: center;
	${media.phoneLandscape`
		flex-grow: 0;
		align-items: flex-end;
		margin-top: -55px;
	`};
	${media.tablet`
		flex-grow: 0;
		height: 150px;
		margin-top: auto;
	`};
	${media.tabletLandscape`
		margin-top: auto;
		align-items: center;
	`};
`;

const HeaderWrapper = styled.div`
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: space-between;
	height: 56px;
`;
const UserInfo = styled.div`
	margin-top: 14px;
	height: 16px;
	font-family: Montserrat;
	font-size: 20px;
	line-height: 0.8;
	text-align: center;
	color: #4a4a4a;
	${media.phoneLandscape`
		display: none;
	`};
	${media.tabletLandscape`
		display: block;
	`};
`;
const TouchTapDiv = (props) => <div {...props} />;
const UserArea = styled(TouchTapDiv)`cursor: pointer;`;
const MenuButton = styled(TouchTapDiv)`
	position: absolute;
	top: 0;
	right: 0;
	padding: 20px 14px;
	cursor: pointer;
`;
const Separator = styled.div`
	width: 100%;
	margin-top: 24px;
	border-style: solid;
	border-width: 0.5px;
	border-image-source: linear-gradient(to left, #eceff1, #0874ba 51%, #eceff1);
	border-image-slice: 1;
`;
const BuildingInfo = styled.div`
	margin-top: 17px;
	height: 16px;
	opacity: 0.8;
	font-family: Montserrat;
	font-size: 15px;
	line-height: 1.1;
	color: #0c78be;
	${media.phoneLandscape`
		display: none;
	`};
	${media.tabletLandscape`
		display: block;
	`};
`;

const LocationWarning = styled.div`
	color: red;
	text-align: center;
	font-size: 12px;
	width: 100%;
	background-color: bisque;
	padding: 5px 0px;
	border: 1px solid;
`;

export class HomePage extends Component {
	constructor(props, context) {
		super(props, context);
		this.state = {
			error: null,
			showMessage: false,
      menu: false, //whether the menu is open
			isShowWarningMsg: false
		};

    this.handleMenuToggle = this.handleMenuToggle.bind(this);
	}

	componentDidMount() {
		// get bookings
		if (!this.props.user.bookings) {
      this.props.retrieveMeetingRoomBookings();
		}
		
		// TODO: Added feature switch for user property isUseMyLocation
		// calculate the time to ride home
		const rideHome = () => {
      // guard against users without favouriteAddresses
      // if (this.props.user.info.favouriteAddresses.lengt === 0) {
      //   return;
      // }

			const estimateHomeDistance = (location) => {
				if (location) {
					const userInfo = clientStorage.getObject('user');
					const start = `${location[1]},${location[0]}`;
					const favAddress = userInfo && userInfo.favouriteAddresses && userInfo.favouriteAddresses.length
						? userInfo.favouriteAddresses.find(item => item.isDefault)
						: null;
					const end = favAddress ? favAddress.value : null;
					if(start && end) this.props.calculateGoHomeTime(start, end);
				}
			}

			let location = this.props.building.current.geolocation;
			let isUseMyLocation = this.props.user.info.isUseMyLocation;
			if (window.__ENV__.NODE_ENV === 'development' || process.env.NODE_ENV === 'test' || window.__ENV__['use_my_location_setting']) {
				getUserLocation(isUseMyLocation)
				.then(position => {
					if (isUseMyLocation === undefined) {
						// isUseMyLocation is not set and user allow location
						this.props.updateUser({ isUseMyLocation: true });
					}
					location = [position.coords.longitude, position.coords.latitude];
					estimateHomeDistance(location);
				})
				.catch(err => {
					if (this.props.user.info.isUseMyLocation === undefined) {
						if (err.errorCode === -2) {
							// isUseMyLocation is not set and user choose block location
							// Update useMyLocation = false
							this.props.updateUser({ isUseMyLocation: false });
						}
					}
					estimateHomeDistance(location);
				});
			} else {
				if (navigator.geolocation) {
					navigator.geolocation.getCurrentPosition((position) => {
						location = [position.coords.longitude, position.coords.latitude];
						estimateHomeDistance(location);
					}, err => {
						// Show warning when user dinied geolocation
						if(err.code == 1 && err.message == 'User denied Geolocation') {
							this.setState({
								isShowWarningMsg: true
							});
						}
						estimateHomeDistance(location);
					}, {timeout: 30000, enableHighAccuracy: true, maximumAge: 75000});
				} else {
					return null;
				}
			}
		};

		// calculate go-home time
		if (Object.keys(this.props.building.current).length === 0) {
			this.props.retrieveBuilding().then(_ => {
				if (!this.props.transport.home.duration) {
					rideHome();
				}
			});
		} else {
			if (!this.props.transport.home.duration) {
				rideHome();
			}
		}
	}

	checkErrors() {
		if (this.props.error) {
			this.setState({
				error: this.props.error.status,
				showMessage: true
			});
		}
	}

	closeErrorMessage() {
		this.props.resetError();
		if (this.state.error === 403) {
			this.context.router.history.replace('/login');
		}
		if (this.state.error === 404) {
			this.context.router.history.replace({pathname: '/select-building', state: {hasBackbutton: false}});
		}
		this.setState({
			error: null,
			showMessage: false
		});
	}

  handleMenuToggle (e) {
    e.preventDefault();
    this.setState({menu: !this.state.menu});
  }

	closeMenu (e) {
		e.preventDefault();
		if (this.state.menu) {
			this.setState({menu: false});
		}
	}

  render() {
		const building = this.props.building.current;
		const user = this.props.user.info;

    const Header = () => (
			<HeaderWrapper>
				<Logo width='89px' height='30px' />
				<MenuButton onTouchTap={this.handleMenuToggle}>
					<MenuIcon />
				</MenuButton>
			</HeaderWrapper>
		);
		
    return (
      <ColorBackground color="#eceff1">
        <Sidebar open={this.state.menu}>
          <Container className={'page'} onTouchTap={(e) => { this.closeMenu(e); }}>
            <Header />
						{this.state.isShowWarningMsg && <LocationWarning>
							<FormattedMessage id="warning.locationService" />
						</LocationWarning>}
							<ContainerInfo>
								<UserArea onTouchTap={() => this.context.router.history.push('account')}>
									<AvatarWrapper>
										<Avatar avatarUrl={user.avatarUrl} />
									</AvatarWrapper>
									<UserInfo>
											{user.firstName}&nbsp;
											{user.lastName}
									</UserInfo>
								</UserArea>
								<BuildingInfo>
									<BuildingIcon /> {building.name}: <FormattedMessage id='homepage.hello'/>
								</BuildingInfo>
							</ContainerInfo>
							<ContentContainer>
								<MobilityWidgets address={building.address} />
								<Separator />
								<ButtonBar router={this.context.router.history}/>
							</ContentContainer>
          </Container>
          <ErrorMessage
            error={this.state.error}
            open={this.state.showMessage}
            handleClose={this.closeErrorMessage.bind(this)}/>
        </Sidebar>
      </ColorBackground>
    );
  }
}

HomePage.propTypes = {
	error: PropTypes.object,
	user: PropTypes.object,
	building: PropTypes.object,
	retrieveBuilding: PropTypes.func,
	retrieveMeetingRoomBookings: PropTypes.func,
	resetError: PropTypes.func
};

HomePage.contextTypes = {
	router: PropTypes.object.isRequired
};

HomePage.fetchData = ({store}) => {
	const p1 = store.dispatch(retrieveMeetingRoomBookings());
	const p2 = store.dispatch(retrieveBuilding());
	return Promise.all([p1, p2]);
};

const mapStateToProps = state => ({
	error: state.error,
	user: state.user,
	building: state.building,
	transport: state.transport
});

const mapDispatchToProps = {
	retrieveBuilding,
	retrieveMeetingRoomBookings,
	calculateGoHomeTime,
	updateUser,
	resetError
};

export default connect(mapStateToProps, mapDispatchToProps)(HomePage);
