/// <reference lib="DOM" />
declare namespace JSX {
  // The return type of our JSX Factory: this could be anything
  type Element = VNODE;

  type VNODE = {
    tag: string;
    props?: Record<string, unknown>;
    children: (VNODE | string | (() => string) | Signal<string> | VNODE[])[];
  };
  // IntrinsicElementMap grabs all the standard HTML tags in the TS DOM lib.
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface IntrinsicElements extends IntrinsicElementMap {}

  // The following are custom types, not part of TS's known JSX namespace:
  type IntrinsicElementMap = {
    [K in keyof (HTMLElementTagNameMap & SVGElementTagNameMap)]: {
      [k: string]: any;
    };
  };

  interface Component {
    (properties?: { [key: string]: any }, children?: Node[]): Node;
  }
}
