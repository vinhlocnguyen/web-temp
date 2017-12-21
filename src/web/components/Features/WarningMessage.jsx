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

class WarningMessage extends Component {
  render() {
    const {formatMessage} = this.props.intl;
    const actions = [
      <FlatButton
        label={this.props.button || formatMessage({ id: 'button.done' })}
        labelStyle={this.props.noButtonStyle || styles.dialog}
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
      </Dialog>
    );
  }
}
WarningMessage.propTypes = {
  intl: intlShape.isRequired,
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func,
  message: PropTypes.any,
  button: PropTypes.string,
  buttonStyle: PropTypes.object
};

export default injectIntl(WarningMessage);
