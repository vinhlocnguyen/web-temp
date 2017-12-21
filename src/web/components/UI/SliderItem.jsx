import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Slider from 'material-ui/Slider';
import styled from 'styled-components';

/**
 * The slider appearance changes when not at the starting position.
 */
const Container = styled.div`
  display: flex;
  flex-direction: row;
`;
const SliderWrapper = styled.span`
  display: flex;
  flex-direction: column;
  flex-grow: 2;
`;
const SliderValue = styled.span`
  display: flex;
  flex-direction: column;
  padding: 5px;
  width: 13px;
  text-align: center;
  color: #4a4a4a;
  border: 1px solid #4a4a4a;
  font-size: 12px;
  background-color: lightGray;
  margin-right: 17px;
`;
const defaultStyle = {
  slider: {
    marginBottom: '0px',
    marginTop: '0px'
  }
}
class SliderItem extends Component {
  constructor(props) {
    super(props);

    this.handleSlider = this.handleSlider.bind(this);
  }

  handleSlider(event, value) {
    this.props.onChange(event, value);
  }

  render() {
    return (
      <Container>
        <SliderWrapper>
          <Slider sliderStyle={defaultStyle.slider} style={{marginRight: '15px'}} step={this.props.step} min={this.props.min} max={this.props.max} value={this.props.value} onChange={this.handleSlider} />
        </SliderWrapper>
        <SliderValue >{this.props.value}</SliderValue>
      </Container>
    )
  }
}

SliderItem.propTypes = {
  onChange: PropTypes.func,
  value: PropTypes.number,
  min: PropTypes.number,
  max:PropTypes.number,
  style: PropTypes.object,
  step: PropTypes.number
}

export default SliderItem;
