import React, { Component } from 'react';
import {withRouter} from 'react-router-dom';
import ReactGA from 'react-ga';
import { LiveIcon, MoveIcon, WorkIcon } from '../UI/Icons';
import PropTypes from 'prop-types';
import Radium from 'radium';
import {FormattedMessage} from 'react-intl';
import styled from 'styled-components';
import { media } from '../styleUlti';

const TouchTapDiv = (props) => <div {...props} />
const Container = styled(TouchTapDiv)`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  width: 30%;
  align-items: center;
  border-radius: 4px;
  background-color: rgba(255, 255, 255, 0.8);
  box-shadow: 0 2px 5.5px 0 rgba(7, 25, 65, 0.2);
  cursor: pointer;
  padding: 10px 0px;
  margin: 0 auto;
  justify-content: center;
  &:hover: {
    background-color: rgba(255, 255, 255, 1.0);
  },
  &:active: {
    background-color: rgba(255, 255, 255, 0.2);
  }
  ${media.phonePortrait`
    flex-direction: column;
  `}
  ${media.tabletPortrait`
    flex-direction: row;
  `}
`;
const Icon = styled.div`
  font-size: 30px;
  width: 47px;
  height: 47px;
  text-align: center;
  color: #0c78be;
  margin-right: 5px;
  margin-left: 5px;
`;
const LabelWrapper = styled.span`
  margin-top: 10px;
  width: 59px;
  height: 20px;
  border-radius: 10px;
  background-color: #0c78be;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #ffffff;
  font-family: Montserrat;
  font-size: 15px;
  line-height: 20px;
`;
const Description = styled.span`
  margin-top: 9px;
  width: 60%;
  text-align: center;
  font-family: Montserrat;
  font-size: 10px;
  line-height: 1.5;
  color: #4a4a4a;
  ${media.phonePortrait`
    order: 1;
    height: 30px;
    width: 100%;
  `}
  ${media.tabletPortrait`
    width: 60%;
    order: 0;
  `}
`;
const ButtonWrapper = styled.div`
  display: flex;
  flex-direction: row;
  margin: 15px 0px;
  ${media.landscape`
    padding: 0 10%;
  `};
  ${media.tablet`
    margin: 50px 0px;
  `}
`;

export class ButtonBar extends Component {
	render() {
		return (
			<ButtonWrapper>
				<Container className={'livebutton'} ref='livebutton' onTouchTap={() => this.props.router.push("live")}>
          <Icon>
            <LiveIcon />
          </Icon>
          <Description>
            <FormattedMessage id='homepage.buttonBar.liveDescription'/>
          </Description>
					<LabelWrapper>
            <FormattedMessage id='homepage.buttonBar.live'/>
          </LabelWrapper>
        </Container>
        <Container className={'workbutton'} ref="workbutton" onTouchTap={() => this.props.router.push("work")}>
          <Icon>
            <WorkIcon />
          </Icon>
          <Description>
            <FormattedMessage id='homepage.buttonBar.workDescription'/>
          </Description>
          <LabelWrapper>
            <FormattedMessage id='homepage.buttonBar.work'/>
          </LabelWrapper>
        </Container>
        <Container className={'movebutton'} ref="movebutton" onTouchTap={() => this.props.router.push('move')}>
          <Icon>
            <MoveIcon />
          </Icon>
          <Description>
            <FormattedMessage id='homepage.buttonBar.moveDescription'/>
          </Description>
          <LabelWrapper>
            <FormattedMessage id='homepage.buttonBar.move'/>
          </LabelWrapper>
				</Container>
			</ButtonWrapper>
		);
	}
}

ButtonBar.propTypes = {
	router: PropTypes.object
};

export default withRouter(Radium(ButtonBar));
