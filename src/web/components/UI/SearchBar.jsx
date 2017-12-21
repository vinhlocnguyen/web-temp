import PropTypes from 'prop-types';
import React, { Component } from 'react';
import {intlShape, injectIntl} from 'react-intl';
import { ClockIcon, SmallMoveIcon } from './Icons';
import styled from 'styled-components';
import { media, TouchTapDiv } from '../styleUlti';

const Wrapper = styled.div`
  padding: 14px;
`;
const SearchField = styled.div`
  display: flex;
  flex-direction: row;
  border-radius: 4;
  background-color: #ffffff;
  padding: 10px 14px;
`;
const InputContainer = styled.div`
  width: 100%;
  height: 30px;
  display: flex;
  flex-direction: row;
  opacity: 0.6;
  justify-content: center;
  align-items: center;
`;
const LeftIconContainer = styled.div`
  width: 40px;
`;
const RightIconContainer = styled.div`
  width: 40px;
  margin-left: 20px;
`;
const StyledInput = styled.input`
  border: none;
  flex: 1;
  height: 16.5px;
  font-family: Montserrat;
  font-size: 16px;
  font-weight: 300;
  outline: none;
  background: none;
`;

class SearchBar extends Component {

  constructor() {
    super();
    this.state = {
      text: ''
    };
  }
  render() {
    const formatMessage = this.props.intl.formatMessage;
    return (
      <Wrapper>
        <SearchField>
          <InputContainer>
            <LeftIconContainer>
              <ClockIcon />
            </LeftIconContainer>
            <StyledInput
              type='text'
              placeholder={this.props.placeholder}
              onChange={e => this.props.handleChange(e)}
              onKeyPress={e => this.props.handleChange(e)}
              value={this.props.text}
            />
            <RightIconContainer>
              <SmallMoveIcon />
            </RightIconContainer>
          </InputContainer>
        </SearchField>
        {/* For a later version
        <ColoredButton
          label={formatMessage({id: 'building.nextButton'})}
          handleClick={this.handleNextToMe}
        />*/}
      </Wrapper>
    );
  }
}

SearchBar.propTypes = {
  intl: intlShape.isRequired,
  handleChange: PropTypes.func.isRequired,
  text: PropTypes.string.isRequired,
  placeholder: PropTypes.string.isRequired
};

export default injectIntl(SearchBar);
