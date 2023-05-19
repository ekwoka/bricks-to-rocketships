export const h = (
  tag: string | ((props: Record<string, unknown>) => Element),
  props?: Record<string, unknown>,
  ...children: (Element | string | Element[])[]
) => {
  if (typeof tag === 'function')
    return tag(Object.assign(props ?? {}, { children }));

  const node = ['svg', 'path'].includes(tag)
    ? document.createElementNS('http://www.w3.org/2000/svg', tag)
    : document.createElement(tag);
  for (const [k, v] of Object.entries(props ?? {})) {
    if (k === 'style') {
      Object.assign(node.style, v);
      continue;
    }
    if (k === 'class') {
      (<string>v).split(' ').forEach((c) => node.classList.add(c));
      continue;
    }
    if (k.startsWith('on')) {
      node.addEventListener(k.slice(2).toLowerCase(), v as EventListener);
      continue;
    }
    node.setAttribute(k, String(v));
    if (k === 'disabled') {
      node.setAttribute('aria-disabled', String(v));
      if (!v) node.removeAttribute('disabled');
      else node.setAttribute(k, k);
    }
  }
  node.append(
    ...children
      .flat()
      .map((child) =>
        typeof child === 'string' ? document.createTextNode(child) : child
      )
  );
  return node;
};

export const classNames = (...classes: (string | undefined)[]) =>
  classes.filter(Boolean).join(' ');
