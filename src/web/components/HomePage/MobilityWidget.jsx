import PropTypes from 'prop-types';
import React, { Component } from 'react';
import Dialog from 'material-ui/Dialog';
import styled from 'styled-components';
import { media } from '../styleUlti';

const TouchTapDiv = (props) => <div {...props} />
const Title = styled.p`
  font-family: Montserrat;
  font-size: 11px;
  font-weight: 300;
  line-height: 1;
  color: #22b1d7;
`;
const Accent = styled.p`
  color: #0c78be;
  height: 20px;
  font-family: Montserrat;
  font-size: 20px;
  line-height: 1;
`;
const Info = styled.p`
  font-size: ${props => props['font-size'] || '12px'};
  font-weight: ${props => props['font-weight'] || 100};
  line-height: ${props => props['line-height'] || 1};
  color: ${props => props['color'] || '#ffffff'};
  font-family: ${props => props['font-family'] || 'Montserrat'};
  word-break: ${props => props['word-break'] || 'break-word'};
  background-color: ${props => props['background-color'] || '#0A96A0'};
  padding: ${props => props['padding'] || '3px 12px'};
`;
const InfoContainer = styled.div`
  text-align: center;
  width: 40px;
  min-width: 40px;
  height: 40px;
  margin-right: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
`;
const Icon = styled.div`
  color: #0c78be;
  font-size: 200%;
`;
const Separator = styled.div`
  height: 42px;
  border-right: solid 1px rgba(8, 116, 186, 0.8);
  margin-right: 10px;
`;
const Widget = styled(TouchTapDiv)`
  display: flex;
  flex-direction: row;
  align-items: center;
  cursor: ${props => props.cursor};
  width: 50%;
  ${media.landscape`
    width: inherit;
  `};
`;

class MobilityWidget extends Component {
  constructor() {
    super();
    this.state = {
      open: false
    };
    this.handleTogglePopup = this.handleTogglePopup.bind(this);
  }

  handleTogglePopup() {
    this.setState({
      open: !this.state.open
    });
  }

  render() {
    return (
      <Widget onTouchTap={this.props.onTouchTap}>
        <InfoContainer>
          {this.props.icon}
        </InfoContainer>
        <Separator />
        <div>
          <Title>{this.props.title}</Title>
          <Accent>{this.props.value}</Accent>
          {this.props.info && <Info {...this.props.infoStyle}>{this.props.info}</Info>}
        </div>
      </Widget>
    );
  }
}

MobilityWidget.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  info: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number
  ]),
  icon: PropTypes.node.isRequired,
  onTouchTap: PropTypes.func,
  infoStyle: PropTypes.object,
  type: PropTypes.string
};

MobilityWidget.defaultProps = {
  infoStyle: {}
};

export default MobilityWidget;
