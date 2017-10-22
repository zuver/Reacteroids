import React, { Component } from 'react';

class TextInput extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        {this.props.value.join('')}
      </div>
    );
  }
}

export default TextInput;
