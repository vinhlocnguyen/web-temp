import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { intlShape, injectIntl } from 'react-intl';
import TitleBar from '../UI/TitleBar';
import FeatureToggle from '../UI/FeatureToggle';
import ColoredButton from '../UI/ColoredButton';
import Checkbox from '../UI/Checkbox';
import Toggle from '../UI/Toggle';
import ListViewItem from '../UI/ListView/ListViewItem';
import FloatingButton from '../UI/ListView/FloatingButton';
import Separator from '../UI/ListView/Separator';
import { getAllCategories } from '../../../redux/actions/category';
import { resetError } from '../../../redux/actions/error';
import { Palette } from '../../theme';
import {
  CarwashIcon,
  ConciergerieIcon,
  FitnessIcon,
  FoodIcon,
  HairdresserIcon,
  HotelIcon,
  LaundryIcon
} from '../UI/Icons';
import { arrayClone } from '../../../redux/helpers/array';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import { ContentContainer } from '../styleUlti';

const iconCategoryMap = {
  'laundry': <LaundryIcon />,
  'hairdresser': <HairdresserIcon />,
  'fitness': <FitnessIcon />,
  'car wash': <CarwashIcon />,
  'conciergerie': <ConciergerieIcon />,
  'food and beverages': <FoodIcon />,
  'hotel': <HotelIcon />
}

export class Filter extends Component {
  constructor(props) {
    super(props);
    // import filters from reducers
    const existFilters = props.service.filters.length > 0;
    let isCheckedAll = true;
    let filters = existFilters ? this.props.category.list.map(item => {
      const temp = Object.assign({}, item);
      if (!this.props.service.filters.includes(temp.id)) {
        temp.isChecked = false;
      } else {
        temp.isChecked = true;
      }
      isCheckedAll = isCheckedAll && temp.isChecked;
      return temp;
    }) : this.props.category.list;

    isCheckedAll = existFilters ? isCheckedAll : this.props.service.isCheckedAll;

    filters = this.filterCategoriesHaveServiceS(filters);

    // If categories is initialized from another page, set checked to all.
    if (filters.length && filters[0].isChecked == undefined) {
      filters = filters.map(c => {
        c.isChecked = true;
        return c;
      });
    }
    this.state = {
      filters: this.mapIconToCategories(filters),
      filterAll: isCheckedAll,
      openNow: props.service.openNow,
      isShowError: false
    };

    this.handleReset = this.handleReset.bind(this);
    this.handleDone = this.handleDone.bind(this);
    this.handleCheckAll = this.handleCheckAll.bind(this);
    this.handleOpenNow = this.handleOpenNow.bind(this);
    this.handleCancle = this.handleCancle.bind(this);
    this.backupState = this.backupState.bind(this);
    this.handleCloseErrorMsg = this.handleCloseErrorMsg.bind(this);
    this.filterCategoriesHaveServiceS = this.filterCategoriesHaveServiceS.bind(this);
    this.backupState();
  }

  componentDidMount() {
		// get category list
		if (!this.props.category || !this.props.category.list.length) {
      this.props.getAllCategories().then(() => {
        let filters = this.props.category.list.map(c => {
          let cat = Object.assign({}, c);
          cat.isChecked = true;
          return cat;
        });
        filters = this.filterCategoriesHaveServiceS(filters);
        filters = this.mapIconToCategories(filters);
        this.setState({
          filters: filters
        });
        this.backupState();
      });
    }
	}

  filterCategoriesHaveServiceS(categories) {
    let result = [];
    let categoryIdsByServices = this.props.building.current.services.map(svc => {
      return svc.category;
    });
    result = categories.filter(cat => {
      return categoryIdsByServices.indexOf(cat.id) >= 0;
    });
    return result;
  }

  mapIconToCategories(categories){
    let result = categories.map(cat => {
      cat.icon = iconCategoryMap[cat.name.toLowerCase()];
      return cat;
    });
    return result;
  }

  backupState() {
    this.stateBk = Object.assign({}, this.state);
  }

  handleCheck(index, isChecked) {
    // check item at index
    const temp = arrayClone(this.state.filters);
    temp[index].isChecked = isChecked;
    this.setState({
      filters: temp,
      filterAll: false
    });
  }

  handleCheckAll(isChecked) {
    const temp = this.state.filters.map(item => {
      const copyItem = Object.assign({}, item);
      copyItem.isChecked = isChecked;
      return copyItem;
    });
    this.setState({
      filters: temp,
      filterAll: isChecked
    });
  }

  handleOpenNow(isChecked) {
    this.setState({
      openNow: isChecked
    });
  }

  handleReset() {
    this.handleCheckAll(true);
  }

  handleCancle(){
    this.state = Object.assign({}, this.stateBk);
    this.props.toggleFilter();
  }

  handleDone() {
    const checkedList = this.state.filters.filter(item => item.isChecked).map(item => item.id);

    // CheckedList should not empty
    if (!checkedList.length) {
      this.setState({
        isShowError: true
      });
      return;
    }

    const openNow = this.state.openNow;
    this.props.service.isCheckedAll = this.state.filterAll;
    this.props.onFinish(checkedList, openNow);
    this.backupState();
    this.props.toggleFilter();
  }

  handleCloseErrorMsg() {
    this.setState({
      isShowError: false
    });
  }

  renderList(list) {
    return list.map((item, index) =>
      <div key={index}>
        <ListViewItem
          content={<div style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
            <div style={{marginRight: 10}}>{item.icon}</div>
            <div>{item.name}</div>
          </div>}
          button={<Checkbox onCheck={this.handleCheck.bind(this, index)} checked={item.isChecked} />}
        />
        <Separator />
      </div>
    );
  }

  render() {
    const translateFilter = this.props.open ? 0 : 100;
    const translteContent = this.props.open ? -100 : 0;
    const components = this.renderList(this.state.filters);
    const {formatMessage} = this.props.intl;
    const filterIsEmptyErrorMsg = formatMessage({id: 'error.emptyFilter'});
    const styles = {
      container: {
        position: 'relative',
        display: 'flex',
        flexDirection: 'column'
      },
      contentWrapper: {
        transform: 'translateY(' + translteContent + '%)',
        transition: '0.5s',
        display: 'flex',
        flexDirection: 'column'
      },
      filterWrapper: {
        transform: 'translateY(' + translateFilter + '%)',
        transition: '0.5s',
        bottom: 0,
        left: 0,
        position: 'absolute',
        width: '100%',
        height: '100%'
      },
      filterItemsWrapper: {
        height: 'calc(100% - 250px)',
        overflow: 'auto'
      },
      navigatorButton: {
        width: '76px',
        height: '32px',
        margin: '0 14px'
      },
      button: {
        width: '50px',
        textAlign: 'center'
      },
      dialog: {
        color: Palette.alternateTextColor
      }
    };
    const actions = [
      <FlatButton
        label={formatMessage({id: 'dialog.close'})}
        labelStyle={styles.dialog}
        primary
        onTouchTap={this.handleCloseErrorMsg}
        style={styles.button}
      />
    ];
    return (
      <div className={'full-height'} style={styles.container}>
        <div className={'full-height'} style={styles.contentWrapper}>
          {this.props.children}
        </div>
        <div className={'full-height'} style={styles.filterWrapper}>
          <TitleBar
            title={'Filter'}
            leftButton={<ColoredButton
              handleClick={this.handleCancle}
              label={'Cancel'}
              style={styles.navigatorButton}
              noMargin
            />}
            rightButton={<ColoredButton
              handleClick={this.handleReset}
              label={'Reset'}
              style={styles.navigatorButton}
              noMargin
            />}
          />
          <ContentContainer>
          <FeatureToggle feature='feature_service_opening_closing_time'>
            <div>
              <ListViewItem
                style={{backgroundColor: '#ebeef0'}}
                content={'Open now'}
                button={<Toggle onCheck={this.handleOpenNow} checked={this.state.openNow} />}
              />
              <Separator />
            </div>
          </FeatureToggle>
          <ListViewItem
            content={'All'}
            button={<Checkbox onCheck={this.handleCheckAll} checked={this.state.filterAll} />}
          />
          <Separator />
          <div style={styles.filterItemsWrapper}>
            {components}
          </div>
          <FloatingButton
            label='done'
            onHandleClick={this.handleDone}
          />
          </ContentContainer>
        </div>
        <Dialog
          actions={actions}
          modal={false}
          open={this.state.isShowError}
          onRequestClose={this.handleCloseErrorMsg}
        >
          {filterIsEmptyErrorMsg}
        </Dialog>
      </div>
    );
  }
}

Filter.propTypes = {
  open: PropTypes.bool.isRequired,
  toggleFilter: PropTypes.func.isRequired,
  onFinish: PropTypes.func.isRequired,
  intl: intlShape.isRequired
};

const mapStateToProps = state => ({
  service: state.service,
  filters: state.filters,
  category: state.category,
  building: state.building
});

const mapDispatchToProps = {
	getAllCategories,
	resetError
};

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(Filter));
