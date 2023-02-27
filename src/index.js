import { Notify } from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

import PostApiService from './js/posts-servise';
import LoadMoreBtn from './js/load-more-btn';
import formSticky from './js/form-sticky';

// get elements
const refs = {
  formSearch: document.querySelector('.search-form'),
  gallery: document.querySelector('.gallery'),
};

// Create exemples classes
const loadMoreBtn = new LoadMoreBtn({
  selector: '.load-more',
  hidden: true,
});

const postApiService = new PostApiService();

const lightbox = new SimpleLightbox('.gallery__item', {
  captionDelay: 250,
  captionsData: 'alt',
  enableKeyboard: true,
});

// Make add event listener
refs.formSearch.addEventListener('submit', onSearch);
loadMoreBtn.refs.button.addEventListener('click', onLoadMore);
window.addEventListener('scroll', formSticky);

// __________________________________________________________________
// Event search btn
function onSearch(e) {
  e.preventDefault();
  const form = e.currentTarget;

  postApiService.query = form.elements.searchQuery.value.trim(); //+

  if (postApiService.query === '') {
    return  alertNoEmptySearch();
  }

  postApiService.resetPage();
  clearGallery();

  //  тут зробити перевірку - порівняти номер поточної сторінки з максимально можливою кількістю ( totalHit/40 -page??)
  // якщо це максимум -то більше не робити запит(return) та скрити кнопку Load more

  fetchPosts();
}

function onLoadMore() {
  loadMoreBtn.hide();
  fetchPosts();
  // чи ось тут перевырку
  loadMoreBtn.show();
}

// Get posts
function fetchPosts() {
  loadMoreBtn.hide();

  postApiService.fetchPost().then(data => {
    const currentPage = postApiService.page - 1;

    if (!data.totalHits) {
      console.log('!data.totalHits', !data.totalHits);
      // images not found
      return alertNoImagesFound();
    }

    if (!data.hits.length) {
      // end of searchQuery
      loadMoreBtn.hide();
      return alertEndOfSearch();
    }

    renderPost(data.hits);

    if (currentPage === 1) {
      // images found
      alertImagesFound(data);
    //  если нашлось 40 и меньше то не показывать кнопку 
      if (data.totalHits<= 40){
        // console.log("нашлось меньше 40 картинок!", data.totalHits)
         loadMoreBtn.hide();  
         return;
      }
      loadMoreBtn.show();
    }
  });
}

// Create markup posts
function renderPost(data) {
  let markupPost = data
    .map(
      ({
        largeImageURL,
        webformatURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => {
        return `<a class="gallery__item" href="${largeImageURL}">
                  <div class="photo-card">
                      <img src="${webformatURL}" alt="${tags}" loading="lazy" />
                      <div class="info">
                        <p class="info-item"><b>Likes</b> ${likes}</p>
                        <p class="info-item"><b>Views</b> ${views}</p>
                        <p class="info-item"><b>Comments</b> ${comments}</p>
                        <p class="info-item"><b>Downloads</b> ${downloads}</p>
                      </div>
                    </div>
                 </a>`;
      }
    )
    .join('');

  refs.gallery.insertAdjacentHTML('beforeend', markupPost);
  lightbox.refresh();
}

function clearGallery() {
  refs.gallery.innerHTML = '';
}

// ---------------------------------------------alert-----------------
function alertImagesFound(data) {
  Notify.success(`Hooray! We found ${data.totalHits} images.`);
}

function alertNoEmptySearch() {
  Notify.failure(
    'The search string cannot be empty. Please specify your search query.'
  );
}

function alertNoImagesFound() {
  Notify.failure(
    'Sorry, there are no images matching your search query. Please try again.'
  );
}

function alertEndOfSearch() {
  Notify.info("We're sorry, but you've reached the end of search results.");
}
