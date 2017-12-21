import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage, injectIntl, intlShape } from 'react-intl';
import { createService } from '../../../redux/actions/service';
import ColorBackground from '../Backgrounds/ColorBackground';
import TitleBar from '../UI/TitleBar';
import RoutedBackButton from '../RoutedBackButton';
require('../../assets/styles/form.scss');
import ListViewItem from '../UI/ListView/ListViewItem';
import AdminWrapper from '../UI/AdminWrapper';
import BuildingOwnerWrapper from '../UI/BuildingOwnerWrapper';
import SelectField from '../UI/SelectField';
import SelectItem from '../UI/SelectItem';
import TextField from '../UI/TextField';
import ImageField from '../UI/ImageField';
import BorderButton from '../UI/BorderButton';
import ListEditPhoneNumber from '../UI/ListView/ListEditPhoneNumber';
import Checkbox from '../UI/Checkbox';
import update from 'react-addons-update';
import validation from '../../../redux/helpers/validation';
import { getAllCategories } from '../../../redux/actions/category';
import ErrorMessage from '../Features/ErrorMessage';
import { resetError } from '../../../redux/actions/error';
import CircularProgress from 'material-ui/CircularProgress';

const styles = {
  container: {
    overflow: 'auto',
    margin: '0 10px 0 10px',
    backgroundColor: '#FFFFFF',
    padding: '0px 10px'
  },
  title: {
    color: '#34b1d7',
    margin: '10px 20px 0',
    fontFamily: 'Montserrat',
    fontSize: 16
  },
  newService: {
    backgroundColor: '#ffffff'
  },
}

export class CreateServicePage extends Component {
  constructor(props) {
    super(props);
    const emptyService = this.initEmptyService(props);
    this.state = Object.assign({
      error: null,
      isShowError: false,
      isWaiting: false,
    }, emptyService);

    this.validateService = this.validateService.bind(this);
    this.handleCreateService = this.handleCreateService.bind(this);
    this.handleRemoveBannerImg = this.handleRemoveBannerImg.bind(this);
    this.handleRemoveThumbnailImg = this.handleRemoveThumbnailImg.bind(this);
    this.handleShowOnWorkChange = this.handleShowOnWorkChange.bind(this);
    this.handleHideOnMapChange = this.handleHideOnMapChange.bind(this);
  }

  componentDidMount(){
    if (!Object.keys(this.props.category.list).length) {
      this.props.getAllCategories();
    }

    this.setState({
      isShowBannerImgRemoveBtn: this.state.banner ? true : false,
      isShowFullImgRemoveBtn: this.state.full ? true : false,
    });
  }

  initEmptyService (props) {
    return {
      name: {
        value: '',
        error: ''
      },
      description: '',
      category: {
        label: '',
        value: '',
        error: ''
      },
      address: {
        value: '',
        error: ''
      },
      openingHour: {
        value: '',
        error: ''
      },
      closingHour: {
        value: '',
        error: ''
      },
      phoneNumber: '',
      banner: undefined,
      thumbnail: undefined,
      linkType: {
        value: '',
        error: ''
      },
      url: {
        value: '',
        error: ''
      },
      isShowOnWork: props.match.params.type && props.match.params.type === 'work',
      isHideOnMap: false
    };
    // this.refs.phoneNumber.resetNumber();
  }

  handleRemoveBannerImg() {
    this.setState({
      banner: ''
    });
  }

  handleRemoveThumbnailImg() {
    this.setState({
      thumbnail: ''
    });
  }

  handleShowOnWorkChange(isChecked) {
    this.setState({
      isShowOnWork: isChecked
    });
  }

  handleHideOnMapChange(isChecked) {
    this.setState({
      isHideOnMap: isChecked
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

  validateService() {
    const {
      name, description,
      category, address,
      openingHour, closingHour,
      url, linkType
    } = this.state;
    // check validation
    const validName = validation.isRequired(name.value);
    const validCategory = validation.isRequired(category.value);
    const validAddress = validation.isRequired(address.value);
    const validUrl = validation.url(url.value);
    let validOpeningHour = {valid: true};
    let validClosingHour = { valid: true };
    let validLinkType = {valid: true}
    if (openingHour.value) {
      const tempValidation = validation.openingTime(openingHour.value);
      if (!tempValidation.valid) validOpeningHour = tempValidation;
    }
    if (closingHour.value) {
      const tempValidation = validation.openingTime(closingHour.value);
      if (!tempValidation.valid) validClosingHour = tempValidation;
    }
    const validBondOpeningClosingTime = validation.bond(openingHour.value, closingHour.value);
    if (!validBondOpeningClosingTime.valid) {
      validOpeningHour = validBondOpeningClosingTime;
      validClosingHour = validBondOpeningClosingTime;
    }

    if (url.value && !linkType.value) {
      linkType.error = 'Please choose type of link.';
      validLinkType.valid = false;
    }
    // set errors
    const newState = {};
    newState.name = update(name, {error: {$set: validName.error}});
    newState.category = update(category, {error: {$set: validCategory.error}});
    // newState.address = update(address, {error: {$set: validAddress.error}});
    newState.openingHour = update(openingHour, {error: {$set: validOpeningHour.error}});
    newState.closingHour = update(closingHour, { error: { $set: validClosingHour.error } });
    newState.url = update(url, { error: { $set: validUrl.error } });
    this.setState(newState);
    const isValid = validName.valid && validCategory.valid && validUrl.valid && validLinkType.valid && 
      (!openingHour.value || validOpeningHour.valid) && (!closingHour.value || validClosingHour.valid);
    return isValid;
  }

  handleCreateService() {
    if (this.validateService()) {
      const {
        name, description,
        category, address,
        openingHour, closingHour,
        phoneNumber, banner, thumbnail,
        linkType, url, isShowOnWork, isHideOnMap
      } = this.state;
      const params = {
        name: name.value,
        description: description.length > 0 ? description : undefined,
        category: category.value,
        address: address.value,
        phoneNumber: phoneNumber.length > 3 ? phoneNumber : undefined,
        openingHours: {
          from: openingHour.value.length > 0 ? openingHour.value : undefined,
          to: closingHour.value.length > 0 ? closingHour.value : undefined
        },
        isShowOnWork: isShowOnWork,
        isHideOnMap: isHideOnMap,
        full: banner,
        thumbnail: thumbnail
      };

      if (linkType.value && url.value) {
        params.link = {
          type: linkType.value,
          url: url.value
        }
      }

      this.props.createService(params).then(_ => {
        this.checkErrors();
        let newState = { isWaiting: false };
        if (this.props.error) {
          newState.isShowError = true;
        }
        this.setState(newState);
        if (!this.props.error) {
          this.context.router.history.goBack();
        }
      });
      this.setState({
        isWaiting: true
      });
    }
  }

  renderCategories() {
    return this.props.category.list.map((item, index) => (
      <SelectItem key={index} value={item}>{item.name}</SelectItem>
    ));
  }

  renderWaiting() {
    return this.state.isWaiting
      ? (
        <div className='loading'>
          <CircularProgress size={60} />
        </div>
      )
      : null;
  }

  render() {
    const { formatMessage } = this.props.intl;
    const categories = this.renderCategories();
    const linkTypes = ['Website', 'Menu'].map((item, index) => {
      return <SelectItem key={index} value={item}>{item}</SelectItem>
    });
    return (
      <BuildingOwnerWrapper>
        <ColorBackground color='#eceff1'>
          <TitleBar
            title={formatMessage({id: 'createService.title'})}
            leftButton={<RoutedBackButton />} />
          <div style={styles.container}>
            <div style={styles.newService}>
              <div style={styles.newForm}>
                <TextField
                  label={formatMessage({id: 'service.edit.name'})}
                  value={this.state.name.value}
                  onChange={e => this.setState({name: update(this.state.name, {value: {$set: e.target.value}})})}
                  errorText={this.state.name.error}
                />
                <TextField
                  label={formatMessage({id: 'service.edit.address'})}
                  value={this.state.address.value}
                  onChange={e => this.setState({address: update(this.state.address, {value: {$set: e.target.value}})})}
                  errorText={this.state.address.error}
                />
                <TextField
                  label={formatMessage({id: 'service.edit.description'})}
                  value={this.state.description}
                  onChange={e => this.setState({description: e.target.value})}
                />
                <SelectField
                  label={formatMessage({id: 'service.edit.category'})}
                  selected={this.state.category.label}
                  onChange={cat => this.setState({category: update(this.state.category, {value: {$set: cat.id}, label: {$set: cat.name}})})}
                  errorText={this.state.category.error}
                >
                  {categories}
                </SelectField>
                <TextField
                  label={formatMessage({id: 'service.edit.openingHour'})}
                  value={this.state.openingHour.value}
                  onChange={e => this.setState({openingHour: update(this.state.openingHour, {value: {$set: e.target.value}})})}
                  errorText={this.state.openingHour.error}
                />
                <TextField
                  label={formatMessage({id: 'service.edit.closingHour'})}
                  value={this.state.closingHour.value}
                  onChange={e => this.setState({closingHour: update(this.state.closingHour, {value: {$set: e.target.value}})})}
                  errorText={this.state.closingHour.error}
                />
                <ListEditPhoneNumber
                  style={{padding: 0}}
                  title={formatMessage({id: 'service.edit.phoneNumber'})}
                  titleStyle={{display: 'none'}}
                  value={this.state.phoneNumber}
                  onChange={value => this.setState({phoneNumber: value})}
                />
                <SelectField
                  label={formatMessage({id: 'service.edit.linkType'})}
                  selected={this.state.linkType.value}
                  onChange={type => this.setState({ linkType: update(this.state.linkType, { value: { $set: type }, error: { $set: '' } }) })}
                  errorText={this.state.linkType.error}
                >
                {linkTypes}
                </SelectField>
                <TextField
                  label={formatMessage({id: 'service.edit.url'})}
                  value={this.state.url.value}
                  onChange={e => this.setState({ url: update(this.state.url, { value: { $set: e.target.value } }) })}
                  errorText={this.state.url.error}
                />
                <Checkbox
                  checked={this.state.isShowOnWork}
                  onCheck={e => this.handleShowOnWorkChange(e)}
                  label={formatMessage({id: 'service.edit.showOnWork'})}
                  labelStyle={{color: '#666'}}
                />
                <Checkbox
                  checked={this.state.isHideOnMap}
                  onCheck={e => this.handleHideOnMapChange(e)}
                  label={formatMessage({id: 'service.edit.hideOnMap'})}
                  labelStyle={{color: '#666'}}
                />
                <ImageField
                  label={formatMessage({id: 'service.edit.banner'})}
                  value={this.state.banner}
                  onChange={value => this.setState({banner: value})}
                  onRemove={this.handleRemoveBannerImg}
                  placeholder={'450x180'}
                />
                <ImageField
                  label={formatMessage({id: 'service.edit.thumbnail'})}
                  value={this.state.thumbnail}
                  onChange={value => this.setState({thumbnail: value})}
                  onRemove={this.handleRemoveThumbnailImg}
                  placeholder={'100x100'}
                />
                <BorderButton
                  label={formatMessage({id: 'button.save'})}
                  handleClick={this.handleCreateService}
                />
              </div>
            {this.renderWaiting()}
            <ErrorMessage
              error={this.state.error}
              open={this.state.isShowError}
              handleClose={() => {
                this.props.resetError();
                this.setState({
                  error: null,
                  isShowError: false
                });
              }}
            />
            </div>
          </div>
        </ColorBackground>
      </BuildingOwnerWrapper>
    );
  }
}

CreateServicePage.contextTypes = {
  router: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  service: state.service,
  error: state.error,
  category: state.category
});

const mapDispatchToProps = {
  createService,
  resetError,
  getAllCategories,
};

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(CreateServicePage));