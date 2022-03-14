import { reject } from 'lodash';
import { storeEventEmitter } from './functions';

export default function createStore() {
  let suppressEvent = false;

  this._state = {};

  this.state = new Proxy(this._state, {
    set(target, prop, value) {
      if (!suppressEvent)
        storeEventEmitter.emit('store-updated', target);

      suppressEvent = false;

      return Reflect.set(target, prop, value);
    },
  });

  this.get = (key) => this.state[key];

  this.set = (key, value, options = {}) => {
    suppressEvent = !!options.suppressEvent;

    this.state[key] = value;
  };

  this.push = (key, value) => {
    const currentKeyState = this.state[key];

    this.state[key] = !currentKeyState ? [value] : [...currentKeyState, value];
  };

  this.reject = (key, removeValue) => {
    this.state[key] = reject(this.state[key], (val) => val === removeValue);
  };

  return {
    getState: () => this.state,
    get     : this.get,
    set     : this.set,
    push    : this.push,
    reject  : this.reject,
  };
}
