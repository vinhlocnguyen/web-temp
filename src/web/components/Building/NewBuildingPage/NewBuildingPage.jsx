import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { intlShape, injectIntl } from 'react-intl';
import update from 'react-addons-update';
import Stepper from '../../UI/Stepper';
import ColorBackground from '../../Backgrounds/ColorBackground';
import Information from './Information';
import NearByStops from './NearByStops';
import TitleBar from '../../UI/TitleBar';
import RoutedBackButton from '../../RoutedBackButton';
import { findNearbyStops, createBuilding } from '../../../../redux/actions/building';
import validation from '../../../../redux/helpers/validation';
import FeatureToggle from '../../UI/FeatureToggle';
import ErrorMessage from '../../Features/ErrorMessage';
import { resetError } from '../../../../redux/actions/error';
import AdminWrapper from '../../UI/AdminWrapper';
import CircularProgress from 'material-ui/CircularProgress';
import Snackbar from 'material-ui/Snackbar';

class NewBuildingPage extends Component {
  constructor() {
    super();
    // initialize state
    this.state = {
      stepIndex: 0,
      action: 'next',
      building: {
        name: {
          value: '',
          error: ''
        },
        address: {
          value: '',
          requestedValue: '',
          error: ''
        },
        conciergeEmail: {
          value: '',
          error: ''
        },
        conciergePhone: {
          value: '',
          error: ''
        },
        region: {
          value: '',
          label: '',
          error: ''
        },
        image: {
          value: undefined,
          preview: ''
        },
        ownerImage: {
          value: undefined,
          preview: ''
        },
        hasMeetingRooms: false,
        isActive: false
      },
      nearByStops: [],
      isWaiting: false,
      error: null,
			isShowError: false,
      isShowNotification: false
    };
    // binding functions
    this.handleNextStep = this.handleNextStep.bind(this);
    this.handlePreviousStep = this.handlePreviousStep.bind(this);
    this.handleFinish = this.handleFinish.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.doFindNearbyStops = this.doFindNearbyStops.bind(this);
  }

  checkErrors() {
		if (this.props.error) {
			this.setState({
				error: this.props.error.status,
				isShowError: true
			});
		}
  }
  
  doFindNearbyStops(region, address, distance, cb) {
    this.setState({
      isWaiting: true
    });

    this.props.findNearbyStops(
      region,
      address
    ).then(_ => {
      this.checkErrors();
      this.setState({
        isWaiting: false
      });
      cb && cb();
    });
  }

  handleNextStep() {
    if (this.state.stepIndex === 0) {
      if (this.validateStepOne()) {
        const { address, requestedValue, region } = this.state.building;
        if (address !== requestedValue) {
          this.setState({
            address: {
              address,
              requestedValue: address
            }
          });
          const cb = function () {
            this.setState({
              isWaiting: false,
              stepIndex: this.state.stepIndex + 1,
              action: 'next'
            });
          }.bind(this);
          this.doFindNearbyStops(region.value, address.value, null, cb);
        } else {
          this.setState({
            stepIndex: this.state.stepIndex + 1,
            action: 'next'
          });
        }
      }
    } else {
      this.setState({
        stepIndex: this.state.stepIndex + 1,
        action: 'next'
      });
    }
  }

  handlePreviousStep() {
    this.setState({
      stepIndex: this.state.stepIndex - 1,
      action: 'previous'
    });
  }

  handleFinish() {
    const { name, address, conciergePhone, conciergeEmail, region, ownerImage, image, hasMeetingRooms, isActive } = this.state.building;
    const buildingParams = {
      name: name.value,
      address: address.value,
      concierge: {
        email: conciergeEmail.value,
        phone: conciergePhone.value
      },
      nearbyStops: this.state.nearByStops,
      region: region.value,
      ownerImage: ownerImage.value,
      image: image.value,
      hasMeetingRooms: hasMeetingRooms,
      isActive
    };
    this.setState({
      isWaiting: true
    });

    this.props.createBuilding(buildingParams).then(_ => {
      this.checkErrors();
      let newState = {isWaiting: false};
      if (!this.props.error) {
        newState.isShowNotification = true;
      }
      this.setState(newState);
    });
  }

  handleChange(field, e) {
    switch (field) {
      case 'name':
        return this.setState({building: update(this.state.building, {name: {
          value: {$set: e.target.value}, error: {$set: ''}
        }})});
      case 'address':
        return this.setState({building: update(this.state.building, {address: {
          value: {$set: e.target.value}, error: {$set: ''}
        }})});
      case 'conciergeEmail':
        return this.setState({building: update(this.state.building, {conciergeEmail: {
          value: {$set: e.target.value}, error: {$set: ''}
        }})});
      case 'conciergePhone':
        return this.setState({building: update(this.state.building, {conciergePhone: {
          value: {$set: e}, error: {$set: ''}
        }})});
      case 'region':
        return this.setState({building: update(this.state.building, {region: {$set: e}, error: {$set: ''}
        })});
      case 'image':
        return this.setState({building: update(this.state.building, {image: {
          value: {$set: e}, error: {$set: ''}
        }})});
      case 'ownerImage':
        return this.setState({building: update(this.state.building, {ownerImage: {
          value: {$set: e}, error: {$set: ''}
        }})});
      case 'nearByStops.remove':
        const removedStops = this.handleRemoveStop(e, this.state.nearByStops);
        return this.setState({nearByStops: removedStops});
      case 'nearByStops.add':
        const addedStops = this.state.nearByStops.concat(e);
        return this.setState({nearByStops: addedStops});
      case 'hasMeetingRooms':
        return this.setState({ building: update(this.state.building, { hasMeetingRooms: { $set: e } }) });
      case 'ActiveBuilding':
        return this.setState({building: update(this.state.building, {isActive: {$set: e}})});
    }
  }

  handleRemoveStop(e, stops) {
    if (e.stopType.toLowerCase() === 'taxi') {
      return this.state.nearByStops.filter(item => !(item.name === e.name && item.stopType === e.stopType));
    } else {
      return this.state.nearByStops.filter(item => !(item.stopType === e.stopType && e.coord[0] === item.coord[0] && e.coord[1] === item.coord[1]));
    }
  }

  validateStepOne() {
    const { building } = this.state;
    const validName = Object.assign(validation.name(building.name.value), validation.isRequired(building.name.value));
    const validEmail = validation.email(building.conciergeEmail.value, true);
    const validRegion = validation.isRequired(building.region.value);
    const validAddress = validation.isRequired(building.address.value);
    const validPhone = validation.phone(building.conciergePhone.value);
    this.setState({
      building: update(building, {
        name: {
          error: {$set: validName.error}
        },
        address: {
          error: {$set: validAddress.error}
        },
        conciergeEmail: {
          error: {$set: validEmail.error}
        },
        conciergePhone: {
          error: {$set: validPhone.error}
        },
        region: {
          error: {$set: validRegion.error}
        }
      })
    });
    return (validName.valid && validPhone && validEmail.valid && validRegion.valid && validAddress.valid);
  }

  renderWaiting() {
    return this.state.isWaiting ? (
      <div className='loading'>
        <CircularProgress size={60} />
      </div>
    ) : null;
  }

  render() {
    const step = this.state.stepIndex;
    const action = this.state.action;
    const { formatMessage } = this.props.intl;
    return (
      <FeatureToggle feature='feature_manage_buildings' isPage>
        <AdminWrapper>
          <ColorBackground color="#eceff1">
            <TitleBar
              title={'New Building'}
              leftButton={<RoutedBackButton/>}
            />
            <div className='page' style={{height: 'calc(100% - 66px)'}}>
              <Stepper
                stepIndex={step}
                action={action}
                next={this.handleNextStep}
                previous={this.handlePreviousStep}
                onFinish={this.handleFinish}
                >
                <Information
                  building={this.state.building}
                  onHandleChange={this.handleChange}
                />
                <NearByStops
                  address={this.state.building.address.value}
                  region={this.state.building.region.value}
                  nearByStops={this.state.nearByStops}
                  onHandleChange={this.handleChange}
                  doFindNearbyStops={this.doFindNearbyStops}
                />
              </Stepper>
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
              <Snackbar
                open={this.state.isShowNotification}
                message={formatMessage({id: 'newbuilding.creationSuccess'})}
                autoHideDuration={2000}
                onRequestClose={() => {
                  this.setState({ isShowNotification: false });
                }}
              />
              {this.renderWaiting()}
            </div>
          </ColorBackground>
        </AdminWrapper>
      </FeatureToggle>
    );
  }
}
NewBuildingPage.contextTypes = {
  router: PropTypes.object.isRequired
};

NewBuildingPage.propTypes = {
  intl: intlShape.isRequired,
  resetError: PropTypes.func,
  createBuilding: PropTypes.func,
  findNearbyStops: PropTypes.func,
  building: PropTypes.object,
  error: PropTypes.object
};

const mapStateToProps = state => ({
  building: state.building,
  error: state.error
});

const mapDispatchToProps = {
  findNearbyStops,
  createBuilding,
  resetError
};

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(NewBuildingPage));
