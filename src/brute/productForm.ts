import { get, getAll } from '../utils/get';
import { addToCart } from './cartDrawer';

const form = get<HTMLFormElement>('form#product');
const ATC = get<HTMLButtonElement>('form button[type=submit]');
const mainImage = get<HTMLImageElement>('img#main-img');

const productState = {
  formValid: form.checkValidity(),
  imageToShow: mainImage.src,
};

form.addEventListener('click', () => {
  productState.formValid = form.checkValidity();
  updateUI();
});

const updateUI = () => {
  ATC.disabled = !productState.formValid;
  mainImage.src = productState.imageToShow;
};
updateUI();

getAll<HTMLInputElement>('input[type=radio][data-image]').forEach((input) =>
  input.addEventListener('change', () => {
    if (input.checked && input.dataset.image)
      productState.imageToShow = input.dataset.image;
    updateUI();
  })
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
    qty: 1,
    choices,
  };
  addToCart(data);
});

export const productForm = {};
