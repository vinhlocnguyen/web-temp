import PropTypes from 'prop-types';
import React, { Component } from 'react';

class ListViewImage extends Component {
  render () {
    const styles = {
      container: {
        borderBottom: '1 px solid rgba(0, 0, 0, 0.12)',
        height: '180px'
      },
      mainWrapper: {
        position: 'relative',
        overflow: 'hidden',
        height: '100%'
      },
      imageSource: {
        backgroundImage: `url("${this.props.imageUrl}")`,
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'left top',
        width: '100%',
        height: '100%',
        position: 'absolute'
      },
      bgColor: {
        height: '120px',
        objectFit: 'contain',
        marginTop: '60px',
        backgroundImage: 'linear-gradient(to bottom, rgba(0, 0, 0, 0.0), #ffffff)'
      }
    };

    return (
      <div style={styles.container}>
        <div style={styles.mainWrapper}>
          <div style={styles.imageSource}>
            <div style={styles.bgColor}>
            </div>
          </div>
          {this.props.caption && (
            <div>{this.props.caption}</div>
          )}
        </div>

      </div>
    );
  }
}

ListViewImage.propTypes = {
  imageUrl: PropTypes.string.isRequired,
  caption: PropTypes.string
};

export default ListViewImage;
