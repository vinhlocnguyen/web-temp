import PropTypes from 'prop-types';
import React, { Component } from 'react';
import {
  MVTaxiIcon
} from './Icons';
import Avatar from './Avatar';
import ColoredButton from './ColoredButton';
import styled from 'styled-components';
import { media, TouchTapDiv } from '../styleUlti';

const Container = styled.div`
  display: flex;
  flex-direction: column;
`;
const RowView = styled.div`
  display: flex;
  flex-direction: row;
  margin-bottom: 10;
  border-bottom: 1px solid #E0E0E0;
  padding-bottom: 5px;
`;
const ActionWrapper = styled.div`
  display: flex;
  flex-direction: column;
  border-bottom: none;
  padding-bottom: none;
  margin-bottom: none;
`;
const Content = styled.div`
  font-family: Montserrat;
  font-size: 14px;
  line-height: 20px;
  color: #4a4a4a;
  height: 20px;
  align-self: center;
`;
const StyledIcon = styled.div`
  width: 60px;
  display: flex;
  align-items: center;
`;

class TaxiCard extends Component {
  render() {
    const taxi = this.props.taxi;
    let actions = [];
    if (taxi && taxi.phone) {
      actions.push(<ColoredButton
        key={0}  
        label={'Call'}
        handleClick={this.props.callTaxi}
      />);
    }

    if (taxi && taxi.website) {
      actions.push(<ColoredButton
        key={1}
        label={'Website'}
        handleClick={this.props.goToWebsite}
      />);
    }
    
    return (
      <Container>
        <RowView>
          <StyledIcon>
            <MVTaxiIcon />
          </StyledIcon>
          <Content>{taxi && taxi.name}</Content>
        </RowView>
        
        <ActionWrapper>
          {/*<ColoredButton
            label={'Call'}
            handleClick={this.props.callTaxi}
          />
          <ColoredButton
            label={'Website'}
            handleClick={this.props.goToWebsite}
          />*/}
          {actions}
        </ActionWrapper>
      </Container>
    );
  }
}

TaxiCard.propTypes = {
  taxi: PropTypes.object,
  goToWebsite: PropTypes.func.isRequired,
  callTaxi: PropTypes.func.isRequired
};

export default TaxiCard;
