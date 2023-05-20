import { h } from '../../h';

export const CloseButton = ({ onClick }: { onClick: () => void }) => (
  <button
    type="button"
    data-close
    class="-m-2 p-2 text-gray-400 hover:text-gray-500"
    onClick={onClick}>
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
);
