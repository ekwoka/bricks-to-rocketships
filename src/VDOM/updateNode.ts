import { NodeMap } from './h';

export const updateNode = <T extends HTMLElement | SVGElement>(
  node: T,
  props?: JSX.VNODE['props']
): T => {
  const oldProps = NodeMap.get(node) ?? {};
  for (const [k, v] of Object.entries(props ?? {})) {
    if (oldProps[k] === v) continue;
    if (k === 'style') {
      Object.assign(node.style, v);
      continue;
    }
    if (k === 'class') {
      if (node instanceof SVGElement) node.setAttribute('class', <string>v);
      else node.className = <string>v;
      continue;
    }
    if (k.startsWith('on')) {
      const event = k.slice(2).toLowerCase();
      if (oldProps[k])
        node.removeEventListener(event, oldProps[k] as EventListener);
      node.addEventListener(event, v as EventListener);
      continue;
    }
    node.setAttribute(k, String(v));
    if (k === 'disabled') {
      node.setAttribute('aria-disabled', String(v));
      if (!v) node.removeAttribute('disabled');
      else node.setAttribute(k, k);
    }
  }
  NodeMap.set(node, props);
  return node;
};
