// Mock para framer-motion
export const motion = {
  div: 'div',
  h1: 'h1',
  h2: 'h2',
  h3: 'h3',
  h4: 'h4',
  h5: 'h5',
  h6: 'h6',
  p: 'p',
  span: 'span',
  section: 'section',
  article: 'article',
  header: 'header',
  footer: 'footer',
  nav: 'nav',
  main: 'main',
  aside: 'aside',
  button: 'button',
  a: 'a',
  img: 'img',
  input: 'input',
  textarea: 'textarea',
  select: 'select',
  form: 'form',
  label: 'label',
  ul: 'ul',
  ol: 'ol',
  li: 'li',
  table: 'table',
  tr: 'tr',
  td: 'td',
  th: 'th',
  thead: 'thead',
  tbody: 'tbody',
  tfoot: 'tfoot',
};

export const AnimatePresence = ({ children }: { children: React.ReactNode }) => children;

export const useAnimation = () => ({
  start: jest.fn(),
  stop: jest.fn(),
  pause: jest.fn(),
  resume: jest.fn(),
  set: jest.fn(),
});

export const useMotionValue = (initial: any) => ({
  get: jest.fn(() => initial),
  set: jest.fn(),
  onChange: jest.fn(),
});

export const useTransform = jest.fn((value, inputRange, outputRange) => ({
  get: jest.fn(() => outputRange[0]),
  set: jest.fn(),
}));

export const useSpring = jest.fn((value) => ({
  get: jest.fn(() => value),
  set: jest.fn(),
}));

export const useViewportScroll = () => ({
  scrollX: { get: jest.fn(() => 0) },
  scrollY: { get: jest.fn(() => 0) },
});

export const useElementScroll = () => ({
  scrollX: { get: jest.fn(() => 0) },
  scrollY: { get: jest.fn(() => 0) },
});

export const useDragControls = () => ({
  start: jest.fn(),
  stop: jest.fn(),
});

export const useReducedMotion = () => false;

export const usePresence = () => [true, jest.fn()];

export const motionValue = jest.fn((initial) => ({
  get: jest.fn(() => initial),
  set: jest.fn(),
  onChange: jest.fn(),
}));

export const animate = jest.fn();
export const stagger = jest.fn();
export const spring = jest.fn();
export const tween = jest.fn();
export const keyframes = jest.fn();

export const variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

export const transition = {
  duration: 0.3,
  ease: 'easeInOut',
};

export default {
  motion,
  AnimatePresence,
  useAnimation,
  useMotionValue,
  useTransform,
  useSpring,
  useViewportScroll,
  useElementScroll,
  useDragControls,
  useReducedMotion,
  usePresence,
  motionValue,
  animate,
  stagger,
  spring,
  tween,
  keyframes,
  variants,
  transition,
};
