import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { NameIcon } from '../Icons';
import Image from '../Image';
import RemoveButton from './RemoveButton';
import { IMAGE } from '../../../../../config';
import FeatureToggle  from '../FeatureToggle';
import styled from 'styled-components';
import { media, TouchTapDiv } from '../../styleUlti';

const Container = styled.div`
  margin: 12px 14px 0;
  display: flex;
  align-items: center;
  flex-direction: row;
  padding: 10px;
  border-radius: 4px;
  background-image: linear-gradient(to bottom, rgba(255, 255, 255, 0.8), #ffffff);
  box-shadow: 0 2px 5.5px 0 rgba(7, 25, 65, 0.2);
`;
const ContentWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  flex-grow: 1;
`;
const Content = styled(TouchTapDiv)`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  margin-left: 10px;
`;
const WrapTitle = styled.div`
  margin-bottom: 5px;
`;
const Title = styled.span`
  font-family: Montserrat;
  font-size: 16px;
  color: #4a4a4a;
  text-transform: capitalize;
  margin-right: 10px;
  word-break: break-word;
`;
const SubTitle = styled.span`
  font-family: Montserrat;
  font-size: 12px;
  font-weight: 300;
  color: #999999;
  word-break: break-word;
`;
const Icon = styled.div`
  align-self: flex-end;
`;
const StyledImage = styled(Image)`
  padding-right: 10px;
  width: 50px;
  height: 50px;
`;

class ListViewUser extends Component {
  render() {
    // const styles = {
    //   container: {
    //     margin: '12px 14px 0',
    //     display: 'flex',
    //     alignItems: 'center',
    //     flexDirection: 'row',
    //     padding: '10px',
    //     borderRadius: '4px',
    //     backgroundImage: 'linear-gradient(to bottom, rgba(255, 255, 255, 0.8), #ffffff)',
    //     boxShadow: '0 2px 5.5px 0 rgba(7, 25, 65, 0.2)'
    //   },
    //   contentWrapper: {
    //     display: 'flex',
    //     flexDirection: 'row',
    //     alignItems: 'center',
    //     flexGrow: 1
    //   },
    //   content: {
    //     display: 'flex',
    //     flexDirection: 'column',
    //     flexGrow: 1
    //   },
    //   wrapTitle: {
    //     marginBottom: 5
    //   },
    //   title: {
    //     fontFamily: 'Montserrat',
    //     fontSize: '16px',
    //     color: '#4a4a4a',
    //     textTransform: 'capitalize',
    //     marginRight: 10,
    //     wordBreak: 'break-word'
    //   },
    //   sub: {
    //     fontFamily: 'Montserrat',
    //     fontSize: '12px',
    //     fontWeight: 300,
    //     color: '#999999',
    //     wordBreak: 'break-word'
    //   },
    //   icon: {
    //     alignSelf: 'flex-end'
    //   },
    //   image: {
    //     paddingRight: '10px',
    //     width: '50px',
    //     height: '50px'
    //   }
    // };

    return (
      <Container>
        <StyledImage
          src={this.props.avatar}
          placeholder={IMAGE.DEFAULT_AVATAR}
          onTouchTap={() => this.props.onTouchTap()} />
        <ContentWrapper>
          <Content onTouchTap={() => this.props.onTouchTap()}>
            <WrapTitle>
              <Title>{this.props.name}</Title>
              {this.props.isAdmin && <NameIcon />}
            </WrapTitle>
            <SubTitle>{this.props.email}</SubTitle>
          </Content>
          {!this.props.isAdmin && (
            <FeatureToggle feature='feature_delete_users'>
              <RemoveButton onHandleClick={this.props.onRemoveUser} />
            </FeatureToggle>
          )}
        </ContentWrapper>
      </Container>
    );
  }
}

ListViewUser.propTypes = {
  avatar: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  email: PropTypes.string.isRequired,
  isAdmin: PropTypes.bool,
  onTouchTap: PropTypes.func,
  onRemoveUser: PropTypes.func
};

export default ListViewUser;
