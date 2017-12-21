import PropTypes from 'prop-types';
import React, { Component } from 'react';
import {FormattedMessage, injectIntl, intlShape} from 'react-intl';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import { Palette } from '../../theme';

const styles = {
  button: {
    textAlign: 'center'
  },
  dialog: {
    color: Palette.alternateTextColor
  }
};

class ConfirmMessage extends Component {
  render() {
    const {formatMessage} = this.props.intl;
    const actions = [
      <FlatButton
        label={this.props.noButton || formatMessage({ id: 'dialog.no' })}
        labelStyle={this.props.noButtonStyle || styles.dialog}
        onTouchTap={this.props.handleClose}
        style={styles.button}
      />,
      <FlatButton
        label={this.props.yesButton || formatMessage({ id: 'dialog.yes' })}
        labelStyle={this.props.yesButtonStyle || styles.dialog}
        primary
        disabled={this.props.yesDisabled}
        onTouchTap={this.props.handleYesBtn}
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
      </Dialog>
    );
  }
}
ConfirmMessage.propTypes = {
  intl: intlShape.isRequired,
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func,
  handleYesBtn: PropTypes.func,
  message: PropTypes.any,
  noButton: PropTypes.string,
  noButtonStyle: PropTypes.object,
  yesButton: PropTypes.string,
  yesButtonStyle: PropTypes.object,
  yesDisabled: PropTypes.bool
};

export default injectIntl(ConfirmMessage);
