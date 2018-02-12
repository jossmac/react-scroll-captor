// @flow
import React from 'react';
import { shallow } from 'enzyme';
import ScrollCaptor from '../src/ScrollCaptor';

const captor = props =>
  shallow(
    <ScrollCaptor {...props}>
      <div />
    </ScrollCaptor>
  ).instance();

describe('ScrollCaptor', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });
  describe('component lifecycle methods', () => {
    it('componentDidMount - isEnabled', () => {
      const component = captor();
      component.startListening = jest.fn();
      component.componentDidMount();
      expect(component.startListening).toBeCalled();
    });
    it('componentDidMount - isEnabled=false', () => {
      const component = captor({ isEnabled: false });
      component.startListening = jest.fn();
      component.componentDidMount();
      expect(component.startListening).toHaveBeenCalledTimes(0);
    });
    it('componentWillUnmount', () => {
      const component = captor();
      component.stopListening = jest.fn();
      component.componentWillUnmount();
      expect(component.stopListening).toBeCalled();
    });
    it('componentWillReceiveProps - disabled to isEnabled', () => {
      const component = captor({ isEnabled: false });
      component.startListening = jest.fn();
      component.componentWillReceiveProps({ isEnabled: true });
      expect(component.startListening).toBeCalled();
    });
    it('componentWillReceiveProps - isEnabled to disabled', () => {
      const component = captor();
      component.stopListening = jest.fn();
      component.componentWillReceiveProps({ isEnabled: false });
      expect(component.stopListening).toBeCalled();
    });
  });
  describe('component methods', () => {
    let component;
    beforeEach(() => {
      component = captor();
    });
    describe('getScrollTarget', () => {
      it('should set scroll target as the child', () => {
        expect(component.scrollTarget).toBe(undefined);
        const child = <div>child</div>;
        component.getScrollTarget({ child });
        expect(component.scrollTarget).toBe(child);
      });
      it('should set the scrolling element to undefined if no argument passed', () => {
        component.getScrollTarget();
        expect(component.scrollTarget).toBe(undefined);
      });
    });
    describe('handleEventDelta', () => {
      it('should cancel scroll event if delta breaks lower limit', () => {
        component.cancelScrollEvent = jest.fn();
        component.scrollTarget = {
          scrollTop: 50,
          scrollHeight: 450,
          clientHeight: 400,
        };
        component.handleEventDelta({}, -60);
        expect(component.scrollTarget.scrollTop).toBe(0);
        expect(component.cancelScrollEvent).toBeCalled();
      });
      it('should cancel scroll event if delta breaks upper limit', () => {
        const scrollHeight = 450;
        component.cancelScrollEvent = jest.fn();
        component.scrollTarget = {
          scrollTop: 400,
          scrollHeight,
          clientHeight: 400,
        };
        component.handleEventDelta({}, 60);
        expect(component.scrollTarget.scrollTop).toBe(scrollHeight);
        expect(component.cancelScrollEvent).toBeCalled();
      });
    });
    describe('onWheel', () => {
      it('should call handleEventDelta with correct args', () => {
        const synthEvent = { deltaY: 60 };
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
        const touchClientY = 50;
        component.onTouchStart({
          changedTouches: [{ clientY: touchClientY }],
        });
        expect(component.touchStart).toBe(touchClientY);
      });
    });
    describe('onTouchMove', () => {
      it('should call handleEventDelta with correct args', () => {
        const touchClientY = 70;
        const touchStart = 50;
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
    describe('cancelScrollEvent', () => {
      it('should cancel scroll event', () => {
        const synthEvent = {
          stopPropagation: jest.fn(),
          preventDefault: jest.fn(),
        };
        cancelScrollEvent(synthEvent);
        expect(synthEvent.stopPropagation).toBeCalled();
        expect(synthEvent.preventDefault).toBeCalled();
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
          ['keydown', component.onKeyDown, false],
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
          ['keydown', component.onKeyDown, false],
        ];
        expect(scrollTarget.removeEventListener.mock.calls).toEqual(calls);
      });
    });
  });
});
