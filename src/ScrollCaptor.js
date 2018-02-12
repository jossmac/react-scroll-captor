// @flow

import React, { Component, type Element } from 'react';
import NodeFinder from 'react-node-resolver';
import rafSchedule from 'raf-schd';

export type CaptorProps = {
  children: Element<*>,
  isEnabled: boolean,
  onBottomArrive: (event: SyntheticEvent<HTMLElement>) => void,
  onBottomLeave: (event: SyntheticEvent<HTMLElement>) => void,
  onTopArrive: (event: SyntheticEvent<HTMLElement>) => void,
  onTopLeave: (event: SyntheticEvent<HTMLElement>) => void,
};

export function cancelScrollEvent(event: SyntheticEvent<HTMLElement>) {
  event.preventDefault();
  event.stopPropagation();

  return false;
}

export default class ScrollCaptor extends Component<CaptorProps> {
  atBottom: boolean = false;
  atTop: boolean = false;
  scrollTarget: HTMLElement;
  touchStart: number;
  static defaultProps = { isEnabled: true };

  componentDidMount() {
    const el = this.scrollTarget;

    // bail early if no scroll available
    if (el.scrollHeight <= el.clientHeight) return;

    // all the if statements are to appease Flow 😢
    if (typeof el.addEventListener === 'function') {
      el.addEventListener('wheel', this.onWheel, false);
    }
    if (typeof el.addEventListener === 'function') {
      el.addEventListener('touchstart', this.onTouchStart, false);
    }
    if (typeof el.addEventListener === 'function') {
      el.addEventListener('touchmove', this.onTouchMove, false);
    }
  }
  componentWillUnmount() {
    const el = this.scrollTarget;

    // bail early if no scroll available
    if (el.scrollHeight <= el.clientHeight) return;

    // all the if statements are to appease Flow 😢
    if (typeof el.removeEventListener === 'function') {
      el.removeEventListener('wheel', this.onWheel, false);
    }
    if (typeof el.removeEventListener === 'function') {
      el.removeEventListener('touchstart', this.onTouchStart, false);
    }
    if (typeof el.removeEventListener === 'function') {
      el.removeEventListener('touchmove', this.onTouchMove, false);
    }
  }
  getScrollTarget = (ref: HTMLElement) => {
    this.scrollTarget = ref;
  };
  handleEventDelta = (event: SyntheticEvent<HTMLElement>, delta: number) => {
    const {
      onBottomArrive,
      onBottomLeave,
      onTopArrive,
      onTopLeave,
    } = this.props;
    const { scrollTop, scrollHeight, clientHeight } = this.scrollTarget;
    const target = this.scrollTarget;
    const isDeltaPositive = delta > 0;
    const availableScroll = scrollHeight - clientHeight - scrollTop;
    let shouldCancelScroll = false;
    // reset at bottom/top
    if (availableScroll > delta && this.atBottom) {
      if (onBottomLeave) onBottomLeave(event);
      this.atBottom = false;
    }
    if (isDeltaPositive && this.atTop) {
      if (onTopLeave) onTopLeave(event);
      this.atTop = false;
    }
    // bottom limit
    if (isDeltaPositive && delta > availableScroll) {
      if (onBottomArrive && !this.atBottom) {
        onBottomArrive(event);
      }
      target.scrollTop = scrollHeight;
      shouldCancelScroll = true;
      this.atBottom = true;
    } else if (!isDeltaPositive && -delta > scrollTop) {
      // top limit
      if (onTopArrive && !this.atTop) {
        onTopArrive(event);
      }
      target.scrollTop = 0;
      shouldCancelScroll = true;
      this.atTop = true;
    }
    // cancel scroll
    if (shouldCancelScroll) {
      cancelScrollEvent(event);
    }
  };
  onWheel = (event: SyntheticWheelEvent<HTMLElement>) => {
    this.handleEventDelta(event, event.deltaY);
  };
  onTouchStart = (event: SyntheticTouchEvent<HTMLElement>) => {
    // set touch start so we can calculate touchmove delta
    this.touchStart = event.changedTouches[0].clientY;
  };
  onTouchMove = (event: SyntheticTouchEvent<HTMLElement>) => {
    const deltaY = this.touchStart - event.changedTouches[0].clientY;
    this.handleEventDelta(event, deltaY);
  };
  render() {
    return (
      <NodeFinder innerRef={this.getScrollTarget}>
        {this.props.children}
      </NodeFinder>
    );
  }
}
