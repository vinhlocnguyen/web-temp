import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { intlShape, injectIntl } from 'react-intl';
import ReactCSSTransitionGroup from 'react-transition-group/CSSTransitionGroup';
import BorderButton from './BorderButton';
import ColoredButton from './ColoredButton';
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
  width: 100%;
  height: 100%;
  overflow: auto;
`;
const MainWrapper = styled.div`
  top 0;
  left: 0;
  width: 100%;
`;
const Buttons = styled.div`
  width: 100%;
`;

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
    width: '100%',
    height: '100%',
    overflow: 'auto'
  },
  main: {
    // position: 'absolute',
    top: 0,
    left: 0,
    width: '100%'
  },
  buttons: {
    // position: 'absolute',
    width: '100%'
  }
};
class Stepper extends Component {
  render() {
    const { formatMessage } = this.props.intl;
    const stepIndex = this.props.stepIndex || 0;
    const action = this.props.action || 'next';
    const children = React.Children.toArray(this.props.children);
    const isDone = stepIndex === children.length - 1;
    return (
        <Container>
          <MainWrapper>
            <ReactCSSTransitionGroup
              transitionName={action === 'previous' ? 'reversePageSwap' : 'pageSwap'}
              transitionEnterTimeout={500}
              transitionLeaveTimeout={500}
            >
              {children[stepIndex]}
            </ReactCSSTransitionGroup>
          </MainWrapper>
          <Buttons>
            <BorderButton
              label={formatMessage({id: 'button.previous'})}
              visible={stepIndex > 0}
              handleClick={this.props.previous}
              />
            <ColoredButton
              label={isDone ? formatMessage({id: 'button.finish'}) : formatMessage({id: 'button.next'})}
              handleClick={isDone ? this.props.onFinish : this.props.next}
              />
          </Buttons>
        </Container>
    );
  }
}

Stepper.propTypes = {
  stepIndex: PropTypes.number,
  action: PropTypes.string,
  next: PropTypes.func,
  previous: PropTypes.func,
  onFinish: PropTypes.func,
  intl: intlShape.isRequired
};

export default injectIntl(Stepper);
