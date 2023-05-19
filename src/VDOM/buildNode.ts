import { updateNode } from './updateNode';

export const buildNode = ({ tag, props, children }: JSX.VNODE) => {
  const node = ['svg', 'path'].includes(tag)
    ? document.createElementNS('http://www.w3.org/2000/svg', tag)
    : document.createElement(tag);
  updateNode(node, props);
  node.append(
    ...children
      .flat()
      .map((child) =>
        typeof child !== 'object'
          ? document.createTextNode(child)
          : buildNode(child)
      )
  );
  return node;
};

export const classNames = (...classes: (string | undefined)[]) =>
  classes.filter(Boolean).join(' ');
