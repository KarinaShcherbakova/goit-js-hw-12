import { fetchImages } from './js/pixabay-api';  
import { renderGallery, clearGallery } from './js/render-functions';
import './css/styles.css';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

let currentPage = 1;
const perPage = 15;
const form = document.querySelector('#search-form');
const input = form.querySelector('input');
const loader = document.querySelector('.loader'); 
const loadMoreBtn = document.querySelector('.load-btn');
const gallery = document.querySelector('.gallery');

export let galleryLightbox = new SimpleLightbox('.gallery a', {
  captions: true,
  captionsData: 'data-caption',
  captionDelay: 250,
});

let query = '';
let isEndOfResultsNotificationShown = false; 
let isLoading = false; 

form.addEventListener('submit', onSearch);
loadMoreBtn.addEventListener('click', onLoadMore);

async function onSearch(e) {
    e.preventDefault();
    query = input.value.trim();
  
    if (!query) {
      showNotification('warning', 'Please enter a search query!');
      return;
    }
  
    currentPage = 1;
    clearGallery();
    isEndOfResultsNotificationShown = false;
  
    toggleLoader(true); 
    loadMoreBtn.style.display = 'none';
  
    await searchImages(query); 
}

async function searchImages(query) {
    if (isLoading) return;
    isLoading = true;
  
    try {
      const data = await fetchImages(query, currentPage, perPage);
      
      toggleLoader(false); 

      if (data.hits.length === 0) {
        showNotification('info', 'Sorry, no images were found for your search query.');
        return;
      }
  
      renderGallery(data.hits);
      galleryLightbox.refresh();
  
      if (data.totalHits > currentPage * perPage) {
        loadMoreBtn.style.display = 'block';
        isEndOfResultsNotificationShown = false;
      } else {
        loadMoreBtn.style.display = 'none';
        if (!isEndOfResultsNotificationShown) {
          showNotification('info', "We're sorry, but you've reached the end of search results.");
          isEndOfResultsNotificationShown = true;
        }
      }
  
      smoothScroll(); 
      input.value = '';
    } catch (error) {
      toggleLoader(false); 
      showNotification('error', 'Something went wrong. Please try again later.');
      console.error(error);
    } finally {
      isLoading = false; 
    }
}

function onLoadMore() {
  if (isLoading) return; 
  currentPage += 1; 
  searchImages(query);
}

function toggleLoader(isLoadingFlag) {
    if (loader) { 
        loader.style.display = isLoadingFlag ? 'flex' : 'none';
    } else {
        console.error('Loader element not found in the DOM.');
    }
}

function showNotification(type, message) {
  iziToast[type]( {
    title: type.charAt(0).toUpperCase() + type.slice(1),
    message,
  });
}

function smoothScroll() {
  const firstCard = document.querySelector('.gallery').firstElementChild;
  if (!firstCard) return;  
  
  const { height: cardHeight } = firstCard.getBoundingClientRect();
  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}