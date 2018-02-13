// @flow

import React, { Component } from 'react';

import ScrollCaptor, { type CaptorProps } from './ScrollCaptor';

type SwitchProps = CaptorProps & {
  isEnabled: boolean,
};

export default class ScrollCaptorSwitch extends Component<SwitchProps> {
  static defaultProps = { isEnabled: true };
  render() {
    const { isEnabled, ...props } = this.props;
    return isEnabled ? <ScrollCaptor {...props} /> : this.props.children;
  }
}
