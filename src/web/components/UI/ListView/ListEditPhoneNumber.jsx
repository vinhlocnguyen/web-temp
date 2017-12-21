import PropTypes from 'prop-types';
import React, { Component } from 'react';
import ReactTelephoneInput from 'react-telephone-input';
const isBrowser = typeof window !== 'undefined';
if (isBrowser) require('react-telephone-input/lib/withStyles');

class ListEditPhoneNumber extends Component {
  constructor() {
    super();
    this.handleOnChange = this.handleOnChange.bind(this);
  }
  handleOnChange(e) {
    if (this.props.onChange) {
      this.props.onChange(e);
    }
  }

  render () {
    const styles = {
      container: {
        display: 'flex',
        flexDirection: 'row',
        backgroundColor: '#ffffff',
        padding: '10px 14px',
        alignItems: 'center'
      },
      wrapper: {
        display: 'flex',
        flexDirection: 'column',
        flexGrow: 1
      },
      title: {
        fontFamily: 'Montserrat',
        fontSize: '13px',
        lineHeight: 1,
        color: '#22b1d7',
        marginBottom: '5px'
      },
      input: {
        fontFamily: 'Montserrat',
        fontSize: '14px',
        fontWeight: 300,
        lineHeight: 1.5,
        color: '#4a4a4a',
        border: 'none',
        flex: 1,
        background: 'none',
        outline: 'none'
      },
      button: {
        marginLeft: '42px'
      }
    };

    return (
      <div style={Object.assign(styles.container, this.props.style)}>
        <div style={styles.wrapper}>
          <div style={Object.assign(styles.title, this.props.titleStyle)}>
            {this.props.title} {this.props.subtitle}
          </div>
          <ReactTelephoneInput
              defaultCountry={'fr'}
              value={this.props.value}
              flagsImagePath={require('../../../assets/images/flags.png')}
              onChange={this.props.onChange}
            />
        </div>
      </div>
    );
  }
}

ListEditPhoneNumber.propTypes = {
  title: PropTypes.string,
  subtitle: PropTypes.node,
  handleClick: PropTypes.func,
  titleStyle: PropTypes.object,
  style: PropTypes.object,
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired
};

ListEditPhoneNumber.defaultProps = {
  style: {}
};

export default ListEditPhoneNumber;
