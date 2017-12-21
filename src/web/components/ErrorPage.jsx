import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { intlShape, injectIntl, FormattedMessage } from 'react-intl';
import ColorBackground from './Backgrounds/ColorBackground';
import styled from 'styled-components';
import { media, ContentContainer } from './styleUlti';

const Container = ContentContainer.extend`
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

class ErrorPage extends Component {
  constructor(props) {
    super(props);
  }
  componentWillMount() {

  }

  render() {
    return (
      <ColorBackground color='#eceff1'>
        <Container>
        <FormattedMessage id='error.unknown'
          values={{email: <a href='mailto:help@drops.io'>help@drops.io</a>}}
        />
        </Container>
      </ColorBackground>
    );
  }
}

ErrorPage.contextTypes = {
  router: PropTypes.object.isRequired
};

ErrorPage.propTypes = {
  intl: intlShape.isRequired
};

export default injectIntl(ErrorPage);
