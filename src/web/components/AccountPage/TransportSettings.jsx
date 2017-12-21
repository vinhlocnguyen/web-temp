import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage, intlShape, injectIntl } from 'react-intl';
import { Separator, ListViewItem, FloatingButton, RemoveButton } from '../UI/ListView';
import ColoredButton from '../UI/ColoredButton';
import TextField from '../UI/TextField';
import Chip from 'material-ui/Chip';
import FontIcon from 'material-ui/FontIcon';
import Avatar from 'material-ui/Avatar';
import { SaveIcon } from '../UI/Icons';
import Checkbox from '../UI/Checkbox';
import ConfirmMessage from '../Features/ConfirmMessage';
import FeatureToggle from '../UI/FeatureToggle';
import { getUserLocation } from '../../../redux/helpers/distance';
import WarningMessage from '../Features/WarningMessage';

import { green500, green600, grey700 } from 'material-ui/styles/colors';
import { Palette } from '../../theme';
import ReactGA from 'react-ga';
import styled from 'styled-components';
import { media, ContentContainer, TouchTapSpan} from '../styleUlti';

const Wrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
`;
const SubTitle = styled.span`
  color: #000;
  font-size: 12px;
  font-weight: 200;
  margin-left: 5px;
`;
const SubButton = styled(TouchTapSpan)`
  background-color: #0c78be;
  color: #fff;
  font-size: 12px;
  padding: 2px 4px;
  font-weight: 300;
  margin-left: 5px;
`;
const CheckBoxTitle = styled.div`
  lineheight: 1;
  margin-bottom: 5px;
  word-break: break-word;
`;
const HelperLink = styled(TouchTapSpan)`
  color: black;
  text-ddecoration: underline;
  cursor: pointer;
`;
const ContainerWrapper = styled.div`
  height: calc(100% - 154px);
  overflow: auto;
`;
const FavouriteAddressesWrapper = styled.div`
  overflow: auto;
  max-height: 200px;
  ${media.tablet`
    height: initial;
  `}
`

const styles = {
  input: {
    color: Palette.alternateTextColor
  },
  chip: {
    margin: 4
  },
  addButton: {
    width: 80,
    height: 40
  }
};

class TransportSettings extends Component {
  constructor(props) {
    super(props);
    const user = this.props.user.info;
    this.state = {
      transportMethods: user.transportMethods || [],
      favouriteAddresses: user.favouriteAddresses.map(item => ({tag: item.tag, value: item.value, isDefault: item.isDefault})) || [],
      tagInput: '',
      addressInput: '',
      isUseMyLocation: user.isUseMyLocation,
      isShowConfirmMsg: false,
      isShowWarningMsg: false,
      warningMsg: ''
    };
    // binding actions
    this.handleSave = this.handleSave.bind(this);
  }

  componentDidMount() {
    const user = this.props.user.info;
    this.state.transportMethods.forEach((ele, index) => {
      if (user.transportMethods.indexOf(ele.value) > -1) {
        ele.isSelected = true;
      }
    });
  }

  handleSelectMethod(index, value) {
    const newMethods = this.state.transportMethods.includes(value)
      ? this.state.transportMethods.filter(item => item !== value)
      : this.state.transportMethods.concat(value);
    this.setState({
      transportMethods: newMethods
    });

    const params = {
      transportMethods: newMethods
    };
    this.handleSave(params);
  }

  handleSetDefaultAddress(index) {
    const newState = this.state.favouriteAddresses.slice(0);
    // find default index
    const defaultIndex = newState.findIndex(item => item.isDefault);
    // choose new default address
    newState[index].isDefault = true;
    // remove old default address
    if(defaultIndex >= 0) newState[defaultIndex].isDefault = false;
    this.setState({
      favouriteAddresses: newState
    });
    this.handleSave({favouriteAddresses: newState});
  }

  handleRemoveFavouriteAddress(index) {
    this.state.favouriteAddresses.splice(index, 1);
    const newState = this.state.favouriteAddresses.slice(0);
    this.setState({
      favouriteAddresses: newState
    });
    // always save after removing
    this.handleSave({favouriteAddresses: newState});
  }

  handleAddFavouriteAddress() {
    if (this.state.tagInput && this.state.addressInput) {
      const newItem = this.state.favouriteAddresses.length === 0
        ? { tag: this.state.tagInput, value: this.state.addressInput, isDefault: true }
        : { tag: this.state.tagInput, value: this.state.addressInput };
      const newState = [...this.state.favouriteAddresses, newItem];
      this.setState({
        favouriteAddresses: newState,
        tagInput: '',
        addressInput: ''
      });

      const params = {
        favouriteAddresses: newState
      };
      this.handleSave(params);
    }
  }

  goToHelpPage() {
    this.setState({
      isShowWarningMsg: false
    });
    this.context.router.push('/help');
  }

  handleCheckUseMyLocation(isChecked) {
    if (!isChecked) {
      this.setState({
        isShowConfirmMsg: true
      });
    } else {
      // Turn on use my location
      getUserLocation(isChecked)
        .then(position => {
          this.setState({
            isUseMyLocation: true
          });
          this.handleSave({ isUseMyLocation: true });
        })
        .catch(err => {
          if (err.errorCode === -2) { // location is blocked by browser
            this.setState({
              isShowWarningMsg: true,
              warningMsg: (<FormattedMessage
              id='account.transport.warningMsg'
              values={{
                link: (<HelperLink onTouchTap={this.goToHelpPage.bind(this)}>
                  <FormattedMessage id='account.transport.warningMsg.link' />
                </HelperLink>)
              }} />)
            });
          } else {
            this.setState({
              isShowWarningMsg: true,
              warningMsg: err.errorMsg
            });
          }
        });
    }  
  }

  handleTurnOffUseMyLocation() {
    this.setState({
      isShowConfirmMsg: false,
      isUseMyLocation: false
    });
    this.handleSave({ isUseMyLocation: false });
  }

  handleSave(params) {
    this.props.onUpdateUser(params);
    ReactGA.event({
      category: 'Account',
      action: 'Save account',
      label: 'Transport settings'
    });
    params.transportMethods && params.transportMethods.forEach(transportMethod => {
      ReactGA.event({
        category: 'Account',
        action: 'Choose transport methods',
        value: transportMethod
      });
    });
  }

  renderTransportMethods() {
    const methods = [];
    this.props.transport.publicTransports.forEach(item => {
      if (!methods.includes(item.type)) methods.push(item.type);
    });
    methods.push('Car');
    return methods.map((item, index) => {
      return (
        this.state.transportMethods.includes(item)
        ? (
          <Chip key={index} style={styles.chip} backgroundColor={green500} onTouchTap={this.handleSelectMethod.bind(this, index, item)}>
            <Avatar icon={<FontIcon className='fa fa-times' style={{textAlign: 'center'}} />} backgroundColor={green600} color={grey700} />
            {item}
          </Chip>
        ) : (
          <Chip key={index} style={styles.chip} backgroundColor={'#333'} onTouchTap={this.handleSelectMethod.bind(this, index, item)}>
            <Avatar backgroundColor={grey700} />
            {item}
          </Chip>
        )
      );
    });
  }

  renderFavouriteAddresses() {
    return this.state.favouriteAddresses.map((item, index) => {
      const defaultTag = item.isDefault
      ? (
        <SubTitle>default</SubTitle>
      )
      : (<SubButton
        onTouchTap={this.handleSetDefaultAddress.bind(this, index)}> set default </SubButton>);

      return (
        <div key={index}>
          <ListViewItem
            title={item.tag}
            subtitle={defaultTag}
            content={item.value}
            button={
              <div>
              {!item.isDefault && <RemoveButton onHandleClick={this.handleRemoveFavouriteAddress.bind(this, index)} />}
              </div>
            }/>
          <Separator />
        </div>
      );
    });
  }

  render() {
    const { formatMessage } = this.props.intl;
    const confirmTurnOffUseCurrentLocation = formatMessage({ id: 'account.transport.confirmation.turnOffLocationMessage' });
    return (
      <ContainerWrapper>
        <ListViewItem
          title={formatMessage({id: 'account.transport.methods'})}
          content={
            <Wrapper>
              {this.renderTransportMethods()}
            </Wrapper>
          }
        />
        <Separator />
        <FeatureToggle feature='use_my_location_setting'>
          <div>
          <ListViewItem
            content={<div style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
              <CheckBoxTitle>Use my location</CheckBoxTitle>
            </div>}
            button={<Checkbox onCheck={this.handleCheckUseMyLocation.bind(this)} checked={this.state.isUseMyLocation} />}
          />
          <Separator />
          </div>  
        </FeatureToggle>  
        <ListViewItem
          title={formatMessage({id: 'account.transport.favouriteAddresses'})}
          content={
            <div>
              <TextField
                name='tag-input'
                label={formatMessage({id: 'account.transport.favourite.tagHint'})}
                style={Object.assign({}, styles.leftCol, styles.input)}
                value={this.state.tagInput}
                onChange={(e) => this.setState({tagInput: e.target.value})} />
              <TextField
                name='address-input'
                label={formatMessage({id: 'account.transport.favourite.addressHint'})}
                style={Object.assign({}, styles.rightCol, styles.input)}
                value={this.state.addressInput}
                onChange={(e) => { this.setState({addressInput: e.target.value}); }} />
            </div>
          }
          button={
            <ColoredButton
              label={'Add'}
              handleClick={this.handleAddFavouriteAddress.bind(this)}
              style={styles.addButton}
              />
          }
        />
        <Separator />
        <FavouriteAddressesWrapper>
          {this.renderFavouriteAddresses()}
        </FavouriteAddressesWrapper>

        <ConfirmMessage
          message={confirmTurnOffUseCurrentLocation}
          open={this.state.isShowConfirmMsg}
          noButton={formatMessage({ id: 'account.transport.confirmation.turnOffLocationMessage.noButton' })}
          noButtonStyle={{color: 'grey'}}
          yesButton={formatMessage({ id: 'account.transport.confirmation.turnOffLocationMessage.yesButton' })}
          yesButtonStyle={{color: 'red'}}
          handleClose={() => {
            this.setState({
              isShowConfirmMsg: false
            });
          }}
          handleYesBtn={this.handleTurnOffUseMyLocation.bind(this)}
        />

        <WarningMessage
          message={this.state.warningMsg}
          open={this.state.isShowWarningMsg}
          buttonstyle={styles.warningMsgButton}
          handleClose={() => {
            this.setState({
              isShowWarningMsg: false
            });
          }}
        />
      </ContainerWrapper>
    );
  }
}

TransportSettings.contextTypes = {
  router: PropTypes.object.isRequired
};

TransportSettings.propTypes = {
  user: PropTypes.object.isRequired,
  transport: PropTypes.object.isRequired,
  isUpdating: PropTypes.bool,
  onShowMessage: PropTypes.func,
  intl: intlShape.isRequired
};

const mapStateToProps = state => ({
  user: state.user,
  transport: state.transport
});

export default connect(mapStateToProps)(injectIntl(TransportSettings));
