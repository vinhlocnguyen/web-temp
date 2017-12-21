import PropTypes from 'prop-types';
import React, { Component } from 'react';
import SelectField from '../SelectField';
import SelectItem from '../SelectItem';
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
  }
};
class ListEditSelector extends Component {

  render() {
    const items = this.props.items.map((item, index) => {
      if (!this.props.display) {
        return (<SelectItem key={index} value={item}>{item}</SelectItem>);
      } else {
        return (<SelectItem key={index} value={item}>{typeof item === 'object' ? item[this.props.display]: item}</SelectItem>);
      }
    });
    return (
      <div style={Object.assign(styles.container, this.props.style)}>
        <div style={styles.wrapper}>
          <div style={styles.title}>
            {this.props.title} {this.props.subtitle}
          </div>
          <SelectField
            selected={this.props.selected}
            onChange={this.props.onChange}
          >
            {items}
          </SelectField>
        </div>
      </div>
    );
  }
}

ListEditSelector.propTypes = {
  title: PropTypes.string,
  subtitle: PropTypes.string,
  selected: PropTypes.string.isRequired,
  items: PropTypes.array.isRequired,
  onChange: PropTypes.func.isRequired,
  display: PropTypes.string,
  style: PropTypes.object
};

export default ListEditSelector;
