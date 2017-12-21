import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
// import RetinaImage from 'react-retina-image';
import logo from '../../assets/images/logo_footer.png';
import styled from 'styled-components';

export const Container = styled.div`
  width: 100%;
  height: 10%;
  font-family: Montserrat;
  font-weight: 300;
  color: #9b9b9b;
  font-size: 13px;
  display: flex;
  align-items: flex-end;
`;
export const StyledFooter = styled.div`
  display: flex;
  flex: 1;
  justify-content: center;
  align-items: center;
`;
export const Logo = styled.img`
  width: 36px;
  height: 36px;
`;
export const StyledLink = styled.a`
  color: #9b9b9b;
  text-decoration: none;
`;
class Footer extends Component {
  render() {
    return (
      <Container>
        <StyledFooter>
          <Logo src={logo} />
          <span>
            <FormattedMessage id='footer' />
            <StyledLink href='https://flatturtle.com'> FlatTurtle</StyledLink>
          </span>
        </StyledFooter>
      </Container>
    );
  }
}

export default Footer;
