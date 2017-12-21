import PropTypes from 'prop-types';
import React, { Component } from 'react';
require('../../assets/styles/form.scss');
import styled from 'styled-components';

export const StyledLabel = styled.span`
  font-family: ${(props) => props['font-family'] || 'Montserrat'};
  font-size: ${(props) => props['font-size'] || '14'}px;
  color: ${(props) => props.color || 'rgba(169, 169, 169, 0.6)'};
  margin-left: ${(props) => props['margin-left'] || '5'}px;
`;

class Checkbox extends Component {
  constructor() {
    super();
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(e) {
    this.props.onCheck(e.target.checked);
  }

  render() {
    const Wrapper = styled.div`
      ${this.props.style}
    `;
    return (
      <Wrapper className="checkbox">
        <input
          type='checkbox'
          onChange={this.handleChange}
          checked={this.props.checked}
        />
        <label />
        <StyledLabel {...this.props.labelStyle}>{this.props.label}</StyledLabel>
      </Wrapper>
    );
  }
}

Checkbox.propTypes = {
  onCheck: PropTypes.func.isRequired,
  checked: PropTypes.bool,
  label: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object
  ]),
  style: PropTypes.object,
  labelStyle: PropTypes.object
};

Checkbox.defaultProps = {
  style: {}
};

export default Checkbox;
