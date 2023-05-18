export const h = (
  tag: string,
  props?: Record<string, unknown> | null,
  ...children: (HTMLElement | string)[]
) => {
  const node = document.createElement(tag);
  for (const [k, v] of Object.entries(props ?? {})) {
    if (k === 'style') {
      Object.assign(node.style, v);
      continue;
    }
    if (k === 'class') {
      node.className = String(v);
      continue;
    }
    if (k.startsWith('on')) {
      node.addEventListener(k.slice(2).toLowerCase(), v as EventListener);
      continue;
    }
    node.setAttribute(k, String(v));
  }
  node.append(
    ...children.map((child) =>
      typeof child === 'string' ? document.createTextNode(child) : child
    )
  );
  return node;
};

export const classNames = (...classes: (string | undefined)[]) =>
  classes.filter(Boolean).join(' ');
