import React, {Component} from 'react';

//TODO build the other items on top of this one
class GenericItem extends Component {
  render () {
    const style = {
      backgroundColor: '#ffffff',
      padding: '10px 14px'
    };

    return (
      <div style={style}>
        {this.props.children}
      </div>
    );
  }
}

export default GenericItem;
