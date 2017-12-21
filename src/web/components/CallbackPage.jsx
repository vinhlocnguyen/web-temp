import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { intlShape, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import CircularProgress from 'material-ui/CircularProgress';
import ColoredButton from './UI/ColoredButton';
import Logo from './UI/Logo';
import { SubmittedIcon } from './UI/Icons';
import ColorBackground from './Backgrounds/ColorBackground';
import {
  confirmChangePassword,
  verify,
  terminateToken
} from '../../redux/actions/user';

import styled from 'styled-components';
import { media, ContentContainer } from './styleUlti';

const StyledHeader = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  height: 56px;
`;
const Loading = styled.div`
  left: calc(50% - 30px);
  right: calc(50% - 30px);
`;
const SuccessBlock = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
  width: 100%;
`;
const Description = styled.div`
  font-family: Montserrat;
  font-weight: 300;
  font-size: 14px;
  line-height: 18px;
  color: #333;
  margin-top: 10px;
  display: flex;
  justify-content: center;
`;
const styles = {
  header: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    height: '56px'
  },
  loading: {
    left: 'calc(50% - 30px)',
    top: 'calc(50% - 30px)'
  },
  success: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    width: '100%'
  },
  description: {
    fontFamily: 'Montserrat',
    fontWeight: 300,
    fontSize: 14,
    lineHeight: '18px',
    color: '#333',
    marginTop: 10,
    display: 'flex',
    justifyContent: 'center'
  }
};

export class CallbackPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      description: props.intl.formatMessage({id: 'callback.description'}),
      redirect: () => {}
    };
  }
  componentDidMount() {
    const confirmResp = this.handleSendRequest(this.props.location.query.type);
    confirmResp && confirmResp.then(_ => {
      if (this.props.user.isConfirmed) {
        let route;
        switch (this.props.location.query.type) {
          case 'reset_password':
            route = '/login';
            break;
          default:
            route = '/';
            break;
        }
        this.setState({redirect: () => this.context.router.history.push(route)}, () => {
          setTimeout(this.state.redirect, 5000);
        });
      }
    });
  }

  componentWillReceiveProps(nextProps) {
    const formatMessage = this.props.intl.formatMessage;
    if (nextProps.user.isConfirmed) {
      let description;
      switch (this.props.location.query.type) {
        case 'register':
          description = formatMessage({id: 'callback.register'});
          break;
        case 'update_private_email':
          description = formatMessage({id: 'callback.update_private_email'});
          break;
        case 'update_work_email':
          description = formatMessage({id: 'callback.update_work_email'});
          break;
        case 'reset_password':
          description = formatMessage({id: 'callback.reset_password'});
          break;
        case 'terminate_token':
          description = formatMessage({id: 'callback.terminate_token'});
          break;
      }
      this.setState({description});
    }
  }

  handleSendRequest(type) {
    switch (type) {
      case 'register':
        return this.props.verify(this.props.location.query.token, type);
      case 'update_private_email':
        return this.props.verify(this.props.location.query.token, type);
      case 'update_work_email':
        return this.props.verify(this.props.location.query.token, type);
      case 'reset_password':
        return this.props.confirmChangePassword(this.props.location.query.token);
      case 'terminate_token':
        return this.props.terminateToken(this.props.location.query.code, this.props.location.query.useragent);
    }
  }

  render() {
    const {formatMessage} = this.props.intl;
    const description = this.state.description;

    const Header = () => (
      <StyledHeader>
        <Logo width='89px' height='30px' />
      </StyledHeader>
    );
    const view = !this.props.user.isConfirmed ? (
      <Loading className="loading">
        <CircularProgress size={60} />
      </Loading>
    ) : (
      <SuccessBlock>
        <SubmittedIcon />
        <ColoredButton
          label={formatMessage({id: 'callback.continue'})}
          handleClick={this.state.redirect}
          style={{marginTop: 10}}
        />
      </SuccessBlock>
    );
    return (
      <ColorBackground color='#eceff1'>
        <div className='page'>
          <ContentContainer>
            <Header />
            <Description>
              {description}
            </Description>
            {view}
          </ContentContainer>
        </div>
      </ColorBackground>
    );
  }
}

CallbackPage.contextTypes = {
  router: PropTypes.object.isRequired
};

CallbackPage.propTypes = {
  intl: intlShape.isRequired,
  location: PropTypes.object,
  user: PropTypes.object,
  confirmChangePassword: PropTypes.func,
  verify: PropTypes.func,
  terminateToken: PropTypes.func
};

const mapStateToProps = state => ({
  user: state.user
});

export default connect(mapStateToProps, {
  confirmChangePassword,
  verify,
  terminateToken
})(injectIntl(CallbackPage));
