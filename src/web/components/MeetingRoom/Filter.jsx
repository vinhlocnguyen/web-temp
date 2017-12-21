import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage, intlShape, injectIntl } from 'react-intl';
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
  CapacityIcon,
  CateringIcon
} from '../UI/Icons';
import { arrayClone } from '../../../redux/helpers/array';
import { setFilter as setMeetingRoomFilter } from '../../../redux/actions/meetingRoom';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import SliderItem from '../UI/SliderItem';

export class Filter extends Component {
  constructor(props) {
    super(props);
    this.state = {
      openNow: props.service.openNow,
      cateringIncluded: false,
      isShowError: false,
      capacity: 2
    };

    this.handleReset = this.handleReset.bind(this);
    this.handleDone = this.handleDone.bind(this);
    this.handleOpenNow = this.handleOpenNow.bind(this);
    this.handleCancle = this.handleCancle.bind(this);
    this.handleCloseErrorMsg = this.handleCloseErrorMsg.bind(this);
    this.handleSliderChange = this.handleSliderChange.bind(this);
    this.backupState = this.backupState.bind(this);
  }

  componentDidMount() {
    this.backupState();
	}

  backupState() {
    this.stateBk = Object.assign({}, this.state);
  }

  handleCheck(isChecked) {
    this.setState({
      cateringIncluded: isChecked
    });
  }

  handleSliderChange(event, value) {
    this.setState({
      capacity: value
    });
  }

  handleOpenNow(isChecked) {
    this.setState({
      openNow: isChecked
    });
  }

  handleReset() {
    this.setState(this.stateBk);
  }

  handleCancle(){
    this.setState(this.stateBk);
    this.props.toggleFilter();
  }

  handleDone() {
    const openNow = this.state.openNow;
    const condition = {
      isOpenNow: this.state.openNow,
      capacity: this.state.capacity,
      isCateringIncluded: this.state.cateringIncluded
    }
    this.props.setMeetingRoomFilter(condition);
    this.props.onFinish(condition);
    this.backupState();
    this.props.toggleFilter();
  }

  handleCloseErrorMsg() {
    this.setState({
      isShowError: false
    });
  }

  render() {
    const translateFilter = this.props.open ? 0 : 100;
    const translteContent = this.props.open ? -100 : 0;
    // const components = this.renderList(this.state.filters);
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
      },
      cateingCheckBox: {
        marginTop: '50px'
      },
      sliderWrapper: {
        display: 'flex',
        flexDirection: 'column',
        flexGrow: '2'
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

          <div style={styles.filterItemsWrapper}>
            {/* components */}
            <div>
              <ListViewItem
                content={<div style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
                  <div style={{marginRight: 10}}><CapacityIcon /></div>
                  <div>{formatMessage({id: 'meetingRoomEditPage.capacity'})}</div>
                </div>}>

                <span style={styles.sliderWrapper}>
                  <SliderItem step={1} onChange={this.handleSliderChange}
                    value={this.state.capacity} min={2} max={50} />
                </span>
              </ListViewItem>
              <Separator />
            </div>

            <div>
              <ListViewItem
                content={<div style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
                  <div style={{marginRight: 10}}><CateringIcon /></div>
                  <div>{formatMessage({id: 'meetingRoomInfo.catering_included'})}</div>
                </div>}
                button={<Checkbox onCheck={this.handleCheck.bind(this)} checked={this.state.cateringIncluded} />}
              />
            </div>
          </div>
          <FloatingButton
            label={formatMessage({id: 'meetingRoomPage.button.done'})}
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
  resetError,
  setMeetingRoomFilter
};

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(Filter));
