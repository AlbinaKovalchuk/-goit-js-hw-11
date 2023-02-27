export default class LoadMoreBtn {
  constructor({ selector, hidden = false }) {
    this.refs = this.getRefs(selector);
    hidden && this.hide();
  }

  getRefs(selector) {
    const refs = {};
    refs.button = document.querySelector(selector);
    refs.label = refs.button.querySelector('.label');
    return refs;
  }

  disable() {
    this.refs.button.disable = true;
    this.refs.button.classList.add('btn-loading'); 
    this.refs.label.textContent = 'Loading...';
  }

  enable() {
    this.refs.button.disable = false;
    this.refs.button.classList.remove('btn-loading');
    this.refs.label.textContent = 'Load more';
  }
  hide() {
    this.refs.button.classList.add('is-hidden');
  }
  show() {
    this.refs.button.classList.remove('is-hidden');
  }
 
  

}
