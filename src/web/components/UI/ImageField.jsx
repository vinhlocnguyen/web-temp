import PropTypes from 'prop-types';
import React, { Component } from 'react';
import RemoveButton from './ListView/RemoveButton';
import styled from 'styled-components';


const Container = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 15px;
`;
const LabelWrapper = styled.div`
  margin-bottom: 5px;
`;
const StyledLabel = styled.span`
  color: #17282D;
  height: 16.5px;
  font-family: Montserrat;
  font-size: 14px;
  font-weight: 300;
  margin-bottom: 10px;
`;
const Preview = styled.div`
  width: 200px;
  height: 150px;
  display: flex;
  justify-content: center;
  align-tems: center;
  overflow: hidden;
`;
const StyledImg = styled.img`
  width: ${(props) => props.width}px;
  height: ${(props) => props.height}px;
`;
const styles = {
  removeBtn: {
    width: '18px',
    height: '18px',
    cursor: 'pointer',
    paddingLeft: '203px',
    marginBottom: '-15px',
  }
}


class ImageField extends Component {
  constructor(props) {
    super(props);
    this.placeholderImage = `https://placehold.it/200x150?text=${props.placeholder}`;
    this.originalSize = { width: 200, height: 150 };
    this.state = {
      preview: this.placeholderImage,
      width: this.originalSize.width,
      height: this.originalSize.height
    };
    //bindings functions
    this.handleChange = this.handleChange.bind(this);
    this.handleRemoveImg = this.handleRemoveImg.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (!nextProps.value) {
      this.setState({
        preview: this.placeholderImage,
        width: this.originalSize.width,
        height: this.originalSize.height
      });
      this.refs.image.value = '';
    }
  }

  handleRemoveImg() {
    if (this.props.onRemove){
      this.setState({
        preview: this.placeholderImage
      });
      this.props.onRemove();
    }
  }


  handleChange(e) {
    e.preventDefault();
    const files = e.target.files;
    const reader = new FileReader();
    const readFile = index => {
      if (index >= files.length) return;
      const file = files[index];
      reader.onload = e => {
        this.setState({
          preview: reader.result
        });
        this.props.onChange(reader.result.replace("data:" + file.type + ";base64,", ''));
        readFile(index + 1);
        // the code below helps to make sure the thumbnail image
        // always fits by width or height and the image doesn't scale
        const image = new Image();
        image.onload = () => {
          const rootRatio = this.originalSize.width / this.originalSize.height;
          const inputRatio = image.width / image.height;
          const optimizedWidth = rootRatio > inputRatio ? this.originalSize.width : (image.width / (image.height / this.originalSize.height));
          const optimizedHeight = rootRatio > inputRatio ? (image.height / (image.width / this.originalSize.width)) : this.originalSize.height;
          this.setState({
            width: optimizedWidth,
            height: optimizedHeight
          });
        };
        image.src = reader.result;
      };
      reader.readAsDataURL(file);
    };
    readFile(0);
  }

  render() {

    let isShowRemoveBtn = this.props.value && this.props.onRemove;

    return (
      <Container>
        <LabelWrapper><StyledLabel>{this.props.label}</StyledLabel></LabelWrapper>
        <RemoveButton style={Object.assign({display: isShowRemoveBtn ? 'block' : 'none'}, styles.removeBtn)}
          onHandleClick={this.handleRemoveImg} />
        <Preview>
          <StyledImg width={this.state.width} height={this.state.height} src={this.state.preview} />
        </Preview>
        <input type='file' ref='image' onChange={this.handleChange} />
      </Container>
    );
  }
}

ImageField.propTypes = {
  label: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  onRemove: PropTypes.func,
  placeholder: PropTypes.string
};

export default ImageField;
