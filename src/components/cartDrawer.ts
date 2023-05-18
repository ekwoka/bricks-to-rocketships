import { classNames, h } from './h';

export const cartDrawer = {};

interface Component<T extends Record<string, unknown>> {
  root: HTMLElement;
  state: T;
  setState: (newState: Partial<T> | ((old: T) => T)) => void;
  render: () => void;
}
type CartState = {
  open: boolean;
  items: CartItem[];
  total: number;
};

export class CartDrawer implements Component<CartState> {
  root: HTMLElement;
  state: CartState;
  nextid = 1;
  constructor(root: HTMLElement) {
    this.root = root;
    this.state = {
      open: false,
      items: [],
      get total() {
        return this.items.reduce((acc, item) => acc + item.price * item.qty, 0);
      },
      set total(_: number) {
        _;
      },
    };
    this.render();
  }
  setState(newState: Partial<CartState> | ((old: CartState) => CartState)) {
    if (typeof newState === 'function') newState = newState(this.state);
    Object.assign(this.state, newState);
    this.render();
  }
  addToCart(item: Omit<CartItem, 'id'>) {
    this.setState((old) => {
      old.items.push({ ...item, id: this.nextid++ });
      old.open = true;
      return old;
    });
  }
  removeItem(id: number) {
    const idx = this.state.items.findIndex((item) => item.id === Number(id));
    if (!idx) return;
    this.setState((old) => {
      old.items.splice(Number(idx), 1);
      return old;
    });
  }
  updateQty = (id: number, count: number) => {
    this.setState((old) => {
      const itemState = old.items.find((item) => item.id === Number(id));
      if (itemState) itemState.qty += count;
      return old;
    });
  };

  render() {
    this.root.replaceChildren(
      h(
        'div',
        {
          class: classNames(
            'fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity duration-500',
            this.state.open ? 'opacity-100' : 'opacity-0 pointer-events-none'
          ),
          onClick: () => this.setState({ open: false }),
        },
        h(
          'div',
          {
            class: classNames(
              'fixed inset-y-0 right-0 flex max-w-full pl-10 transition-transform duration-700 pointer-events-auto',
              this.state.open ? 'translate-x-0' : 'translate-x-full'
            ),
            onClick: (e: MouseEvent) => e.stopPropagation(),
          },
          h(
            'div',
            { class: 'w-screen max-w-md' },
            h(
              'div',
              {
                class:
                  'flex h-full flex-col overflow-y-scroll bg-white shadow-xl',
              },
              h(
                'div',
                {
                  class: 'flex-1 overflow-y-auto px-4 py-6 sm:px-6',
                },
                h(
                  'div',
                  {
                    class: 'flex items-start justify-between',
                  },
                  h(
                    'h2',
                    { class: 'text-lg font-medium text-gray-900' },
                    'Shopping cart'
                  ),
                  h(
                    'div',
                    {
                      class: 'ml-3 flex h-7 items-center',
                    },
                    h(
                      'button',
                      {
                        type: 'button',
                        class: '-m-2 p-2 text-gray-400 hover:text-gray-500',
                        onClick: () => this.setState({ open: false }),
                      },
                      h(
                        'span',
                        {
                          class: 'sr-only',
                        },
                        'Close panel'
                      ),
                      h(
                        'svg',
                        {
                          class: 'h-6 w-6',
                          fill: 'none',
                          viewBox: '0 0 24 24',
                          'stroke-width': '1.5',
                          stroke: 'currentColor',
                          'aria-hidden': 'true',
                        },
                        h('path', {
                          'stroke-linecap': 'round',
                          'stroke-linejoin': 'round',
                          d: 'M6 18L18 6M6 6l12 12',
                        })
                      )
                    )
                  )
                ),
                h(
                  'div',
                  { class: 'mt-8' },
                  h(
                    'div',
                    { class: 'flow-root' },
                    h(
                      'ul',
                      { role: 'list', class: '-my-6 divide-y divide-gray-200' },
                      ...this.state.items.map((item) =>
                        this.createCartNode(item)
                      )
                    )
                  )
                )
              ),
              h(
                'div',
                {
                  class: 'border-t border-gray-200 py-6 px-4 sm:px-6',
                },
                h(
                  'div',
                  {
                    class:
                      'flex justify-between text-base font-medium text-gray-900',
                  },
                  h('p', null, 'Subtotal'),
                  h('p', null, `$${(this.state.total / 100).toFixed(2)}`)
                ),
                h(
                  'p',
                  { class: 'mt-0.5 text-sm text-gray-500' },
                  'Shipping and taxes calculated at checkout.'
                ),
                h(
                  'div',
                  { class: 'mt-6' },
                  h(
                    'a',
                    {
                      href: '#',
                      class:
                        'flex justify-center items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700',
                    },
                    'Checkout'
                  )
                ),
                h(
                  'div',
                  {
                    class:
                      'mt-6 flex justify-center text-sm text-center text-gray-500',
                  },
                  h(
                    'p',
                    null,
                    'or ',
                    h(
                      'button',
                      {
                        type: 'button',
                        class:
                          'text-indigo-600 font-medium hover:text-indigo-500',
                        onClick: () => this.setState({ open: false }),
                      },
                      'Continue Shopping',
                      h('span', { 'aria-hidden': 'true' }, '&rarr;')
                    )
                  )
                )
              )
            )
          )
        )
      )
    );
  }
  createCartNode = (item: CartItem) => {
    return h(
      'li',
      {
        class: 'flex py-6',
        id: `item-${item.id}`,
      },
      h(
        'div',
        {
          class:
            'h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200',
        },
        h('img', {
          src: item.image,
          alt: 'Salmon orange fabric pouch with match zipper, gray zipper pull, and adjustable hip belt.',
          class: 'h-full w-full object-cover object-center',
        })
      ),
      h(
        'div',
        {
          class: 'ml-4 flex flex-1 flex-col',
        },
        h(
          'div',
          null,
          h(
            'div',
            {
              class: 'flex justify-between text-base font-medium text-gray-900',
            },
            h('h3', null, h('a', { href: '#' }, item.title)),
            h(
              'p',
              { class: 'ml-4', 'data-price': item.price },
              `$${((item.qty * item.price) / 100).toFixed(2)}`
            )
          ),
          ...Object.entries(item.choices).map((choice) =>
            h(
              'p',
              { class: 'mt-1 text-sm text-gray-500' },
              `${choice[0]}: ${choice[1]}`
            )
          )
        ),

        h(
          'div',
          {
            class: 'ml-4 flex flex-1 flex-col',
          },
          h(
            'div',
            {
              class: 'flex flex-1 items-end justify-between text-sm',
            },
            h(
              'div',
              {
                class: 'flex gap-2 items-center',
              },
              h(
                'button',
                {
                  type: 'button',
                  'data-subtract': '',
                  class: 'bg-gray-200 py-1 px-2 rounded shadow',
                  onClick: () => this.updateQty(item.id, -1),
                },
                '-'
              ),
              h(
                'p',
                {
                  class: 'text-gray-500',
                  'data-qty': '',
                },
                `Qty ${item.qty}`
              ),
              h(
                'button',
                {
                  type: 'button',
                  'data-add': '',
                  class: 'bg-gray-200 py-1 px-2 rounded shadow',
                  onClick: () => this.updateQty(item.id, 1),
                },
                '+'
              )
            ),
            h(
              'div',
              {
                class: 'flex',
              },
              h(
                'button',
                {
                  type: 'button',
                  'data-remove': '',
                  class: 'font-medium text-indigo-600 hover:text-indigo-500',
                  onClick: () => this.removeItem(item.id),
                },
                'Remove'
              )
            )
          )
        )
      )
    );
  };
}

export type CartItem = {
  id: number;
  title: string;
  price: number;
  qty: number;
  image: string;
  choices: Record<string, string>;
};
