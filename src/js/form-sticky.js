const form = document.querySelector('.search-form');
const gallery = document.querySelector('.gallery');
const sticky = form.offsetTop;

export default function formSticky() {
  if (window.scrollY > sticky) {
    form.classList.add('on-scroll');
    gallery.style.paddingTop = `72px`;
  } else {
    form.classList.remove('on-scroll');
    gallery.style.paddingTop = `24px`;
  }
}
