import PropTypes from 'prop-types';
import React, { Component } from 'react';
import styled from 'styled-components';
import { media } from '../../styleUlti';

const LeftWrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
`;
const Title = styled.div`
  font-family: Montserrat;
  font-size: 13px;
  line-height: 1;
  color: #22b1d7;
  margin-bottom: 5px;
  word-break: break-word;
`;
const Content = styled.div`
  font-family: Montserrat;
  font-size: 14px;
  font-weight: 300;
  line-height: 1.5;
  color: #4a4a4a;
  word-break: break-word;
`;
const ButtonWrapper = styled.div`
  margin-left: 42px;
`;

class ListViewItem extends Component {
  render() {
    const styles = {
      container: {
        display: 'flex',
        flexDirection: 'row',
        backgroundColor: '#ffffff',
        padding: '10px 14px'
      }
    };

    const containerStyle = this.props.style ? Object.assign({}, styles.container, this.props.style) : styles.container;
    return (
      <div style={containerStyle} onTouchTap={() => { !this.props.button && this.props.handleClick ? this.props.handleClick() : null; }}>
        <LeftWrapper>
          <Title>
            {this.props.title} {this.props.subtitle}
          </Title>
          <Content>{this.props.content}</Content>
        </LeftWrapper>
        {this.props.button && (
          <ButtonWrapper>{this.props.button}</ButtonWrapper>
        )}
        {this.props.buttonRemove && (
          <div>{this.props.buttonRemove}</div>
        )}
        {this.props.children}
      </div>
    );
  }
}

ListViewItem.propTypes = {
  title: PropTypes.string,
  subtitle: PropTypes.node,
  content: PropTypes.node, // This could be a text or something like an image
  button: PropTypes.node,
  handleClick: PropTypes.func,
  style: PropTypes.object
};

export default ListViewItem;
