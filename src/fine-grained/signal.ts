/* eslint-disable @typescript-eslint/ban-types */
const effectStack: Function[] = [];

export const createEffect = (fn: Function) => {
  effectStack.push(fn);
  fn();
  effectStack.pop();
};

export const createSignal = <T>(value: T): Signal<T> => {
  const signal: Signal<T> = ((v: T) => {
    signal._value = v;
    queueEffect(signal.effects);
  }) as Signal<T>;
  signal._value = value;
  signal.effects = new Set();
  Object.defineProperty(signal, 'value', {
    get() {
      if (!effectStack.length) return signal._value;
      const activeEffect = <Function>effectStack.at(-1);
      signal.effects.add(activeEffect);
      return signal._value;
    },
  });
  return signal;
};

export type Signal<T> = {
  _value: T;
  get value(): T;
  effects: Set<Function>;
  (v: T): void;
};

let queued = false;
const reactionQueue = new Set<Function>();

const queueEffect = (fns: Set<Function>) => {
  fns.forEach((fn) => reactionQueue.add(fn));
  if (queued) return;
  queued = true;
  queueMicrotask(() => {
    reactionQueue.forEach((fn) => fn());
    reactionQueue.clear();
    queued = false;
  });
};

export const isSignal = <T>(thing: T | Signal<T>): thing is Signal<T> =>
  typeof thing === 'function' && 'value' in thing;
