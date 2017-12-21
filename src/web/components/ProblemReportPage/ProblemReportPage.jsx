import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { intlShape, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import BorderButton from '../UI/BorderButton';
import ColoredButton from '../UI/ColoredButton';
import TextArea from '../UI/TextArea';
import { SubmittedIcon } from '../UI/Icons';
import Snackbar from 'material-ui/Snackbar';
import RoutedBackButton from '../RoutedBackButton';
import TitleBar from '../UI/TitleBar';
import { Palette } from '../../theme';// TODO use the muiTheme in the context to get to the palette
import RadioButtonContainer from './RadioButtonContainer';
import { reportIncident } from '../../../redux/actions/reporting';
import ColorBackground from '../Backgrounds/ColorBackground';
import ErrorMessage from '../Features/ErrorMessage';
import { resetError } from '../../../redux/actions/error';
import ReactGA from 'react-ga';
import clientStorage from '../../../redux/helpers/clientStorage';
import styled from 'styled-components';
import { media, ContentContainer } from '../styleUlti';
//--intend for server-render
const isBrowser = typeof window !== 'undefined';

const Wrapper = styled.div`
  display: flex;
  margin: 0 14px;
  flex-direction: column;
  flex-grow: 1;
  align-items: 'center;
  justify-content: center;
`;
const Container = styled.div`
  width: 100%;
  overflow: auto;
  margin-bottom: 20px;
`;
const StepContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-content: flex-start;
  justify-content: 'space-between'
`;
const WrapperStepContent = styled.div`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
`;
const StepTitle = styled.div`
  font-family: Montserrat;
  font-size: 24px;
  margin-top: 20px;
  line-height: 1;
  color: #22b1d7;
`;
const StepFinish = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  flex-grow: 1;
  margin-top: 20px;
  text-align: center;
`;

export class VerticalLinearStepper extends Component {
  constructor(props) {
    super(props);
    this.state = {
      finished: false,
      stepIndex: 0,
      disableNext: true,
      what_selection: '',
      what_text: '',
      where_selection: '',
      where_text: '',
      extra: '',
      picture: undefined
    };

    this.handleNext = this.handleNext.bind(this);
    this.handlePrev = this.handlePrev.bind(this);
    this.renderStepContent = this.renderStepContent.bind(this);
    this.isNextButtonDisabled = this.isNextButtonDisabled.bind(this);
    this.handleFinish = this.handleFinish.bind(this);
    this.handleWhereSelect = this.handleWhereSelect.bind(this);
    this.handleWhereTextChange = this.handleWhereTextChange.bind(this);
    this.handleWhatSelect = this.handleWhatSelect.bind(this);
    this.handleWhatTextChange = this.handleWhatTextChange.bind(this);
  };

  handleNext() {
    const {stepIndex} = this.state;
    const nextStep = stepIndex < 2 ? stepIndex + 1 : stepIndex;
    this.setState({
      stepIndex: nextStep,
      disableNext: true,
      finished: stepIndex >= 2
    });

    if (stepIndex >= 2) {
      this.handleFinish();
    }
  };

  handleFinish() {
    ReactGA.event({
      category: 'Incident Report',
      action: 'Submit Incident Report',
      label: 'What',
      value: this.state.what_selection
    });
    ReactGA.event({
      category: 'Incident Report',
      action: 'Submit Incident Report',
      label: 'Where',
      value: this.state.where_selection
    });
    ReactGA.event({
      category: 'Incident Report',
      action: 'Submit Incident Report',
      label: 'Extra'
    });
    // send mail
    const where = [this.state.where_selection, this.state.where_text].filter(value => !!value);
    const what = [this.state.what_selection, this.state.what_text].filter(value => !!value);
    const params = {
      building: isBrowser && clientStorage.getItem('buildingId'),
      what: what.join(', '),
      where: where.join(', '),
      extraInfo: this.state.extra,
      picture: this.state.picture
    };
    this.props.reportIncident(params).then(_ => {
      this.props.checkErrors();
      if (this.props.reporting.isReported) {
        this.setState({
          stepIndex: 3
        });
      }
    });
  };

  handlePrev() {
    const {stepIndex} = this.state;
    if (stepIndex > 0) {
      this.setState({ stepIndex: stepIndex - 1 });
    }
  };

  isNextButtonDisabled(stepIndex) {
    switch (stepIndex) {
      case 0:
        return !(this.state.what_selection || this.state.what_text);
      case 1:
        return !(this.state.where_selection || this.state.where_text);
      case 2:
      default:
        return false;
    }
  }

  handleWhatSelect(value) {
    this.setState({
      what_selection: value,
      what_text: ''
    });
  }

  handleWhereSelect(value) {
    this.setState({
      where_selection: value,
      where_text: ''
    });
  }

  handleWhatTextChange(e) {
    if (this.state.what_selection) {
      this.setState({
        what_selection: '',
        what_text: e.target.value.trim()
      });
    } else {
      this.setState({
        what_text: e.target.value.trim()
      });
    }
  }

  handleWhereTextChange(e) {
    if (this.state.where_selection) {
      this.setState({
        where_selection: '',
        where_text: e.target.value.trim()
      });
    } else {
      this.setState({
        where_text: e.target.value.trim()
      });
    }
  }

  renderStepContent(step, formatMessage) {
    const {stepIndex} = this.state;

    switch (stepIndex) {
      case 0:
        return (<StepContainer>
          <StepTitle>
            {formatMessage({id: 'report.what.title'})}
          </StepTitle>
          <RadioButtonContainer
            possibilities={["Temperature", "Noise", "Cleaning", "Broken", "Dangerous", "Urgent"]}
            selected={this.state.what_selection}
            onSelect={this.handleWhatSelect} />
          <TextArea
            label={formatMessage({id: 'report.somethingElse'})}
            value={this.state.what_text}
            onChange={this.handleWhatTextChange} />
        </StepContainer>);
      case 1:
        return (<StepContainer>
          <StepTitle>
            {formatMessage({id: 'report.where.title'})}
          </StepTitle>
          <RadioButtonContainer
            possibilities={["Office", "Toilet", "Elevator", "Entrance", "Parking", "Outside"]}
            selected={this.state.where_selection}
            onSelect={this.handleWhereSelect} />
          <TextArea
            label={formatMessage({id: 'report.somewhereElse'})}
            value={this.state.where_text}
            onChange={this.handleWhereTextChange} />
        </StepContainer>);
      case 2:
        return (
          <div>
            <StepTitle>
              {formatMessage({id: 'report.extra.title'})}
            </StepTitle>
            <TextArea
              label={formatMessage({id: 'report.extra'})}
              onChange={e => this.setState({ extra: e.target.value.trim() })}
              />
            {/*<RaisedButton
              label={<FormattedMessage id='report.button.drop' />}
              secondary
              fullWidth />*/}
          </div>
        );
      case 3:
        return (
          <StepFinish>
            <SubmittedIcon />
            <StepTitle>
              {formatMessage({id: 'report.finish.notification'})}
            </StepTitle>
          </StepFinish>
        );
    }
  }

  render() {
    const {formatMessage} = this.props.intl;
    const {stepIndex} = this.state;
    return (
      <Container>
        <WrapperStepContent>
          {this.renderStepContent(stepIndex, formatMessage)}
        </WrapperStepContent>
        {stepIndex === 3 ? (
          <div>
            <ColoredButton
              label={formatMessage({id: 'button.done'})}
              handleClick={() => this.context.router.history.push('/')}
              disabled={this.isNextButtonDisabled(stepIndex)} />
          </div>
        ) : (
          <div>
            <ColoredButton
              label={stepIndex === 2 ? formatMessage({id: 'button.finish'}) : formatMessage({id: 'button.next'})}
              handleClick={this.handleNext}
              disabled={this.isNextButtonDisabled(stepIndex)} />
            {stepIndex > 0 ? (
              <BorderButton
                label={formatMessage({id: 'button.previous'})}
                disabled={stepIndex === 0}
                handleClick={this.handlePrev}
                />
            ) : (<div />)}
          </div>)
        }
      </Container>

    );
  }
}

VerticalLinearStepper.contextTypes = {
  router: PropTypes.object.isRequired
};

export class ProblemReportPage extends Component {
  constructor(props) {
    super();
    this.state = {
      error: null,
			isShowError: false
    };
    this.checkErrors = this.checkErrors.bind(this);
  }

  checkErrors() {
		if (this.props.error) {
			this.setState({
				error: this.props.error.status,
				isShowError: true
			});
		}
	}

  render() {
    const { formatMessage } = this.props.intl;
    return (
      <ColorBackground color='#ffffff'>
        <TitleBar
          leftButton={<RoutedBackButton/>}
          title={formatMessage({id: 'report.title'})}
        />
        <ContentContainer>
          <Wrapper>
            <VerticalLinearStepper {...this.props} checkErrors={this.checkErrors} />
          </Wrapper>
        </ContentContainer>
        <ErrorMessage
          error={this.state.error}
          open={this.state.isShowError}
          handleClose={() => {
            this.props.resetError();
            this.setState({
              error: null,
              isShowError: false
            });
          }}/>
      </ColorBackground>
    );
  }
}

VerticalLinearStepper.propTypes = {
  index: PropTypes.object,
  building: PropTypes.object,
  reportIncident: PropTypes.func,
  reporting: PropTypes.object,
  intl: intlShape.isRequired,
  checkErrors: PropTypes.func
};

ProblemReportPage.propTypes = {
  resetError: PropTypes.func,
  error: PropTypes.object
};

const mapStateToProps = state => ({
  index: state.index,
  building: state.building.current,
  reporting: state.reporting,
  user: state.user,
  error: state.error
});

const mapDispatchToProps = {
  reportIncident,
  resetError
};

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(ProblemReportPage));
