import PropTypes from 'prop-types';
import React, { Component } from 'react';
import RoutedBackButton from '../RoutedBackButton';
import { intlShape, injectIntl, FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import TitleBar from '../UI/TitleBar';
import ColorBackground from '../Backgrounds/ColorBackground';
import BorderButton from '../UI/BorderButton';
import {
  ClockIcon,
  ClearLocationIcon,
  ClearPhoneIcon,
  PhoneCallIcon
} from '../UI/Icons';
import {
  ListViewImage,
  GenericItem,
  Separator,
  ListViewItem,
  FloatingButton
} from '../UI/ListView';
import { getService } from '../../../redux/actions/service';
import { retrieveBuilding } from '../../../redux/actions/building';
import FeatureToggle from '../UI/FeatureToggle';
import { getBuildingByService } from '../../../redux/actions/service';
import styled from 'styled-components';
import { ContentContainer } from '../styleUlti';
// format phone number
import { PhoneNumberFormat as PNF, PhoneNumberUtil as PNU } from 'google-libphonenumber';
const phoneUtil = PNU.getInstance();

const ContactItem = styled.div`
  display: flex;
  margin: 5px 0 5px;
  align-items: center;
  cursor: pointer;
`;
const TouchTapSpan = (props) => <span {...props} />
const ContactText = styled(TouchTapSpan)`
  font-family: Montserrat;
  font-size: 14px;
  fontWeight: 300,
  lineHeight: 1.5,
  color: '#4a4a4a',
  textTransform: 'capitalize'
`;
const IconWrapper = styled.div`
  width: 20px;
  margin-right: 10px;
`;
const StyledLink = styled.a`text-decoration: none;`;
const EditButton = styled(Link)`
  text-decoration: none;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  margin: 0 14px;
`;
const LiveDetailContentContainer = ContentContainer.extend`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
`;
const OpeningHoursWrapper = styled.div`
  display: flex;
  margin: 5px 0 5px;
  align-items: center;
`;
const ClockIconWrapper = styled.div`
  width: 20px;
  margin-right: 10px;
`;
const OpeningHoursText = styled.span`
  font-family: Montserrat;
  font-size: 14px;
  font-weight: 300;
  line-height: 1;
  color: '#4a4a4a'
`;

const styles = {
  description: {
    flexDirection: 'column'
  }
};

export class LiveDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isShowEditButton: false
    }

    if (props.user.info.flatTurtleAdmin) {
      this.state.isShowEditButton = true;
    }
  }

  componentDidMount() {
    if (Object.keys(this.props.service.selected).length === 0) {
      this.props.getService(this.props.match.params.id);
    }
    if (Object.keys(this.props.building.current).length === 0) {
      this.props.retrieveBuilding();
    }

    if (!this.state.isShowEditButton) {
      if (this.props.user.info.ownedBuildings && this.props.user.info.ownedBuildings.indexOf(this.props.building.current.id) >= 0) {
        this.props.getBuildingByService(this.props.service.selected.id)
          .then(res => {
            const notOwnedBuildings = res.response.filter(b => {
              return this.props.user.info.ownedBuildings.indexOf(b._id) < 0;
            });
            if (!notOwnedBuildings || !notOwnedBuildings.length) {
              this.setState({
                isShowEditButton: true
              });
            }
          });
      }
    }
  }
  renderEditButton() {
    return () => this.state.isShowEditButton
      ? <EditButton
          to={`/live/${this.props.service.selected.id}/edit`}
        >
          <FormattedMessage id='button.edit'/>
      </EditButton>
      : null;
  }

  render () {
    const {formatMessage} = this.props.intl;
    const service = this.props.service.selected;
    const linkButton = service.link && service.link.url ? (
      <BorderButton
      label={service.link.type === 'Website' ? formatMessage({id: 'button.viewWebsite'}) : formatMessage({id: 'button.viewMenu'})}
        handleClick={() => {
          if (window) {
            const url = service.link.url.includes('http') ? service.link.url : `http://${service.link.url}`;
            window.open(url, '_blank');
          }
      }} />
    ) : null
    const building = this.props.building.current;
    const EditButton = this.renderEditButton();
    // Parse number with country code.
    let phoneNumber;
    try {
      phoneNumber = phoneUtil.format(
        phoneUtil.parse(service.phoneNumber, building.region),
        PNF.INTERNATIONAL
      );
    } catch (err) {
      phoneNumber = service.phoneNumber;
    }
    return (
      <ColorBackground color='#ffffff'>
        <TitleBar
          title={service.name}
          leftButton={<RoutedBackButton />}
          rightButton={<EditButton />} />
        <LiveDetailContentContainer>
          {service.image && service.image.full && <ListViewImage
            imageUrl={service.image.full}
            caption={service.name} />
          }
          <GenericItem>
            {service.openingHours &&
              <FeatureToggle feature='feature_service_opening_closing_time'>
                <OpeningHoursWrapper>
                  <ClockIconWrapper>
                    <ClockIcon />
                  </ClockIconWrapper>
                  <OpeningHoursText>
                    {service.openingHours && (service.openingHours.from + ' - ' + service.openingHours.to)}
                  </OpeningHoursText>
                </OpeningHoursWrapper>
              </FeatureToggle>}
            {service.address && <ContactItem>
              <IconWrapper><ClearLocationIcon /></IconWrapper>
              <ContactText onTouchTap={() => {
                this.context.router.history.push({
                  pathname: '/map',
                  query: {
                    title: service.name,
                    latitude: service.geolocation[1],
                    longitude: service.geolocation[0],
                    icon: 'fa-cutlery'
                  }
                });
              }}>{service.address}</ContactText>
            </ContactItem>}
            {phoneNumber &&
              <ContactItem>
                <IconWrapper><ClearPhoneIcon /></IconWrapper>
                <StyledLink href={'tel://' + phoneNumber} ><ContactText>{phoneNumber}</ContactText></StyledLink>
              </ContactItem>
            }
            {service.address && !service.isHideOnMap && <BorderButton
              label={formatMessage({ id: 'liveDetail.view_on_map' })}
              handleClick={() => {
                this.context.router.history.push({
                  pathname: '/map',
                  query: {
                    title: service.name,
                    latitude: service.geolocation[1],
                    longitude: service.geolocation[0],
                    icon: 'fa-cutlery'
                  }
                });
              }} />}
            {linkButton}
          </GenericItem>
          <Separator />
          <ListViewItem
            style={styles.description}
            title={formatMessage({ id: 'liveDetail.information' })}
            content={service.description}
          />
          {phoneNumber &&
            <FloatingButton
              icon={<PhoneCallIcon />}
              label={formatMessage({ id: 'liveDetail.call_for_booking' })}
              target={'tel://' + phoneNumber}
              external
            />
          }
        </LiveDetailContentContainer>
      </ColorBackground>
    );
  }
}

LiveDetail.propTypes = {
  intl: intlShape.isRequired,
  service: PropTypes.object.isRequired,
  building: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired
};

LiveDetail.contextTypes = {
  router: PropTypes.object
};

LiveDetail.fetchData = ({store, location, params, history}) => {
  const p1 = store.dispatch(getService(params.id));
  const p2 = store.dispatch(retrieveBuilding());
  return Promise.all([p1, p2]);
};

const mapStateToProps = state => ({
  service: state.service,
  building: state.building,
  user: state.user
});

const mapDispatchToProps = {
  getService,
  retrieveBuilding,
  getBuildingByService
};

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(LiveDetail));
