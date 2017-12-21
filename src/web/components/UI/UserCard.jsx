import PropTypes from 'prop-types';
import React, { Component } from 'react';
import {
  NameIcon,
  MailIcon,
  BuildingIcon
} from './Icons';
import Avatar from './Avatar';
import ColoredButton from './ColoredButton';

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column'
  },
  avatarView: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10
  },
  rowView: {
    display: 'flex',
    flexDirection: 'row',
    marginBottom: 10,
    borderBottom: '1px solid #E0E0E0',
    paddingBottom: 5
  },
  lastRow: {
    borderBottom: 'none',
    paddingBottom: 'none',
    marginBottom: 'none'
  },
  content: {
    fontFamily: 'Montserrat',
    fontSize: '14px',
    lineHeight: '20px',
    color: '#4a4a4a',
    height: '20px'
  },
  icon: {
    width: 40,
    display: 'flex',
    alignItems: 'center'
  }
};

class UserCard extends Component {
  render() {
    const user = this.props.user;
    return (
      <div style={styles.container}>
        <div style={styles.avatarView}>
          <Avatar avatarUrl={user.avatarUrl} />
        </div>
        <div style={styles.rowView}>
          <div style={styles.icon}>
            <NameIcon />
          </div>
          <div style={styles.content}>{user.firstName + ' ' + user.lastName}</div>
        </div>
        <div style={styles.rowView}>
          <div style={styles.icon}>
            <MailIcon />
          </div>
          <div style={styles.content}>{user.email}</div>
        </div>
        <div style={styles.rowView}>
          <div style={styles.icon}>
            <BuildingIcon />
          </div>
          <div style={styles.content}>{user.workEmail}</div>
        </div>
        {this.props.isAdmin && !this.props.user.flatTurtleAdmin && (
          <div style={Object.assign({}, styles.rowView, styles.lastRow)}>
            <ColoredButton
              label={'Grant Admin'}
              handleClick={this.props.onGrantAdmin}
            />
          </div>
        )}
      </div>
    );
  }
}

UserCard.propTypes = {
  user: PropTypes.object.isRequired,
  onGrantAdmin: PropTypes.func.isRequired,
  isAdmin: PropTypes.bool
};

export default UserCard;
