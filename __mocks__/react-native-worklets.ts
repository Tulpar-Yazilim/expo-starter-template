const NOOP = () => {};
const ID = <T>(fn: T): T => fn;

module.exports = {
  runOnJS: ID,
  runOnUI: ID,
  makeShareable: ID,
  makeRemoteFunction: ID,
  createRunOnJS: (fn: (...args: Array<unknown>) => unknown) => fn,
  useWorkletCallback: (fn: (...args: Array<unknown>) => unknown) => fn,
  useSharedValue: <T>(init: T) => ({ value: init }),
  useWorklet: (fn: (...args: Array<unknown>) => unknown) => fn,
  WorkletsModule: {},
  getWorkletDomainObject: () => ({}),
  isWorklet: () => false,
  NOOP,
};
