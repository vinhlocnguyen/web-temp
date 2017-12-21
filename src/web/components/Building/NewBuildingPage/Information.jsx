import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { injectIntl, intlShape } from 'react-intl';
import TextField from '../../UI/TextField';
import ImageField from '../../UI/ImageField';
import SelectField from '../../UI/SelectField';
import SelectItem from '../../UI/SelectItem';
import Checkbox from '../../UI/Checkbox';
import ListEditPhoneNumber from '../../UI/ListView/ListEditPhoneNumber';
import { suggestCountry, suggestCity } from '../../../../redux/actions/suggestion';

const styles = {
  stepContainer: {
    display: 'flex',
    flexDirection: 'column',
    padding: '20px 0'
  },
  stepTitle: {
    color: '#0e81a7',
    fontWeight: 'bold',
    fontFamily: 'Montserrat',
    textAlign: 'center'
  },
  inputPhone: {
    marginTop: 12,
    marginBottom: 5,
    color: 'rgba(169, 169, 169, 0.6)',
    fontSize: 14,
    fontFamily: 'Montserrat'
  },
  checkboxField: {
    'margin-top': '15px'
  },
  checkboxLabel: {
    color: '#22b1d7'
  },
};
class Information extends Component {
  // handleOnChangeCity(value) {
  //   this.props.suggestCity(value);
  //   this.props.onHandleChange('address.city', value);
  // }
  //
  // handleOnChangeCountry(value) {
  //   this.props.suggestCountry(value);
  //   this.props.onHandleChange('address.country', value);
  // }

  render() {
    const formatMessage = this.props.intl.formatMessage;
    const building = this.props.building;
    const region = [
      {
        value: 'fr-idf',
        label: 'France'
      },
      {
        value: 'be',
        label: 'Belgium'
      },
      {
        value: 'lu',
        label: 'Luxembourg'
      }
    ];
    const selectItems = region.map((item, index) => (
      <SelectItem key={index} value={item}>{item.label}</SelectItem>
    ));
    return (
      <div style={styles.stepContainer}>
        <div style={styles.stepTitle}>
          {formatMessage({id: 'newbuilding.information.title'})}
        </div>
        <TextField
          label='Buiding name'
          value={building.name.value}
          onChange={this.props.onHandleChange.bind(this, 'name')}
          errorText={building.name.error}
        />
        <TextField
          label='address'
          value={building.address.value}
          onChange={this.props.onHandleChange.bind(this, 'address')}
          errorText={building.address.error}
        />
        {/* <AutoComplete
          label='country'
          value={building.address.country.value}
          onChange={this.handleOnChangeCountry.bind(this)}
          source={this.props.suggestion.countries}
          errorText={building.address.country.error}
        /> */}
        <SelectField
          label='region'
          selected={building.region.label}
          onChange={this.props.onHandleChange.bind(this, 'region')}
          errorText={building.region.error}
          >{selectItems}</SelectField>
        <TextField
          label='concierge-email'
          value={building.conciergeEmail.value}
          onChange={this.props.onHandleChange.bind(this, 'conciergeEmail')}
          errorText={building.conciergeEmail.error}
        />
        <ListEditPhoneNumber
          style={{padding: 0, background: 'transparent'}}
          title='concierge-phone'
          titleStyle={styles.inputPhone}
          defaultCountry={'fr'}
          value={building.conciergePhone.value}
          onChange={this.props.onHandleChange.bind(this, 'conciergePhone')}
        />
        <Checkbox
          style={styles.checkboxField}
          checked={building.hasMeetingRooms}
          onCheck={this.props.onHandleChange.bind(this, 'hasMeetingRooms')}
          labelStyle={styles.checkboxLabel}
          label={formatMessage({id: 'buildingInfo.hasMeetingRoom'})}
        />
        <Checkbox
          style={styles.checkboxField}
          labelStyle={styles.checkboxLabel}
          checked={building.isActive}
          onCheck={this.props.onHandleChange.bind(this, 'activeBuilding')}
          label={formatMessage({id: 'buildingInfo.isActive'})}
        />
        <ImageField
          label={formatMessage({id: 'buildingInfo.banner'})}
          onChange={this.props.onHandleChange.bind(this, 'image')}
          value={building.image.value}
        />
        <ImageField
          label={formatMessage({id: 'buildingInfo.owner'})}
          onChange={this.props.onHandleChange.bind(this, 'ownerImage')}
          value={building.ownerImage.value}
        />
      </div>
    );
  }
}

Information.propTypes = {
  building: PropTypes.object.isRequired,
  onHandleChange: PropTypes.func.isRequired,
  intl: intlShape.isRequired
};

const mapStateToProps = state => ({
  suggestion: state.suggestion
});

const mapDispatchToProps = {
  suggestCountry,
  suggestCity
};

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(Information));
