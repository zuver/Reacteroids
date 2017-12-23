import React, { Component } from 'react';

// Length of time a message is displayed
const DISPLAY_TIME_IN_MS = 3000;

class FlashMessage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      message: 'Welcome to Spacewords',
      color: 'blue',
      visible: true,
      timeoutId: null
    };

    this.hide = this.hide.bind(this);
  }

  shouldComponentUpdate(nextProps, nextState) {
    const isNewMessage = nextProps.message !== this.state.message;

    if (isNewMessage) {
      this.onSetMessage(nextProps.message);
    }

    const shouldToggleVisibility = this.state.visible !== nextState.visible;

    return isNewMessage || shouldToggleVisibility;
  }

  onSetMessage(message) {
    // Clear current timeout
    if (this.state.timeoutId) {
      clearTimeout(this.state.timeoutId);
    }

    const timeoutId = setTimeout(this.hide, DISPLAY_TIME_IN_MS);
    this.setState({ message, visible: true, timeoutId });
  }

  hide() {
    this.setState({ visible: false });
  }

  render() {
    let textColor = this.getTextColor;

    return (
      <div
        className={this.state.visible ? 'flashit' : 'hidden'}
        style={{color: this.props.color}}
      >
        {this.state.message}
      </div>
    );
  }
}

export default FlashMessage;
