import { get, getAll } from '../utils/get';
import { addToCart } from './cartDrawer';

const form = get<HTMLFormElement>('form#product');
const ATC = get<HTMLButtonElement>('form button[type=submit]');

form.addEventListener('click', () => {
  ATC.disabled = !form.checkValidity();
});
ATC.disabled = !form.checkValidity();

const mainImage = get<HTMLImageElement>('img#main-img');
getAll<HTMLInputElement>('input[type=radio][data-image]').forEach((input) =>
  input.addEventListener(
    'change',
    () =>
      (mainImage.src = (input.checked && input.dataset.image) || mainImage.src)
  )
);

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const choices = Object.fromEntries(
    [...new FormData(form).entries()].map(([k, v]) => [k, String(v)])
  );
  const data = {
    title: form.dataset.title ?? 'Item',
    price: Number(form.dataset.price),
    image: mainImage.src,
    choices,
  };
  addToCart(data);
});

export const productForm = {};
