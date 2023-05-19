import { buildNode } from './buildNode';
import { NodeMap } from './h';
import { updateNode } from './updateNode';

export const render = (root: HTMLElement, node: JSX.VNODE) => {
  const target = <HTMLElement | SVGElement>root.firstElementChild;
  if (!target) return root.append(buildNode(node));
  recursiveRender(target, node);
};

const recursiveRender = (
  target: HTMLElement | SVGElement,
  node: JSX.VNODE
): HTMLElement | SVGElement => {
  const oldProps = NodeMap.get(target);
  if (!haveSameProps(oldProps, node.props)) {
    const nextNode = buildNode(node);
    target.replaceWith(nextNode);
    return nextNode;
  }
  updateNode(target, node.props);
  const children = (node.children ?? []).flat().map((child, i) => {
    const oldChild = <HTMLElement | SVGElement>target.childNodes[i];
    if (typeof child !== 'object') return document.createTextNode(child);
    if (!oldChild) return buildNode(child);
    return recursiveRender(oldChild, child);
  });
  target.replaceChildren?.(...children);
  return target;
};

const haveSameProps = (a: JSX.VNODE['props'], b: JSX.VNODE['props']) => {
  if (a === b) return true;
  if (!a || !b) return false;
  const aKeys = Object.keys(a);
  const bKeys = Object.keys(b);
  if (aKeys.length !== bKeys.length) return false;
  if (new Set([...aKeys, ...bKeys]).size !== aKeys.length) return false;
  return true;
};
