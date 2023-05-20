import { createEffect, isSignal, Signal } from './signal';
import { updateNode } from './updateNode';

export const buildNode = (vnode: JSX.VNODE) => {
  if (!vnode.children) console.log(vnode);
  const node = ['svg', 'path'].includes(vnode.tag)
    ? document.createElementNS('http://www.w3.org/2000/svg', vnode.tag)
    : document.createElement(vnode.tag);
  updateNode(node, vnode.props);

  node.append(
    ...vnode.children.flat().map((child) => {
      if (typeof child === 'object') return buildNode(child);
      if (typeof child === 'string') return document.createTextNode(child);
      const childNode = document.createTextNode('');
      if (isSignal(child))
        createEffect(
          () => (childNode.textContent = (<Signal<string>>child).value)
        );
      else if (typeof child === 'function')
        createEffect(() => (childNode.textContent = child()));
      return childNode;
    })
  );
  return node;
};

export const classNames = (...classes: (string | undefined)[]) =>
  classes.filter(Boolean).join(' ');
