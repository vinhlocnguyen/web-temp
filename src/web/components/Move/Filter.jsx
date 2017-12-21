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
import { resetError } from '../../../redux/actions/error';
import { Palette } from '../../theme';
import { arrayClone } from '../../../redux/helpers/array';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import {
  MVTaxiIcon,
  MVUberIcon,
  MVVelibIcon,
  MVAutolibIcon,
  MVPublicTransportIcon,
  MVTrafficIcon,
  MVAirportIcon,
  ClearLocationIcon
} from '../UI/Icons';


const IconMapping = {
  'taxi': <MVTaxiIcon />,
  'uber': <MVUberIcon />,
  'bikes': <MVVelibIcon />,
  'cars': <MVAutolibIcon />,
  'publicTransport': <MVPublicTransportIcon />,
  'liveTraffic': <MVTrafficIcon />,
  'airport': <MVAirportIcon />
};

export class Filter extends Component {
  constructor(props) {
    super(props);
    const [filters, isCheckedAll] = this.initFilterOptions(props);
    this.state = {
      filters: filters,
      filterAll: isCheckedAll,
      isShowError: false
    };

    this.handleReset = this.handleReset.bind(this);
    this.handleDone = this.handleDone.bind(this);
    this.handleCheckAll = this.handleCheckAll.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.backupState = this.backupState.bind(this);
    this.handleCloseErrorMsg = this.handleCloseErrorMsg.bind(this);
    this.backupState();
  }

  componentWillReceiveProps(nextProps) {
    const [filters, isCheckedAll] = this.initFilterOptions(nextProps);
    this.setState({
      filters: filters,
      filterAll: isCheckedAll,
      isCheckedAll: isCheckedAll
    });
  }

  initFilterOptions(props) {
    const publicTransports = props.transports;
    const existFilters = props.filters.length > 0;
    return existFilters 
      ? this.initFilteredTransports(publicTransports, props.filters, true) 
      : this.initDefaultTransports(publicTransports);
  }

  initFilteredTransports(transports, filters, isCheckedAll) {
    let types = transports.reduce((result, item) => {
      if (!result.includes(item.type)) {
        result.push(item.type);
      }
      return result;
    }, []).map(item => {
      const isChecked = filters.includes(item);
      isCheckedAll = isCheckedAll && isChecked;
      return {
        type: item,
        isChecked: isChecked
      }
    });

    return [this.mapIconToTransports(types), isCheckedAll];
  }
  
  initDefaultTransports(transports) {
    let types = transports.reduce((result, item) => {
      if (!result.includes(item.type)) {
        result.push(item.type);
      }
      return result;
    }, []).map(item => {
      return {
        type: item,
        isChecked: true
      }
    });

    return [this.mapIconToTransports(types), true];
  }

  mapIconToTransports(transports) {
    return transports.map(item => {
      let type;
      switch(item.type) {
        case 'taxi':
          type = 'taxi';
          break;
        case 'villo':
        case 'velo':
        case 'velib':
          type = 'bikes';
          break;
        default:
          type = 'publicTransport';
          break;
      }
      item.icon = IconMapping[type];
      return item;
    });
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

  handleReset() {
    this.handleCheckAll(true);
  }

  handleCancel(){
    this.state = Object.assign({}, this.stateBk);
    this.props.toggleFilter();
  }

  handleDone() {
    const checkedList = this.state.filters.filter(item => item.isChecked).map(item => item.type);

    // CheckedList should not empty
    if (!checkedList.length) {
      this.setState({
        isShowError: true
      });
      return;
    }

    this.props.onFinish(checkedList);
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
            <div>{item.type}</div>
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
        height: 'calc(100% - 165px)',
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
              handleClick={this.handleCancel}
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
  user: PropTypes.object.isRequired,
  transports: PropTypes.array.isRequired,
  filters: PropTypes.array,
  intl: intlShape.isRequired
};

const mapStateToProps = state => ({
  user: state.user,
  transport: state.transport
});

export default connect(mapStateToProps)(injectIntl(Filter));
