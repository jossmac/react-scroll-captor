import React from 'react';
import { mount } from 'enzyme';
import ScrollCaptor from '../src/ScrollCaptor';
import Switch from '../src/Switch';

const scrollCaptor = props => mount(
  <ScrollCaptor {...props}>
    <div />
  </ScrollCaptor>
).instance();

const scrollSwitch = props => mount(
  <Switch {...props}>
    <div />
  </Switch>
);

describe('ScrollCaptor', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });
  describe('component lifecycle methods', () => {
    it('componentDidMount', () => {
      const component = scrollCaptor();
      component.startListening = jest.fn();
      component.componentDidMount();
      expect(component.startListening).toBeCalled();
    });
    it('componentWillUnmount', () => {
      const component = scrollCaptor();
      component.stopListening = jest.fn();
      component.componentWillUnmount();
      expect(component.stopListening).toBeCalled();
    });
  });
  describe('component methods', () => {
    let component;
    beforeEach(() => {
      component = scrollCaptor();
    });
    describe('getScrollTarget', () => {
      it('should set scroll target as the child', () => {
        const child = <div>child</div>;
        component.getScrollTarget(child);
        expect(component.scrollTarget).toBe(child);
      });
      it('should set the scrolling element to undefined if no argument passed', () => {
        component.getScrollTarget();
        expect(component.scrollTarget).toBe(undefined);
      });
    });
    describe('handleEventDelta', () => {
      it('should cancel scroll event if delta breaks lower limit', () => {
        component.cancelScroll = jest.fn();
        component.scrollTarget = {
          scrollTop: 80,
          scrollHeight: 390,
          clientHeight: 300,
        };
        component.handleEventDelta({}, -90);
        expect(component.scrollTarget.scrollTop).toBe(0);
        expect(component.cancelScroll).toBeCalled();
      });
      it('should cancel scroll event if delta breaks upper limit', () => {
        const scrollHeight = 360;
        component.cancelScroll = jest.fn();
        component.scrollTarget = {
          scrollTop: 300,
          scrollHeight,
          clientHeight: 300,
        };
        component.handleEventDelta({}, 90);
        expect(component.scrollTarget.scrollTop).toBe(scrollHeight);
        expect(component.cancelScroll).toBeCalled();
      });
    });
    describe('onWheel', () => {
      it('should call handleEventDelta with correct args', () => {
        const synthEvent = { deltaY: 90 };
        component.handleEventDelta = jest.fn();
        component.onWheel(synthEvent);
        expect(component.handleEventDelta).toBeCalledWith(
          synthEvent,
          synthEvent.deltaY
        );
      });
    });
    describe('onTouchStart', () => {
      it('should set this.touchStart', () => {
        const touchClientY = 80;
        component.onTouchStart({
          changedTouches: [{ clientY: touchClientY }],
        });
        expect(component.touchStart).toBe(touchClientY);
      });
    });
    describe('onTouchMove', () => {
      it('should call handleEventDelta with correct args', () => {
        const touchClientY = 70;
        const touchStart = 80;
        const synthEvent = {
          changedTouches: [{ clientY: touchClientY }],
        };
        component.handleEventDelta = jest.fn();
        component.touchStart = touchStart;
        component.onTouchMove(synthEvent);
        expect(component.handleEventDelta).toBeCalledWith(
          synthEvent,
          touchStart - touchClientY
        );
      });
    });
    describe('startListening', () => {
      it('should add event listeners', () => {
        const scrollTarget = {
          addEventListener: jest.fn(),
        };
        component.startListening(scrollTarget);
        const calls = [
          ['wheel', component.onWheel, false],
          ['touchstart', component.onTouchStart, false],
          ['touchmove', component.onTouchMove, false],
        ];
        expect(scrollTarget.addEventListener.mock.calls).toEqual(calls);
      });
    });
    describe('stopListening', () => {
      it('should remove event listeners', () => {
        const scrollTarget = {
          removeEventListener: jest.fn(),
        };
        component.stopListening(scrollTarget);
        const calls = [
          ['wheel', component.onWheel, false],
          ['touchstart', component.onTouchStart, false],
          ['touchmove', component.onTouchMove, false],
        ];
        expect(scrollTarget.removeEventListener.mock.calls).toEqual(calls);
      });
    });
  });
});

describe('Switch', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });
  describe('component lifecycle methods', () => {
    it('componentDidMount', () => {
      const component = scrollSwitch();
      expect(component.find(ScrollCaptor)).toHaveLength(1);
    });
    it('componentDidMount - isEnabled=false', () => {
      const component = scrollSwitch({ isEnabled: false });
      expect(component.find(ScrollCaptor)).toHaveLength(0);
    });
  });
});
