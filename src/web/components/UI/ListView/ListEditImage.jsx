import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { setError } from '../../../../redux/actions/error';
import ImageView from '../Image';
import RemoveButton from './RemoveButton';
import styled from 'styled-components';
import { media } from '../../styleUlti';

const Container = styled.div`
  display: flex;
  flex-direction: row;
  background-clor: #ffffff;
  padding: 10px 14px;
  align-items: center;
`;
const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1
`;
const Title = styled.div`
  font-family: Montserrat;
  font-size: 13px;
  line-height: 1;
  color: #22b1d7;
  margin-bottom: 5px;
`;
const Content = styled.div``;
const StyledButton = styled.div`
  margin-left: 42px;
`;
const ReviewWrapper = styled.div`
  width: 200px;
  height: 150px;
  overflow: hidden;
  margin-bottom: 5px
`;

class ListEditImage extends Component {
  constructor(props) {
    super(props);
    this.placeholderImage = `https://placehold.it/200x150?text=${props.placeholder}`;
    this.originalSize = { width: 200, height: 150 };
    this.state = {
      image: props.image || this.placeholderImage,
      width: this.originalSize.width,
      height: this.originalSize.height
    };
    //bindings functions
    this.handleChange = this.handleChange.bind(this);
    this.handleRemoveImg = this.handleRemoveImg.bind(this);
  }

  handleChange(e) {
    e.preventDefault();
    const files = e.target.files;
    const reader = new FileReader();
    const readFile = index => {
      // check file exists
      if (index >= files.length) return;
      const file = files[index];
      // check file-size
      if (file.size > 5242880) {
        this.props.setError(413);
        return;
      };
      // load image data
      reader.onload = e => {
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
            image: reader.result,
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

  handleRemoveImg() {
    if (this.props.onRemove){
      this.setState({
        image: this.placeholderImage
      });
      this.props.onRemove();
    }
  }

  toggleRemoveButton(){
    if (!this.state.image || this.state.image == this.placeholderImage || !this.props.onRemove)
      return {display: 'none'};
    else
      return {display: 'block'};
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
      image: {
        style: {
          width: `${this.state.width}px`,
          height: `${this.state.height}px`
        }
      },
      removeBtn: {
        width: '18px',
        height: '18px',
        cursor: 'pointer',
        paddingLeft: '203px',
        marginBottom: '-15px'
      }
    };
    return (
      <div style={Object.assign({}, styles.container, this.props.style)}>
        <Wrapper>
          <Title>
            {this.props.title} {this.props.subtitle}
          </Title>
          <Content>
            <RemoveButton style={Object.assign(this.toggleRemoveButton.bind(this)(), styles.removeBtn)}
              onHandleClick={this.handleRemoveImg} />
            <ReviewWrapper>
              <ImageView
                style={styles.image}
                src={this.state.image} />
            </ReviewWrapper>
            <input type='file' onChange={this.handleChange} />
          </Content>
        </Wrapper>
      </div>
    );
  }
}

ListEditImage.propTypes = {
  title: PropTypes.string,
  subtitle: PropTypes.node,
  image: PropTypes.string, // This could be a text or something like an image
  onChange: PropTypes.func,
  onRemove: PropTypes.func,
  style: PropTypes.object,
  setError: PropTypes.func,
  placeholder: PropTypes.string
};

ListEditImage.defaultProps = {
  style: {}
};

const mapDispatchToProps = {
  setError
};

export default connect(null, mapDispatchToProps)(ListEditImage);
