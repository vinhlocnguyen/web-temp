import PropTypes from 'prop-types';
import React, { Component } from 'react';

class Rating extends Component {
  render () {
    const styles = {
      iconStyle: {
        fontSize: '11px',
        lineHeight: 1.4,
        color: '#22b1d7'
      },
      wrapper: {
        display: 'flex',
        flexDirection: 'row'
      }
    };
    
    if (this.props.style && Object.keys(this.props.style).length) {
      styles.iconStyle = Object.assign(styles.iconStyle, this.props.style);
    }

    const EmptyStarIcon = () => (<i style={styles.iconStyle} className='fa fa-star-o' aria-hidden='true' />);
    const HalfStarIcon = () => (<i style={styles.iconStyle} className='fa fa-star-half-o' aria-hidden='true' />);
    const FullStarIcon = () => (<i style={styles.iconStyle} className='fa fa-star' aria-hidden='true' />);
    let half = this.props.score % 1 !== 0;
    const nbFull = half ? this.props.score - 0.5 : this.props.score;

    let stars = [];
    for (let i = 0; i < 5; i++) {
      if (nbFull >= i + 1) {
        stars.push(<FullStarIcon key={i}/>);
      } else if (half) {
        stars.push(<HalfStarIcon key={i}/>);
        half = false;
      } else {
        stars.push(<EmptyStarIcon key={i}/>);
      }
    }
    return (
      <div style={styles.wrapper}>
        {stars}
      </div>
    );
  }
}

Rating.propTypes = {
  score: PropTypes.number,
  style: PropTypes.object
};

export default Rating;
