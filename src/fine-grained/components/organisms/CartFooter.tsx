import { h } from '../../h';
export const CartFooter = ({ subtotal }: { subtotal: () => number }) => {
  return (
    <div class="border-t border-gray-200 px-4 py-6 sm:px-6">
      <div class="flex justify-between text-base font-medium text-gray-900">
        <p>Subtotal</p>
        <p data-subtotal>${() => (subtotal() / 100).toFixed(2)}</p>
      </div>
      <p class="mt-0.5 text-sm text-gray-500">
        Shipping and taxes calculated at checkout.
      </p>
      <div class="mt-6">
        <button
          onClick={() => alert('Checkout')}
          class="flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-indigo-700 disabled:pointer-events-none disabled:opacity-60 w-full"
          disabled={!subtotal}>
          Checkout
        </button>
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
  );
};
