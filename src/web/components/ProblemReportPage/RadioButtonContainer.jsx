import PropTypes from 'prop-types';
import React, { Component } from 'react';
import styled from 'styled-components';
const Container = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-content: 'flex-start';
  justify-content: space-between;
`;
export class RadioButtonContainer extends Component {

  constructor() {
    super();

    this.state = {
      currentSelection: undefined
    };
  }

  componentWillMount(props) {
    if (this.props.selected) {
      this.setState({currentSelection: this.props.selected});
    }
  }

  componentWillReceiveProps(nextProps) {
    if (!nextProps.selected) {
      this.setState({currentSelection: undefined});
    }
  }

  handleClick(possibility) {
    if (this.state.currentSelection === possibility) {
      this.setState({ currentSelection: undefined });
      this.props.onSelect(undefined);
    } else {
      this.setState({ currentSelection: possibility });
      this.props.onSelect(possibility);
    }
  };

  render() {
    return (
      <Container>
        {this.props.possibilities.map((possibility, index) => {
          return (
            <div
              className={'stepper-radio-button'}
              style={{
                width: '47%',
                marginTop: '20px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: '4px',
                height: '50px',
                border: '1px solid #0c78be',
                color: this.state.currentSelection !== possibility ? '#0c78be' : '#ffffff',
                backgroundColor: this.state.currentSelection !== possibility ? 'rgba(0,0,0,0)' : '#0c78be',
                WebkitUserSelect: 'none',
                MozUserSelect: 'none',
                KhtmlUserSelect: 'none',
                MsUserSelect: 'none'
              }}
              key={index}
              onTouchTap={this.handleClick.bind(this, possibility)}>
                {possibility}
            </div>
          );
        })}
      </Container>
    );
  }
}

RadioButtonContainer.propTypes = {
  selected: PropTypes.string,
  possibilities: PropTypes.array,
  onSelect: PropTypes.func.isRequired
};
RadioButtonContainer.defaultProps = {
  possibilities: []
};
export default RadioButtonContainer;
