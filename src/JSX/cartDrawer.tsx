/* @jsx h */
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
    this.root.replaceChildren(this.render());
  }
  setState(newState: Partial<CartState> | ((old: CartState) => CartState)) {
    if (typeof newState === 'function') newState = newState(this.state);
    Object.assign(this.state, newState);
    this.root.replaceChildren(this.render());
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
    return (
      <div
        class={classNames(
          'fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity duration-500',
          this.state.open ? 'opacity-100' : 'opacity-0 pointer-events-none'
        )}
        onClick={() => this.setState({ open: false })}>
        <div
          class={classNames(
            'fixed inset-y-0 right-0 flex max-w-full pl-10 transition-transform duration-700',
            this.state.open ? 'translate-x-0' : 'translate-x-full'
          )}
          onClick={(e: MouseEvent) => e.stopPropagation()}>
          <div class="w-screen max-w-md">
            <div class="flex h-full flex-col overflow-y-scroll bg-white shadow-xl">
              <div class="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
                <div class="flex items-start justify-between">
                  <h2
                    class="text-lg font-medium text-gray-900"
                    id="slide-over-title">
                    Shopping cart
                  </h2>
                  <div class="ml-3 flex h-7 items-center">
                    <button
                      type="button"
                      data-close
                      class="-m-2 p-2 text-gray-400 hover:text-gray-500"
                      onClick={() => this.setState({ open: false })}>
                      <span class="sr-only">Close panel</span>
                      <svg
                        class="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke-width="1.5"
                        stroke="currentColor"
                        aria-hidden="true">
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>
                </div>

                <div class="mt-8">
                  <div class="flow-root">
                    <ul role="list" class="-my-6 divide-y divide-gray-200">
                      {this.state.items.map((item) =>
                        this.createCartNode(item)
                      )}
                    </ul>
                  </div>
                </div>
              </div>

              <div class="border-t border-gray-200 px-4 py-6 sm:px-6">
                <div class="flex justify-between text-base font-medium text-gray-900">
                  <p>Subtotal</p>
                  <p data-subtotal>${(this.state.total / 100).toFixed(2)}</p>
                </div>
                <p class="mt-0.5 text-sm text-gray-500">
                  Shipping and taxes calculated at checkout.
                </p>
                <div class="mt-6">
                  <a
                    href="#"
                    class="flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-indigo-700">
                    Checkout
                  </a>
                </div>
                <div class="mt-6 flex justify-center text-center text-sm text-gray-500">
                  <p>
                    or
                    <button
                      type="button"
                      class="font-medium text-indigo-600 hover:text-indigo-500">
                      Continue Shopping
                      <span aria-hidden="true"> &rarr;</span>
                    </button>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  createCartNode = (item: CartItem): HTMLElement => {
    return (
      <li class="flex py-6" id="item-${item.id}">
        <div class="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
          <img
            src={item.image}
            alt="Salmon orange fabric pouch with match zipper, gray zipper pull, and adjustable hip belt."
            class="h-full w-full object-cover object-center"
          />
        </div>

        <div class="ml-4 flex flex-1 flex-col">
          <div>
            <div class="flex justify-between text-base font-medium text-gray-900">
              <h3>
                <a href="#">{item.title}</a>
              </h3>
              <p class="ml-4" data-price={item.price}>
                ${((item.qty * item.price) / 100).toFixed(2)}
              </p>
            </div>
            {Object.entries(item.choices).map(([k, v]) => (
              <p class="mt-1 text-sm text-gray-500">
                {k}: {v}
              </p>
            ))}
          </div>
          <div class="flex flex-1 items-end justify-between text-sm">
            <div class="flex gap-2 items-center">
              <button
                type="button"
                data-subtract
                class="bg-gray-200 py-1 px-2 rounded shadow"
                onClick={() => this.updateQty(item.id, -1)}>
                -
              </button>
              <p class="text-gray-500" data-qty>
                {item.qty}
              </p>
              <button
                type="button"
                data-add
                class="bg-gray-200 py-1 px-2 rounded shadow"
                onClick={() => this.updateQty(item.id, 1)}>
                +
              </button>
            </div>
            <div class="flex">
              <button
                type="button"
                data-remove
                class="font-medium text-indigo-600 hover:text-indigo-500"
                onClick={() => this.removeItem(item.id)}>
                Remove
              </button>
            </div>
          </div>
        </div>
      </li>
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
