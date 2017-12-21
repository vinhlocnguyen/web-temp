import PropTypes from 'prop-types';
import React, { Component } from 'react';
import Logo from '../components/UI/Logo';
import ColorBackground from '../components/Backgrounds/ColorBackground';

const styles = {
  wrapper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh'
  }
}

class WaitingScreen extends Component {
  constructor() {
    super();
    this.state = {
      isLoaded: false
    };
  }

  componentDidMount() {
    window.onload = () => {
      this.setState({
        isLoaded: true
      });
    };
  }

  showWaitingScreen() {
    const spinner = require('../assets/images/spinner.gif');
    return (
      <div>
        <ColorBackground bgColor={'#eceff1'}>
        <div style={styles.wrapper}>
          <Logo width='180px' height='60px' />
          <img src={spinner} width={90} height={90} />
        </div>
        </ColorBackground>
      </div>
    );
  }

  render() {
    let isLoaded = this.state.isLoaded;
    const context = this.props.children.props.context;
    if (context && context.isServer) isLoaded = true;
    return isLoaded ? (
      React.cloneElement(this.props.children)
    ) : this.showWaitingScreen();
  }
}

WaitingScreen.propTypes = {
  children: PropTypes.node
};

export default WaitingScreen;
