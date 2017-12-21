import PropTypes from 'prop-types';
import React, { Component } from 'react';
import styled from 'styled-components';

export const Container = styled.div`
  width: 100%;
  height: 56px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  font-family: Montserrat;
  font-size: 16px;
  line-height: 1;
  color: #2a4c9b;
  background-color: #eceff1;
  box-shadow: 0 1px 0 0 rgba(0, 0, 0, 0.12);
  margin-bottom: 1px;
  flex-shrink: 0;
`;
export const ContainerWrapper = styled.div`
  display: flex;
  flex: 2;
  justify-content: center;
  align-items: center;
  text-transform: capitalize;
`;
export const StyledButton = styled.div`
  display: flex;
  align-items: center;
  flex: 1;
  z-index: 1;
`;
export const LeftButton = StyledButton.extend`
  justify-content: flex-start;
`;
export const RightButton = StyledButton.extend`
  justify-content: flex-end;
`;
export const IconWrapper = styled.div`
  margin-right: 10px;
`;
export const Warning = styled.div`
  color: red;
  text-align: center;
  font-size: 12px;
  background-color: bisque;
  padding: 5px 5px;
  border: 1px solid;
  width: 95%;
  margin: auto;
  margin-top: 5px;
`;

class TitleBar extends Component {
  render() {
    const title = this.props.title.length > 22 ? this.props.title.substr(0, 22) + '...' : this.props.title;
    return (
      <div>
        <Container>
            <LeftButton>
              {this.props.leftButton && (
                this.props.leftButton
              )}
            </LeftButton>
            <ContainerWrapper>
              {this.props.icon && (
                <IconWrapper>
                  {this.props.icon}
                </IconWrapper>
              )}
              <span>{title.toLowerCase()}</span>
            </ContainerWrapper>
            <RightButton>
              {this.props.rightButton && (
                this.props.rightButton
              )}
            </RightButton>
        </Container>
        {this.props.errorMsg && <Warning>
          <p>{this.props.errorMsg}</p>
        </Warning>}
      </div>
    );
  }
}

TitleBar.propTypes = {
  title: PropTypes.string,
  leftButton: PropTypes.node,
  rightButton: PropTypes.node,
  style: PropTypes.object,
  icon: PropTypes.node,
  errorMsg: PropTypes.string
};
TitleBar.defaultProps = {
  style: {},
  title: ''
};

export default TitleBar;
