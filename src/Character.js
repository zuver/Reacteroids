import React from 'react';

export default class Character extends React.Component {
  constructor(props) {
    super();
  }

  render() {
    return (
      <div>
        {this.props.value}
      </div>
    );
  }
}