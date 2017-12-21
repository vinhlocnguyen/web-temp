import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { intlShape, injectIntl } from 'react-intl';
import ColorBackground from './Backgrounds/ColorBackground';
import styled from 'styled-components';
import { media, ContentContainer } from './styleUlti';

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  font-family: Montserrat;
  font-size: 20px;
  line-height: 1.1;
  color: #4a4a4a;
  width: 90%;
  height: 90%;
  padding: 5%;
`;

class NotFound extends Component {
  constructor() {
    super();
    this.state = {
      counter: 5
    };
  }
  componentWillMount() {
    const countDown = (counter) => {
      if (counter === 1) {
        return this.context.router.history.replace('/');
      }
      const newCounter = --counter;
      this.setState({counter: newCounter});
      return setTimeout(() => countDown(newCounter), 1000);
    };
    countDown(this.state.counter);
  }

  render() {
    const { formatMessage } = this.props.intl;
    return (
      <ColorBackground color='#eceff1'>
        <Wrapper>
          <ContentContainer>
            {formatMessage(
              {id: 'notfound.message'},
              {counter: this.state.counter, count: this.state.counter}
            )}
          </ContentContainer>
        </Wrapper>
      </ColorBackground>
    );
  }
}

NotFound.contextTypes = {
  router: PropTypes.object.isRequired
};

NotFound.propTypes = {
  intl: intlShape.isRequired
};

export default injectIntl(NotFound);
