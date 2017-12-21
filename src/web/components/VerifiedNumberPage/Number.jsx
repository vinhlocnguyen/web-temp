import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { injectIntl, intlShape } from 'react-intl';
// import Loading from '../UI/Loading';
import ColoredButton from '../UI/ColoredButton';
import ListEditPhoneNumber from '../UI/ListView/ListEditPhoneNumber';
import ReactGA from 'react-ga';

export class Number extends Component {
  constructor(props) {
    super(props);
    this.state = {
      phone: props.phone ? props.phone: null
    }

    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit() {
    if (this.state.phone) {
      this.props.handleSubmit(this.state.phone);
      ReactGA.event({
        category: 'Account',
        action: 'Verify phone number'
      });
    }
  }

  render() {
    const styles = {
      wrapper: {
        color: '#000',
        marginTop: 10
      }
    };
    const {formatMessage} = this.props.intl;
    return (
      <div style={styles.wrapper}>
        <ListEditPhoneNumber
          style={{padding: 0, backgroundColor: 'transparent'}}
          titleStyle={{display: 'none'}}
          defaultCountry={'fr'}
          value={this.state.phone}
          onChange={value => this.setState({phone: value})}
        />
        <ColoredButton
          label={formatMessage({id: 'verifynumber.number.buttonText'})}
          handleClick={this.handleSubmit}
        />
      </div>
    );
  }
}

Number.propTypes = {
  handleSubmit: PropTypes.func,
  intl: intlShape.isRequired
};

export default injectIntl(Number);
