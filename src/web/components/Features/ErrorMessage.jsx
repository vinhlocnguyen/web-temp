import PropTypes from 'prop-types';
import React, { Component } from 'react';
import {FormattedMessage, injectIntl, intlShape} from 'react-intl';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import { Palette } from '../../theme';

const styles = {
  button: {
    width: '50px',
    textAlign: 'center'
  },
  dialog: {
    color: Palette.alternateTextColor
  }
};

class ErrorMessage extends Component {

  messageFromCode(code) {
    switch (code) {
      case 400:
        return (
          <FormattedMessage id='error.badrequest'
            values={{email: <a href='mailto:help@drops.io'>help@drops.io</a>}}
          />
        );
      case 401:
        return (
          <FormattedMessage id='error.unauthorized'
            values={{email: <a href='mailto:help@drops.io'>help@drops.io</a>}}
          />
        );
      case 403:
        return (<FormattedMessage id='error.forbidden'
          values={{email: <a href='mailto:help@drops.io'>help@drops.io</a>}}
        />);
      case 404:
        return (<FormattedMessage id='error.notfound'
          values={{email: <a href='mailto:help@drops.io'>help@drops.io</a>}}
        />);
      case 409:
        return (<FormattedMessage id='error.conflict'
          values={{email: <a href='mailto:help@drops.io'>help@drops.io</a>}}
        />);
      case 412:
        return (<FormattedMessage id='error.addressNotFound'
          values={{email: <a href='mailto:help@drops.io'>help@drops.io</a>}}
        />);
      case 413:
        return (<FormattedMessage id='error.payloadtoolarge' />);
      default: return (<FormattedMessage
          id='error.unknown'
          values={{
            email: <a href='mailto:help@drops.io'>help@drops.io</a>
          }}
        />);
    }
  }

  render() {
    const {formatMessage} = this.props.intl;
    const error = this.messageFromCode(this.props.error);
    const actions = [
      <FlatButton
        label={formatMessage({id: 'dialog.close'})}
        labelStyle={styles.dialog}
        primary
        onTouchTap={this.props.handleClose}
        style={styles.button}
      />
    ];
    return (
      <Dialog
        actions={actions}
        modal={false}
        open={this.props.open}
        onRequestClose={this.props.handleClose}
      >
        {this.props.message && (<span>{this.props.message}</span>)}
        {!this.props.message && (error)}
      </Dialog>
    );
  }
}
ErrorMessage.propTypes = {
  intl: intlShape.isRequired,
  open: PropTypes.bool.isRequired,
  error: PropTypes.number,
  handleClose: PropTypes.func,
  message: PropTypes.string
};

export default injectIntl(ErrorMessage);
