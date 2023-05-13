import { get } from '../utils/get';

export const cartDrawer = {};

const backdrop = get('[data-backdrop]');
const drawer = get('[data-drawer]');
const cartList = get<HTMLUListElement>('[data-drawer] ul');
const subtotal = get<HTMLParagraphElement>('[data-subtotal]');

const cartState = {
  open: false,
  items: [] as CartItem[],
  get total() {
    return this.items.reduce((acc, item) => acc + item.price * item.qty, 0);
  },
};

const updateUI = () => {
  if (cartState.open) openCart();
  else closeCart();
  cartState.items = cartState.items.filter((item) => item.qty > 0);
  const cartItems = cartState.items.map(createCartNode);
  cartList.replaceChildren(...cartItems);
  subtotal.textContent = `$${(cartState.total / 100).toFixed(2)}`;
};

export const addToCart = (item: CartItem) => {
  cartState.items.push(item);
  cartState.open = true;
  updateUI();
};

const closeCart = () => {
  backdrop.classList.add('opacity-0', 'pointer-events-none');
  backdrop.classList.remove('opacity-100');
  drawer.classList.add('translate-x-full');
  drawer.classList.remove('translate-x-0');
};

const openCart = () => {
  backdrop.classList.add('opacity-100');
  backdrop.classList.remove('opacity-0', 'pointer-events-none');
  drawer.classList.add('translate-x-0');
  drawer.classList.remove('translate-x-full');
};

const removeItem = (e: MouseEvent) => {
  const button = <HTMLButtonElement>e.currentTarget;
  const item = <HTMLLIElement>button.closest<HTMLLIElement>('li');
  const price = <HTMLParagraphElement>(
    item.querySelector<HTMLParagraphElement>('[data-price]')
  );
  updateCartTotal((-1 * Number(price.textContent?.replace('$', '')) * 100) | 0);

  item?.remove();
};

const updateQty = (e: MouseEvent) => {
  const button = <HTMLButtonElement>e.currentTarget;
  const mod = button.matches('[data-add]') ? 1 : -1;
  const item = <HTMLLIElement>button.closest<HTMLLIElement>('li');
  const qty = <HTMLParagraphElement>(
    item.querySelector<HTMLParagraphElement>('[data-qty]')
  );
  const price = <HTMLParagraphElement>(
    item.querySelector<HTMLParagraphElement>('[data-price]')
  );
  const newQty = Number(qty.textContent?.split(' ')[1]) + mod;
  if (newQty < 1) return removeItem(e);
  qty.textContent = `Qty ${newQty}`;
  price.textContent = `$${(
    (newQty * Number(price.dataset.price)) /
    100
  ).toFixed(2)}`;
  updateCartTotal(mod * Number(price.dataset.price));
};

const updateCartTotal = (amount: number) => {
  const current = (Number(subtotal.textContent?.replace('$', '')) * 100) | 0;
  subtotal.textContent = `$${((current + amount) / 100).toFixed(2)}`;
};

const createCartNode = (item: CartItem): HTMLLIElement => {
  const html = `<li class="flex py-6">
                      <div
                        class="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                        <img
                          src="${item.image}"
                          alt="Salmon orange fabric pouch with match zipper, gray zipper pull, and adjustable hip belt."
                          class="h-full w-full object-cover object-center" />
                      </div>

                      <div class="ml-4 flex flex-1 flex-col">
                        <div>
                          <div
                            class="flex justify-between text-base font-medium text-gray-900">
                            <h3>
                              <a href="#">${item.title}</a>
                            </h3>
                            <p class="ml-4" data-price="${item.price}">$${(
    item.price / 100
  ).toFixed(2)}</p>
                          </div>
                          ${Object.entries(item.choices)
                            .map(
                              ([k, v]) =>
                                `<p class="mt-1 text-sm text-gray-500">${k}: ${v}</p>`
                            )
                            .join('')}
                        </div>
                        <div
                          class="flex flex-1 items-end justify-between text-sm">
                          <div class="flex gap-2 items-center">
                            <button type="button" data-subtract class="bg-gray-200 py-1 px-2 rounded shadow">-</button>
                            <p class="text-gray-500" data-qty>Qty 1</p>
                            <button type="button" data-add class="bg-gray-200 py-1 px-2 rounded shadow">+</button>
                          </div>
                          <div class="flex">
                            <button
                              type="button"
                              data-remove
                              class="font-medium text-indigo-600 hover:text-indigo-500">
                              Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    </li>`;
  const node = <HTMLLIElement>(
    new Range().createContextualFragment(html).firstElementChild
  );
  if (!node) throw new Error('Could not create cart node');
  node
    .querySelector<HTMLButtonElement>('button[data-remove]')
    ?.addEventListener('click', removeItem);
  node
    .querySelectorAll<HTMLButtonElement>(
      'button[data-add], button[data-subtract]'
    )
    .forEach((button) => button.addEventListener('click', updateQty));
  return node;
};

backdrop.addEventListener('click', closeCart);
get<HTMLButtonElement>('[data-close]').addEventListener('click', closeCart);
drawer.addEventListener('click', (e) => e.stopPropagation());

export type CartItem = {
  title: string;
  price: number;
  qty: number;
  image: string;
  choices: Record<string, string>;
};
