import './sass/main.scss';
import ImageSearch from './js/pic-fetch';
import Notiflix from "notiflix";
import Axios from "axios";
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.css';
import imageCardTpl from './templates/image-card.hbs';
import imageModalTpl from './templates/image-modal.hbs';
import './js/lightbox';

const imageSearch = new ImageSearch();

const refs = {
    searchForm: document.getElementById('search-form'),
    searchInput: document.getElementById('search-input'),
    gallery: document.querySelector('.gallery'),
    loadMoreBtn: document.getElementById('show-more-btn'),
};
let lightbox = new SimpleLightbox('.gallery a');
refs.searchForm.addEventListener('submit', onFormSubmit)
refs.loadMoreBtn.addEventListener('click', onLoadMore)

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
            refs.loadMoreBtn.classList.add('hidden')
                Notiflix.Notify.failure("Sorry, there are no images matching your search query. Please try again.");
                return;
            };

        appendMarkup(res.hits);
        Notiflix.Notify.success(`Hooray! We found ${res.totalHits} images.`);
        lightbox.refresh();
        refs.loadMoreBtn.classList.remove('hidden');
            
    
        } catch (error) {
            console.log(error);
        }
    };
    
async function onLoadMore() {
    
    try {
        const res = await imageSearch.fetchImages();
     
        if (refs.gallery.querySelectorAll('.image-card').length === res.totalHits) {
            refs.loadMoreBtn.classList.add('hidden');
            Notiflix.Notify.info("We're sorry, but you've reached the end of search results.");

        } else {

        appendMarkup(res.hits);
        lightbox.refresh();

        }
      
    } catch (error) {
        console.log(error);
    }
}

async function onImageClick () {
    console.log('click on image')
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