import './sass/main.scss';
import ImageSearch from './js/pic-fetch';
import Notiflix from "notiflix";
import Axios from "axios";
import SimpleLightbox from 'simplelightbox';
import debounce from 'lodash.debounce';
import 'simplelightbox/dist/simple-lightbox.css';
import imageCardTpl from './templates/image-card.hbs';
import imageModalTpl from './templates/image-modal.hbs';
import './js/lightbox';


const DEBOUNCE_DELAY = 1000;

const imageSearch = new ImageSearch();

const refs = {
    searchForm: document.getElementById('search-form'),
    searchInput: document.getElementById('search-input'),
    gallery: document.querySelector('.gallery'),
};

let lightbox = new SimpleLightbox('.gallery a');
refs.searchForm.addEventListener('submit', onFormSubmit);
window.addEventListener('scroll', debounce(onLoadMore, DEBOUNCE_DELAY));

async function onFormSubmit (el) {
    el.preventDefault();
    imageSearch.searchQuery = el.currentTarget.elements.searchQuery.value;

    if (imageSearch.searchQuery === "") {
        emptyQueryMsg('You entered an empty query!');
       return
    }
    console.log(imageSearch.searchQuery);
    resetPageCount();
    refs.gallery.innerHTML = '';

    try {
        const res = await imageSearch.fetchImages();

        if (res.hits.length === 0) {
                Notiflix.Notify.failure("Sorry, there are no images matching your search query. Please try again.");
                return;
            };

        appendMarkup(res.hits);
        Notiflix.Notify.success(`Hooray! We found ${res.totalHits} images.`);
        lightbox.refresh();
            
    
        } catch (error) {
            console.log(error);
        }
    };
    
async function onLoadMore() {
    
    try {
        const res = await imageSearch.fetchImages();
     
        if (refs.gallery.querySelectorAll('.image-card').length === res.totalHits) {
            Notiflix.Notify.info("We're sorry, but you've reached the end of search results.");

        } else {
        appendMarkup(res.hits);
        lightbox.refresh();
        }
      
    } catch (error) {
        console.log(error);
    }
}


function resetPageCount() {
    imageSearch.resetPage();

};

function appendMarkup(data) {
    refs.gallery.insertAdjacentHTML('beforeend', imageCardTpl(data))
};


function emptyQueryMsg(message) {
    Notiflix.Notify.failure(message)
};