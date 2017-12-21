import PropTypes from 'prop-types';
import React, { Component } from 'react';
import {intlShape, injectIntl} from 'react-intl';
import { connect } from 'react-redux';
import ColorBackground from '../Backgrounds/ColorBackground';
import TitleBar from '../UI/TitleBar';
import RoutedBackButton from '../RoutedBackButton';
import { getAllCategories } from '../../../redux/actions/category';
import {
  ListEditImage,
  ListEditText,
  ListEditRichText,
  ListEditSelector,
  ListEditPhoneNumber,
  FloatingButton,
  Separator
} from '../UI/ListView';
import Checkbox from '../UI/Checkbox';
import Snackbar from 'material-ui/Snackbar';
import CircularProgress from 'material-ui/CircularProgress';
import ErrorMessage from '../Features/ErrorMessage';
import { resetError } from '../../../redux/actions/error';
import { editService, getService } from '../../../redux/actions/service';
import { retrieveBuilding } from '../../../redux/actions/building';
import AdminWrapper from '../UI/AdminWrapper';
import BuildingOwnerWrapper from '../UI/BuildingOwnerWrapper';
import { media, ContentContainer } from '../styleUlti';
import styled from 'styled-components';

const Wrapper = styled.div`
  height: calc(100% - 60px);
  overflow: auto;
`;
const styles = {
  wrapper: {
    height: 'calc(100% - 60px)',
    overflow: 'auto'
  }
};

export class LiveEditPage extends Component {
  constructor(props) {
    super(props);
    const service = props.service.selected;
    this.state = {
      name: service.name,
      description: service.description,
      address: service.address,
      phoneNumber: service.phoneNumber,
      category: {id: service.category, name: ''},
      openingHour: service.openingHours && service.openingHours.from,
      closingHour: service.openingHours && service.openingHours.to,
      linkType: service.link && service.link.type,
      url: (service.link && service.link.url) || '',
      banner: undefined,
      thumbnail: undefined,
      isShowOnWork: service.isShowOnWork,
      isHideOnMap: service.isHideOnMap,
      error: null,
      isShowError: false,
      isShowNotification: false,
      isWaiting: false
    };

    // binding functions
    this.handleSave = this.handleSave.bind(this);
    this.handleRemoveBannerImg = this.handleRemoveBannerImg.bind(this);
    this.handleRemoveThumbnailImg = this.handleRemoveThumbnailImg.bind(this);
    this.parseServiceCategoryData = this.parseServiceCategoryData.bind(this);
  }

  componentDidMount() {
    if (Object.keys(this.props.service.selected).length === 0) {
      this.props.getService(this.props.match.params.id);
    }
    if (Object.keys(this.props.building.current).length === 0) {
      this.props.retrieveBuilding();
    }
    if (Object.keys(this.props.category.list).length === 0) {
      this.props.getAllCategories().then(() => {
        this.parseServiceCategoryData(this.props.category.list);
      });
    } else {
      this.parseServiceCategoryData(this.props.category.list);
    }
  }

  parseServiceCategoryData(categories){
    let catId = this.state.category.id
    let selectedCat = categories.filter(cat => {
      return cat.id == catId;
    })[0];

    this.setState({
      category: {
        name: selectedCat ? selectedCat.name : '',
        id: catId
      }
    });
  }

  checkErrors() {
    if (this.props.error) {
			this.setState({
				error: this.props.error.status,
				isShowError: true,
        isWaiting: false
			});
		}
  }

  handleChangeCategory(catName) {
    let catId = this.props.category.list.filter(cat => {
      return cat.name == catName;
    })[0].id;
    this.setState({
      category: {
        name: catName,
        id: catId
      }
    });
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

  handleSave() {
    const {
      name,
      description,
      phoneNumber,
      address,
      openingHour,
      closingHour,
      isShowOnWork,
      isHideOnMap,
      banner,
      thumbnail
    } = this.state;
    const category = this.state.category.id;
    const params = {
      name,
      description,
      phoneNumber,
      category,
      address,
      isShowOnWork,
      isHideOnMap,
      openingHours: {
        from: openingHour,
        to: closingHour
      },
      full: banner,
      thumbnail
    };

    if (this.state.linkType && this.state.url) {
      params.link = {
        type: this.state.linkType,
        url: this.state.url
      }
    }

    this.props.editService(this.props.match.params.id, params).then(_ => {
      this.checkErrors();
      let newState = {isWaiting: false};
      if (!this.props.error) {
        newState.isShowNotification = true;
      }
      this.setState(newState);
    });
    this.setState({
      isWaiting: true
    });
  }

  renderWaiting() {
    return this.state.isWaiting ? (
      <div className='loading'>
        <CircularProgress size={60} />
      </div>
    ) : null;
  }

  render() {
    const {formatMessage} = this.props.intl;
    const service = this.props.service.selected;
    return (
      <BuildingOwnerWrapper>
        <ColorBackground color='#ffffff'>
          <div className="full-height">
            <TitleBar
              title={this.state.name}
              leftButton={<RoutedBackButton />} />
            <Separator />
            <ContentContainer>
              <Wrapper>
                <ListEditText
                  title={formatMessage({id: 'service.edit.name'})}
                  value={this.state.name}
                  onChange={e => this.setState({name: e.target.value})}
                />
                <Separator />
                <ListEditRichText
                  title={formatMessage({id: 'service.edit.description'})}
                  value={this.state.description}
                  onChange={e => this.setState({description: e.target.value})}
                />
                <Separator />
                <ListEditText
                  title={formatMessage({id: 'service.edit.address'})}
                  value={this.state.address}
                  onChange={e => this.setState({address: e.target.value})}
                />
                <Separator />

                <Separator />
                <ListEditPhoneNumber
                  title={formatMessage({id: 'service.edit.phoneNumber'})}
                  value={this.state.phoneNumber}
                  onChange={value => this.setState({phoneNumber: value})}
                />
                <Separator />
                <ListEditSelector
                  items={this.props.category.list.map(cat => {return cat.name})}
                  title={formatMessage({id: 'service.edit.category'})}
                  selected={this.state.category.name}
                  onChange={cat => this.handleChangeCategory(cat)}
                />
                <Separator />
                <ListEditText
                  title={formatMessage({id: 'service.edit.openingHour'})}
                  value={this.state.openingHour}
                  onChange={e => this.setState({openingHour: e.target.value})}
                />
                <Separator />
                <ListEditText
                  title={formatMessage({id: 'service.edit.closingHour'})}
                  value={this.state.closingHour}
                  onChange={e => this.setState({closingHour: e.target.value})}
                />
                <Separator />
                <ListEditSelector
                  items={['Website', 'Menu'].map(item => {return item})}
                  title={formatMessage({id: 'service.edit.linkType'})}
                  selected={this.state.linkType}
                  onChange={type => this.setState({linkType: type})}
                />
                <ListEditText
                  title={formatMessage({id: 'service.edit.url'})}
                  value={this.state.url}
                  onChange={e => this.setState({url: e.target.value})}
                />
                <Separator/>
                <Checkbox
                  checked={this.state.isShowOnWork}
                  onCheck={e => this.setState({isShowOnWork: e})}
                  label={formatMessage({ id: 'service.edit.showOnWork' })}
                  labelStyle={{ color: '#666' }}
                />
                <Separator />
                <Checkbox
                  checked={this.state.isHideOnMap}
                  onCheck={e => this.setState({isHideOnMap: e})}
                  label={formatMessage({ id: 'service.edit.hideOnMap' })}
                  labelStyle={{ color: '#666' }}
                />
                <Separator />
                <ListEditImage
                  title={formatMessage({id: 'service.edit.banner'})}
                  image={this.state.banner || (service.image && service.image.full)}
                  onChange={value => this.setState({banner: value})}
                  onRemove={this.handleRemoveBannerImg}
                  placeholder={'450x180'}
                  />
                <ListEditImage
                  title={formatMessage({id: 'service.edit.thumbnail'})}
                  image={this.state.thumbnail || (service.image && service.image.thumbnail)}
                  onChange={value => this.setState({thumbnail: value})}
                  onRemove={this.handleRemoveThumbnailImg}
                  placeholder={'100x100'}
                  />
                <Separator/>
                <FloatingButton
                  label={formatMessage({id: 'button.save'})}
                  onHandleClick={this.handleSave} />

                {this.renderWaiting()}
                <Snackbar
                  open={this.state.isShowNotification}
                  message={formatMessage({id: 'service.edit.updatingSuccess'})}
                  autoHideDuration={1000}
                  onRequestClose={() => this.setState({ isShowNotification: false })}
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
                  }}
                />
              </Wrapper>
            </ContentContainer>
          </div>
        </ColorBackground>
      </BuildingOwnerWrapper>
    );
  }
}

LiveEditPage.fetchData = ({store, location, params, history}) => {
  const p1 = store.dispatch(getService(params.id));
  const p2 = store.dispatch(retrieveBuilding());
  return Promise.all([p1, p2]);
};

LiveEditPage.propTypes = {
  intl: intlShape.isRequired,
  service: PropTypes.object.isRequired,
  params: PropTypes.object,
  building: PropTypes.object.isRequired,
  error: PropTypes.object,
  getService: PropTypes.func.isRequired,
  editService: PropTypes.func.isRequired,
  resetError: PropTypes.func.isRequired,
  retrieveBuilding: PropTypes.func.isRequired
};

const mapDispatchToProps = {
  resetError,
  editService,
  getService,
  retrieveBuilding,
  getAllCategories
};

const mapStateToProps = state => ({
  service: state.service,
  building: state.building,
  category: state.category,
  error: state.error
});

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(LiveEditPage));
