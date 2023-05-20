import { NodeMap } from './h';
import { createEffect } from './signal';

export const updateNode = <T extends HTMLElement | SVGElement>(
  node: T,
  props?: JSX.VNODE['props']
): T => {
  for (const [k, v] of Object.entries(props ?? {})) {
    const updater = () => {
      const oldProps = NodeMap.get(node) ?? {};
      const realValue =
        !k.startsWith('on') && typeof v === 'function' ? v() : v;
      if (oldProps[k] === realValue) return;
      if (k === 'style') {
        Object.assign(node.style, realValue);
        return;
      }
      if (k === 'class') {
        if (node instanceof SVGElement)
          node.setAttribute('class', <string>realValue);
        else node.className = <string>realValue;
        return;
      }
      if (k.startsWith('on')) {
        const event = k.slice(2).toLowerCase();
        if (oldProps[k])
          node.removeEventListener(event, oldProps[k] as EventListener);
        node.addEventListener(event, realValue as EventListener);
        return;
      }
      node.setAttribute(k, String(realValue));
      if (k === 'disabled') {
        node.setAttribute('aria-disabled', String(realValue));
        if (!realValue) node.removeAttribute('disabled');
        else node.setAttribute(k, k);
      }
    };
    createEffect(updater);
  }
  NodeMap.set(node, props);
  return node;
};
