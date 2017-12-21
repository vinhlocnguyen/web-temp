import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { FormattedMessage, injectIntl, intlShape } from 'react-intl';
import { withRouter } from 'react-router-dom';
import TextField from '../UI/TextField';
import AutoSaveTextField from '../UI/AutoSaveTextField';
import SelectField from '../UI/SelectField';
import SelectItem from '../UI/SelectItem';
import { ListViewItem, FloatingButton, Separator } from '../UI/ListView';
import Validation from '../../../redux/helpers/validation';
import PushButton from '../UI/PushButton';
import { SaveIcon } from '../UI/Icons';

import ReactGA from 'react-ga';

const styles = {
  phoneWrapper: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  editButton: {
    width: '150px',
    height: '30px',
    borderRadius: '2px',
    backgroundColor: '#0c78be',
    color: '#ffffff'
  },
  wrapperContent: {
    overflow: 'auto',
    height: 'calc(100% - 154px)'
  }
};

class PersonalSettings extends Component {
  constructor(props) {
    super(props);

    //languages list
    this.languages = [{
        value: 'en',
        label: 'English'
      }, {
        value: 'fr',
        label: 'French'
      }, {
        value: 'nl',
        label: 'Dutch'
      }
    ];

    //page state
    const user = props.user.info;
    const phoneNumber = props.user.phoneNumber;
    this.state = {
      firstName: {
        value: user.firstName,
        valid: true,
        error: null,
        isChanged: false
      },
      lastName: {
        value: user.lastName,
        valid: true,
        error: null,
        isChanged: false
      },
      email: {
        value: user.email,
        valid: true,
        error: null,
        isChanged: false
      },
      workEmail: {
        value: user.workEmail,
        valid: true,
        error: null,
        isChanged: false
      },
      phone: {
        value: phoneNumber.number && phoneNumber.isVerified ? phoneNumber.number : user.phone,
        valid: true,
        error: null
      },
      language: {
        value: user.language,
        label: user.language && this.languages.find(item => item.value === user.language).label
      }
    };
    //bind this to function
    this.handleFirstName = this.handleFirstName.bind(this);
    this.handleLastName = this.handleLastName.bind(this);
    this.handleEmail = this.handleEmail.bind(this);
    this.handleWorkEmail = this.handleWorkEmail.bind(this);
    this.handleLanguage = this.handleLanguage.bind(this);
    this.handleSave = this.handleSave.bind(this);
    this.handleBLurFirstName = this.handleBLurFirstName.bind(this);
    this.handleBLurLastName = this.handleBLurLastName.bind(this);
    this.handleBlurEmail = this.handleBlurEmail.bind(this);
    this.handleBlurWorkEmail = this.handleBlurWorkEmail.bind(this);
  }

  handleValidate() {
    return (this.state.firstName.valid && this.state.lastName.valid && this.state.email.valid && this.state.workEmail.valid && this.state.phone.valid);
  }

  handleFirstName(e) {
    const validateName = Validation.name(e.target.value);
    this.setState({
      firstName: {
        value: e.target.value,
        valid: validateName.valid,
        error: validateName.error,
        isChanged: true
      }
    });
  }

  handleBLurFirstName(e) {
    if (this.state.firstName.valid && this.state.firstName.isChanged) {
      const params = {
        firstName: this.state.firstName.value
      }
      this.handleSave(params);
      this.setState({
        firstName: {
          isChanged: false
        }
      });
    }
  }

  handleLastName(e) {
    const validateName = Validation.name(e.target.value);
    this.setState({
      lastName: {
        value: e.target.value,
        valid: validateName.valid,
        error: validateName.error,
        isChanged: true
      }
    });
  }

  handleBLurLastName(e) {
    if (this.state.lastName.valid && this.state.lastName.isChanged) {
      const params = {
        lastName: this.state.lastName.value
      }
      this.handleSave(params);
      this.setState({
        lastName: {
          isChanged: false
        }
      });
    }
  }

  handleEmail(e) {
    const validateEmail = Validation.email(e.target.value);
    this.setState({
      email: {
        value: e.target.value,
        valid: validateEmail.valid,
        error: validateEmail.error,
        isChanged: true
      }
    });
  }

  handleBlurEmail(e) {
    if (this.state.email.valid && this.state.email.isChanged) {
      const params = {
        privateEmail: this.state.email.value
      }
      this.handleSave(params);
      this.setState({
        email: {
          isChanged: false
        }
      });
    }
  }

  handleWorkEmail(e) {
    const validateEmail = Validation.email(e.target.value);
    this.setState({
      workEmail: {
        value: e.target.value,
        valid: validateEmail.valid,
        error: validateEmail.error,
        isChanged: true
      }
    });
  }

  handleBlurWorkEmail(e) {
    if (this.state.workEmail.valid && this.state.workEmail.isChanged) {
      const params = {
        workEmail: this.state.workEmail.value
      }
      this.handleSave(params);
      this.setState({
        workEmail: {
          isChanged: false
        }
      });
    }
  }

  handleLanguage(value) {
    this.setState({
      language: {
        value: value,
        label: this.languages.find(item => item.value === value).label
      }
    });
    this.handleSave({language: value});
  }

  handleSave(params) {
    this.props.onUpdateUser(params);
    ReactGA.event({
      category: 'Settings',
      action: 'Save settings',
      label: 'Personal settings'
    });
  }

  render() {
    const { formatMessage } = this.props.intl;
    const languages = this.languages.map((item, index) =>
      <SelectItem key={index} value={item.value}>{item.label}</SelectItem>
    );

    return (
      <div style={styles.wrapperContent}>
        <ListViewItem
          title={formatMessage({id: 'account.personal.firstName'})}
          content={
            <AutoSaveTextField
              label={formatMessage({id: 'account.personal.firstName_example'})}
              errorText={this.state.firstName.error}
              value={this.state.firstName.value}
              onChange={this.handleFirstName}
              onBlur={this.handleBLurFirstName}
              noMargin
              />
          }
        />
        <ListViewItem
          title={formatMessage({id: 'account.personal.lastName'})}
          content={
            <AutoSaveTextField
              label={formatMessage({id: 'account.personal.lastName_example'})}
              errorText={this.state.lastName.error}
              value={this.state.lastName.value}
              onChange={this.handleLastName}
              onBlur={this.handleBLurLastName}
              noMargin
              />
          }
        />
        <Separator/>
        <ListViewItem
          title={formatMessage({id: 'account.personal.email'})}
          content={
            <AutoSaveTextField
              label={formatMessage({id: 'account.personal.email_example'})}
              errorText={this.state.email.error}
              value={this.state.email.value}
              onChange={this.handleEmail}
              onBlur={this.handleBlurEmail}
              noMargin
              />
          }
        />
        <ListViewItem
          title={formatMessage({id: 'account.personal.workEmail'})}
          content={
            <AutoSaveTextField
              label={formatMessage({id: 'account.personal.workEmail_example'})}
              errorText={this.state.workEmail.error}
              value={this.state.workEmail.value}
              onChange={this.handleWorkEmail}
              onBlur={this.handleBlurWorkEmail}
              noMargin
              />
          }
        />
        <Separator/>
        <ListViewItem
          title={formatMessage({id: 'account.personal.language'})}
          content={
            <SelectField
              label={formatMessage({id: 'account.personal.language'})}
              selected={this.state.language.label}
              onChange={this.handleLanguage} >
              {languages}
            </SelectField>
          }
        />
        <Separator/>
        <ListViewItem
          title={formatMessage({id: 'account.personal.phone'})}
          content={
            <div style={styles.phoneWrapper}>
              <TextField
                label=''
                value={this.state.phone.value}
                disabled
                noMargin
                />
              <PushButton
                style={styles.editButton}
                label={formatMessage({id: 'account.personal.buttonEditPhone'})}
                handleClick={() => this.context.router.history.push('/verify-phone-number')}
                noMargin
                />
            </div>
          }
        />
        <Separator/>
        <ListViewItem
          title={formatMessage({id: 'account.personal.building'})}
          content={
            <div style={styles.phoneWrapper}>
              <TextField
                label={this.props.building.current.name}
                value={this.props.building.current.name}
                disabled
                noMargin
                />
              <PushButton
                style={styles.editButton}
                label={formatMessage({id: 'account.personal.buttonEditBuilding'})}
                handleClick={() => this.context.router.history.push('/select-building')}
                noMargin
                />
            </div>
          }
        />
        {/* Do this later...
        <ListViewItem
          title={formatMessage({id: 'account.personal.password'})}
          content={
            <BorderButton
              handleClick={() => this.props.router.push('/change-password')}
              label={formatMessage({id: 'account.personal.changepassword'})}
              noMargin
            />
          }
          />
          <Separator/>*/}
      </div>
    );
  }
}

PersonalSettings.contextTypes = {
  router: PropTypes.object
}

PersonalSettings.propTypes = {
  intl: intlShape.isRequired,
  router: PropTypes.object,
  user: PropTypes.object.isRequired,
  building: PropTypes.object.isRequired,
  isUpdating: PropTypes.bool,
  onUpdateUser: PropTypes.func,
  onShowMessage: PropTypes.func
};

export default withRouter(injectIntl(PersonalSettings));
