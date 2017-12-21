import PropTypes from 'prop-types';
import React, { Component } from 'react';
import {intlShape, injectIntl, FormattedMessage} from 'react-intl';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import ColorBackground from '../Backgrounds/ColorBackground';
import TitleBar from '../UI/TitleBar';
import RoutedBackButton from '../RoutedBackButton';
import {
  ListViewImage,
  ListViewItem,
  FloatingButton,
  CallButton,
  MailButton,
  Separator
} from '../UI/ListView';
import { ReportIcon, LocationIcon } from '../UI/Icons';
import IconButton from '../UI/IconButton';
import { retrieveBuilding } from '../../../redux/actions/building';
import timeHelper from '../../../redux/helpers/time';
// format phone number
import { PhoneNumberFormat as PNF, PhoneNumberUtil as PNU } from 'google-libphonenumber';
const phoneUtil = PNU.getInstance();

import styled from 'styled-components';
import {media, ContentContainer, FullHeightDiv} from '../styleUlti';

const ContentWrapper = styled.div`
  height: calc(100% - 60px);
  overflow: auto;
`;
const StyledEditButton = styled(Link)`
  text-decoration: none;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  margin: 0 14px;
`;
const OwnerWrapper = styled.div`
  height: 70px;
  width: 170px;
  overflow: hidden;
`;

export class BuildingInfoPage extends Component {
  componentDidMount() {
    if (Object.keys(this.props.building.current).length === 0) {
      this.props.retrieveBuilding();
    }
  }

  goToMap(building) {
    this.context.router.history.push({
      pathname: '/map',
      query: {
        title: building.name,
        latitude: building.geolocation[1],
        longtitude: building.geolocation[0],
        icon: 'fa-cutlery'
      }
    });
  }

  render () {
    const building = this.props.building.current;
    const address = building.address && building.address.fullAddress;
    const { formatMessage } = this.props.intl;
    const isOwner = this.props.user.info.ownedBuildings && this.props.user.info.ownedBuildings.indexOf(building.id) >= 0;
    const EditButton = () => (isOwner || this.props.user.info.flatTurtleAdmin)
    ? (
      <StyledEditButton to='edit-building'>
        <FormattedMessage id='button.edit' />
      </StyledEditButton>
    ) : null;
    // opening/closing time
    const fromTime = (building.openingHours && timeHelper.localeTimeFromDatetime(building.openingHours.from)) || null;
    const toTime = (building.openingHours && timeHelper.localeTimeFromDatetime(building.openingHours.to)) || null;
    // banner
    const mainBanner = building.image && (building.image.full || '');
    // Parse number with country code.
    let phoneNumber;
    try {
      phoneNumber = phoneUtil.format(
        phoneUtil.parse(building.concierge && building.concierge.phone, building.region),
        PNF.INTERNATIONAL
      );
    } catch (err) {
      phoneNumber = (building.concierge && building.concierge.phone) || '';
    }
    return (
      <ColorBackground color='#ffffff'>
        <FullHeightDiv>
          <TitleBar
            title={building.name}
            leftButton={<RoutedBackButton />}
            rightButton={<EditButton />} />
          <ContentContainer>
            <ContentWrapper>
              {mainBanner && <ListViewImage
                imageUrl={mainBanner}
                caption={formatMessage({id: 'buildingInfo.hello'})}/>
              }
              {fromTime && toTime &&
                <div>
                  <ListViewItem
                    title={formatMessage({id: 'buildingInfo.openingHours'})}
                    content={fromTime + ' - ' + toTime} />
                  <Separator/>
                </div>
              }
              { address &&
                <div>
                  <ListViewItem
                  title={formatMessage({id: 'buildingInfo.address'})}
                  content={address}
                  button={<IconButton icon={<LocationIcon />}
                    onTouchTap={this.goToMap.bind(this, building)}
                  />}/>
                  <Separator/>
                </div>
              }
              {phoneNumber &&
                <div>
                  <ListViewItem
                    title={formatMessage({id: 'buildingInfo.phone'})}
                    content={phoneNumber}
                    button={<CallButton phone={phoneNumber}/>} />
                  <Separator/>
                </div>
              }
              { building.concierge && building.concierge.email &&
                <div>
                  <ListViewItem
                    title={formatMessage({id: 'buildingInfo.email'})}
                    content={building.concierge.email}
                    button={<MailButton email={building.concierge && building.concierge.email}/>} />
                  <Separator/>
                </div>
              }
              { building.ownerImage &&
                <div>
                  <ListViewItem
                    title={formatMessage({id: 'buildingInfo.owner'})}
                    content={
                      <OwnerWrapper>
                        <img width='166px' src={building.ownerImage} />
                      </OwnerWrapper>
                    } />
                  <Separator/>
                </div>
              }

              <FloatingButton
                icon={<ReportIcon />}
                label={formatMessage({id: 'buildingInfo.report'})}
                target='/report' />
            </ContentWrapper>
          </ContentContainer>
        </FullHeightDiv>
      </ColorBackground>
    );
  }
}

BuildingInfoPage.contextTypes = {
  router: PropTypes.object.isRequired
};

BuildingInfoPage.propTypes = {
  intl: intlShape.isRequired,
  building: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired
};

BuildingInfoPage.fetchData = ({store}) => {
  return store.dispatch(retrieveBuilding());
};

const mapStateToProps = state => ({
	building: state.building,
  user: state.user
});

const mapDispatchToProps = {
  retrieveBuilding
};

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(BuildingInfoPage));
