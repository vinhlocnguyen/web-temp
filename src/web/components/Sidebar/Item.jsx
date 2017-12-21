import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class Item extends Component {
  render () {
    const styles = {
      container: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        height: '60px',
        textDecoration: 'none',
        cursor: 'pointer'
      },
      label: {
        fontFamily: 'Montserrat',
        fontSize: '15px',
        lineHeight: 1.1,
        color: 'rgb(255, 255, 255)'
      },
      iconContainer: {
        width: '50px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }
    };

    return (
      <li>
        {this.props.target && (
          <Link style={styles.container} to={this.props.target}>
            <div style={styles.iconContainer}>
              {this.props.icon}
            </div>
            <div style={styles.label}>
              {this.props.label}
            </div>
          </Link>
        )}
        {this.props.handleClick && !this.props.target && (
          <div style={styles.container} onTouchTap={() => { this.props.handleClick(); }}>
            <div style={styles.iconContainer}>
              {this.props.icon}
            </div>
            <div style={styles.label}>
              {this.props.label}
            </div>
          </div>
        )}
      </li>
    );
  }
}

Item.propTypes = {
  icon: PropTypes.node.isRequired,
  label: PropTypes.string.isRequired,
  target: PropTypes.string,
  handleClick: PropTypes.func
};

export default Item;
