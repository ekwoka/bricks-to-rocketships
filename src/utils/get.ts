export const get = <T extends Element = HTMLElement>(selector: string): T => {
  const element = document.querySelector<T>(selector);
  if (!element) throw new Error(`${selector} not found`);
  return element;
};

export const getAll = <T extends Element = HTMLElement>(
  selector: string
): NodeListOf<T> => {
  const elements = document.querySelectorAll<T>(selector);
  if (!elements.length) throw new Error(`${selector} not found`);
  return elements;
};
