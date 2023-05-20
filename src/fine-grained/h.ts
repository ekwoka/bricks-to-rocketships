export const h = (
  tag: string | ((props: Record<string, unknown>) => JSX.VNODE),
  props?: Record<string, unknown>,
  ...children: (JSX.VNODE | string | JSX.VNODE[])[]
) => {
  if (typeof tag === 'function')
    return tag(Object.assign(props ?? {}, { children }));
  return {
    tag,
    props,
    children,
  };
};

export const classNames = (...classes: (string | undefined)[]) =>
  classes.filter(Boolean).join(' ');

export const NodeMap = new WeakMap<Node, JSX.VNODE['props']>();
