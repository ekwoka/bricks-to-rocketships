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
  if (
    target.tagName.toLowerCase() !== node.tag ||
    !haveSameProps(oldProps, node.props)
  ) {
    const nextNode = buildNode(node);
    target.replaceWith(nextNode);
    return nextNode;
  }
  updateNode(target, node.props);
  const oldChildren = [...target.childNodes];
  const children = node.children.flat();
  let oldMarker = 0;
  let newMarker = 0;
  while (oldMarker < target.childNodes.length && newMarker < children.length) {
    const oldChild = <HTMLElement | SVGElement>oldChildren[oldMarker];
    const newChild = children[newMarker];
    if (typeof newChild !== 'object') {
      if (!(oldChild instanceof Text))
        oldChild.replaceWith(document.createTextNode(newChild));
      else if (oldChild.textContent !== newChild)
        oldChild.textContent = newChild;
    } else recursiveRender(oldChild, newChild);
    oldMarker++;
    newMarker++;
  }
  while (newMarker < children.length) {
    const newChild = children[newMarker++];
    if (typeof newChild !== 'object') document.createTextNode(newChild);
    else target.append(buildNode(newChild));
  }
  while (oldMarker < oldChildren.length) oldChildren[oldMarker++]?.remove();
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

const _getSize = (thing: unknown) => {
  return new TextEncoder().encode(JSON.stringify(thing)).byteLength;
};
