import { h } from '../../h';
import { Signal } from '../../signal';
export const QtyController = ({
  update,
  qty,
}: {
  update: (v: number) => void;
  qty: Signal<number>;
}) => (
  <div class="flex gap-2 items-center">
    <button
      type="button"
      data-subtract
      class="bg-gray-200 py-1 px-2 rounded shadow"
      onClick={() => update(-1)}>
      -
    </button>
    <p class="text-gray-500" data-qty>
      {qty}
    </p>
    <button
      type="button"
      data-add
      class="bg-gray-200 py-1 px-2 rounded shadow"
      onClick={() => update(1)}>
      +
    </button>
  </div>
);
