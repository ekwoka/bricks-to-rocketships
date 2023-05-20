/* @jsx h */
import { CartFooter, CloseButton, QtyController } from './components';
import { classNames, h } from './h';
import { render } from './render';
import { createSignal, Signal } from './signal';

export const cartDrawer = {};

interface Component<T extends Record<string, unknown>> {
  root: HTMLElement;
  state: T;
  setState: (newState: Partial<T> | ((old: T) => T)) => void;
  render: () => JSX.VNODE;
}
type CartState = {
  open: Signal<boolean>;
  items: CartItemSignal[];
  total: number;
};

export class CartDrawer implements Component<CartState> {
  root: HTMLElement;
  state: CartState;
  nextid = 1;
  constructor(root: HTMLElement) {
    this.root = root;
    this.state = {
      open: createSignal(false),
      items: [],
      get total() {
        return this.items.reduce(
          (acc, item) => acc + item.price.value * item.qty.value,
          0
        );
      },
      set total(_: number) {
        _;
      },
    };
    render(this.root, this.render());
  }
  setState(newState: Partial<CartState> | ((old: CartState) => CartState)) {
    if (typeof newState === 'function') newState = newState(this.state);
    Object.assign(this.state, newState);
    render(this.root, this.render());
  }
  addToCart(item: Omit<CartItem, 'id'>) {
    this.setState((old) => {
      old.items.push({
        ...(Object.fromEntries(
          Object.entries(item).map(([k, v]) => [k, createSignal(v)])
        ) as unknown as CartItemSignal),
        id: this.nextid++,
      });
      old.open(true);
      return old;
    });
  }
  removeItem(id: number) {
    const idx = this.state.items.findIndex((item) => item.id === Number(id));
    if (idx < 0) return;
    this.setState((old) => {
      old.items.splice(Number(idx), 1);
      return old;
    });
  }
  updateQty = (id: number, count: number) => {
    this.setState((old) => {
      const itemState = old.items.find((item) => item.id === Number(id));
      if (!itemState) return old;
      itemState.qty(itemState.qty.value + count);
      if (itemState.qty.value <= 0)
        old.items = old.items.filter((i) => i !== itemState);
      return old;
    });
  };

  render() {
    return (
      <div
        class={() =>
          classNames(
            'fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity duration-500',
            this.state.open.value
              ? 'opacity-100'
              : 'opacity-0 pointer-events-none'
          )
        }
        onClick={() => this.state.open(false)}>
        <div
          id="cart-drawer"
          class={() =>
            classNames(
              'fixed inset-y-0 right-0 flex max-w-full pl-10 transition-transform duration-700',
              this.state.open.value ? 'translate-x-0' : 'translate-x-full'
            )
          }
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
                    <CloseButton onClick={() => this.state.open(false)} />
                  </div>
                </div>

                <div class="mt-8">
                  <div class="flow-root">
                    <ul role="list" class="-my-6 divide-y divide-gray-200">
                      {this.state.items.map((item) => (
                        <this.CreateCartNode {...item} />
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              <CartFooter subtotal={() => this.state.total} />
            </div>
          </div>
        </div>
      </div>
    );
  }
  CreateCartNode = (item: CartItemSignal) => {
    console.log('rendering cart node');
    return (
      <li class="flex py-6" id={`item-${item.id}`}>
        <div class="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
          <img
            src={() => item.image.value}
            alt="Salmon orange fabric pouch with match zipper, gray zipper pull, and adjustable hip belt."
            class="h-full w-full object-cover object-center"
          />
        </div>

        <div class="ml-4 flex flex-1 flex-col">
          <div>
            <div class="flex justify-between text-base font-medium text-gray-900">
              <h3>
                <a href="#">{item.title.value}</a>
              </h3>
              <p class="ml-4" data-price={item.price.value}>
                ${() => ((item.qty.value * item.price.value) / 100).toFixed(2)}
              </p>
            </div>
            {Object.entries(item.choices.value).map(([k, v]) => (
              <p class="mt-1 text-sm text-gray-500">
                {k}: {v}
              </p>
            ))}
          </div>
          <div class="flex flex-1 items-end justify-between text-sm">
            <QtyController
              qty={item.qty}
              update={(v) => item.qty(item.qty.value + v)}
            />
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
export type CartItemSignal = {
  id: number;
  title: Signal<string>;
  price: Signal<number>;
  qty: Signal<number>;
  image: Signal<string>;
  choices: Signal<Record<string, string>>;
};
