import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import CircularProgress from 'material-ui/CircularProgress';
import Snackbar from 'material-ui/Snackbar';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import { Palette } from '../../theme';
import ColorBackground from '../Backgrounds/ColorBackground';
import {
  resolveReport
} from '../../../redux/actions/reporting';
import { ContentContainer } from '../styleUlti';

export class ResolveReportPage extends Component {
  constructor() {
    super();
    this.state = {
      comment: '',
      isWaiting: false
    };
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit() {
    const { id, resolveToken } = this.props.location.query;
    const params = { comment: this.state.comment };
    this.props.resolveReport(id, resolveToken, params);
    this.setState({isWaiting: true});
  }

  render() {
    const view = this.state.isWaiting && !this.props.reporting.isResolved ? (
      <CircularProgress size={60} />
    ) : (
      <div>
        <TextField
          floatingLabelText={<FormattedMessage id='report.commentLabel' />}
          hintText={<FormattedMessage id='report.commentHint' />}
          onChange={e => this.setState({ comment: e.target.value })}
          fullWidth
          />
        <RaisedButton
          label={<FormattedMessage id='report.resolveButton' />}
          onTouchTap={this.handleSubmit}
        />
      </div>
    );
    return (
      <ColorBackground color='#eceff1'>
        <ContentContainer>
          <div style={styles.loading}>
            {view}
          </div>
          <Snackbar
            open={this.props.reporting.isResolved}
            message={<FormattedMessage id='report.resolve.successMessage' />}
            bodyStyle={{ color: Palette.alternateTextColor }}
            autoHideDuration={2000}
            onRequestClose={() => this.context.router.history.push('/')}
          />
        </ContentContainer>
      </ColorBackground>
    );
  }
}

const styles = {
  loading: {
    width: '100%',
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center'
	}
};

ResolveReportPage.contextTypes = {
  router: PropTypes.object.isRequired
};

ResolveReportPage.propTypes = {
  location: PropTypes.object,
  reporting: PropTypes.object,
  resolveReport: PropTypes.func
};

const mapStateToProps = state => ({
  reporting: state.reporting
});

export default connect(mapStateToProps, {
  resolveReport
})(ResolveReportPage);
