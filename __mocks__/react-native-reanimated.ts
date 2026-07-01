const {
  View: RNView,
  ScrollView: RNScrollView,
  FlatList: RNFlatList,
} = require('react-native');

const NOOP = () => {};
const ID = <T>(t: T): T => t;

const useSharedValue = <T>(init: T) => {
  const ref = { value: init };
  return new Proxy(ref, {
    get(target, prop) {
      if (prop === 'value') {
        return target.value;
      }
      if (prop === 'get') {
        return () => target.value;
      }
      if (prop === 'set') {
        return (v: T) => {
          target.value =
            typeof v === 'function' ? (v as (c: T) => T)(target.value) : v;
        };
      }
      return undefined;
    },
    set(target, prop, value) {
      if (prop === 'value') {
        target.value = value;
        return true;
      }
      return false;
    },
  });
};

// Create wrapper components with displayName
const AnimatedView = RNView;
AnimatedView.displayName = 'View';

const AnimatedScrollView = RNScrollView;
AnimatedScrollView.displayName = 'ScrollView';

const AnimatedFlatList = RNFlatList;
AnimatedFlatList.displayName = 'FlatList';

const AnimatedObj = {
  View: AnimatedView,
  ScrollView: AnimatedScrollView,
  FlatList: AnimatedFlatList,
};

export default AnimatedObj;

module.exports = {
  default: AnimatedObj,
  Animated: AnimatedObj,
  ScrollView: AnimatedScrollView,
  FlatList: AnimatedFlatList,

  // Hooks
  useSharedValue,
  useAnimatedStyle: (fn: () => object) => fn(),
  useAnimatedProps: (fn: () => object) => fn(),
  useAnimatedRef: () => ({ current: null }),
  useAnimatedScrollHandler: () => NOOP,
  useAnimatedGestureHandler: () => NOOP,
  useAnimatedReaction: NOOP,
  useAnimatedSensor: () => ({ sensor: useSharedValue(null) }),
  useDerivedValue: (fn: () => unknown) => useSharedValue(fn()),
  useAnimatedKeyboard: () => ({
    height: useSharedValue(0),
    state: useSharedValue(0),
  }),
  useScrollViewOffset: () => useSharedValue(0),
  useReducedMotion: () => false,
  useFrameCallback: NOOP,

  // Animations
  withTiming: ID,
  withSpring: ID,
  withDecay: ID,
  withRepeat: ID,
  withSequence: (..._args: Array<unknown>) => _args[_args.length - 1],
  withDelay: (_delay: number, animation: unknown) => animation,

  // Utilities
  cancelAnimation: NOOP,
  measure: () => ({ x: 0, y: 0, width: 0, height: 0, pageX: 0, pageY: 0 }),
  runOnJS: (fn: (...args: Array<unknown>) => unknown) => fn,
  runOnUI: (fn: (...args: Array<unknown>) => unknown) => fn,
  makeMutable: useSharedValue,
  createAnimatedComponent: (component: unknown) => component,
  addWhitelistedNativeProps: NOOP,
  addWhitelistedUIProps: NOOP,
  getAnimatedStyle: (ref: { props?: { style?: object } }) =>
    ref?.props?.style ?? {},
  setUpTests: NOOP,
  advanceAnimationByTime: NOOP,
  advanceAnimationByFrame: NOOP,
  withReanimatedTimer: (fn: () => void) => fn(),

  // Enums / constants
  Extrapolation: { CLAMP: 'clamp', EXTEND: 'extend', IDENTITY: 'identity' },
  ReduceMotion: { System: 'system', Always: 'always', Never: 'never' },
  SensorType: {
    ACCELEROMETER: 1,
    GYROSCOPE: 2,
    GRAVITY: 3,
    MAGNETIC_FIELD: 4,
    ROTATION: 5,
  },
  KeyboardState: { UNKNOWN: 0, OPENING: 1, OPEN: 2, CLOSING: 3, CLOSED: 4 },
  IOSReferenceFrame: {},
  InterfaceOrientation: {},

  Easing: {
    linear: (t: number) => t,
    ease: (t: number) => t,
    quad: (t: number) => t * t,
    cubic: (t: number) => t * t * t,
    poly: (_n: number) => (t: number) => t,
    sin: (t: number) => t,
    circle: (t: number) => t,
    exp: (t: number) => t,
    elastic: (_bounciness?: number) => (t: number) => t,
    back: (_s?: number) => (t: number) => t,
    bounce: (t: number) => t,
    // eslint-disable-next-line max-params
    bezier:
      (_x1: number, _y1: number, _x2: number, _y2: number) => (t: number) =>
        t,
    in: (easing: (t: number) => number) => easing,
    out: (easing: (t: number) => number) => easing,
    inOut: (easing: (t: number) => number) => easing,
  },

  interpolate: (
    _value: number,
    _input: Array<number>,
    _output: Array<number>,
  ) => 0,
  interpolateColor: () => 'rgba(0,0,0,0)',
  clamp: (value: number) => value,

  // Layout animations
  FadeIn: {},
  FadeOut: {},
  FadeInUp: {},
  FadeOutDown: {},
  SlideInRight: {},
  SlideOutLeft: {},
  Layout: {},
  LinearTransition: {},
  ZoomIn: {},
  ZoomOut: {},
};
