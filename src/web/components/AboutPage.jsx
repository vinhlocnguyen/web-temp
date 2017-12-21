import React, { Component } from 'react';
import { FormattedMessage, intlShape, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import ColorBackground from './Backgrounds/ColorBackground';
import TitleBar from './UI/TitleBar';
import RoutedBackButton from './RoutedBackButton';
import logo from '../assets/images/logo.png';
import pjson from '../../../package.json';
import styled from 'styled-components';
import { media, ContentContainer } from './styleUlti';

const AboutBlock = styled.div`
  display: flex;
  flex-direction: column;
`;
const LogoImg = styled.img`
  height: 50px;
`;
const Row = styled.p`
  margin: 10px 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  font-family: Montserrat;
  font-size: 16px;
  line-height: 1.1;
  color: #4a4a4a;
`;

export class AboutPage extends Component {
  render() {
    const {formatMessage} = this.props.intl;
    const year = new Date().getFullYear();
    const version = pjson.version;
    return (
      <ColorBackground color='#eceff1'>
        <div className={'page'}>
          <TitleBar
            title={formatMessage({id: 'about.title'})}
            leftButton={<RoutedBackButton/>}
          />
          <ContentContainer>
            <AboutBlock>
              <Row>
                <LogoImg src={logo} />
                <FormattedMessage id='about.copyright' values={{year: year}} />
              </Row>
              <Row>
                <FormattedMessage id='about.contact' />&nbsp;
                <a href='mailto:help@drops.io'>help@drops.io</a>
              </Row>
              <Row>
                <FormattedMessage id='about.version' values={{version: version}} />
              </Row>
            </AboutBlock>
          </ContentContainer>
        </div>
      </ColorBackground>
    );
  }
}

AboutPage.propTypes = {
  intl: intlShape.isRequired
};

const mapStateToProps = state => state;
export default connect(mapStateToProps)(injectIntl(AboutPage));
