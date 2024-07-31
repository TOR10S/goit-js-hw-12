import searchImagesByQuery from "./js/pixabay-api";
import { createImages, clearImages, scrollDown } from "./js/render-functions";

// Описаний у документації
import iziToast from "izitoast";
// Додатковий імпорт стилів
import "izitoast/dist/css/iziToast.min.css";
// Описаний у документації

const form = document.querySelector(".gallery-form");
const input = document.querySelector(".input-for-gallery");
const loader = document.querySelector(".loader");
const button = document.querySelector(".load");
const message = document.querySelector(".bottom")

let page = 1;
let wordFromStart = "";
let currentWord = "";

button.addEventListener("click", handleClick)
form.addEventListener("submit", handleSubmit)

function handleSubmit(event) {
    clearImages()
    event.preventDefault();
    loader.classList.remove("hiden")
    message.classList.remove("show-text")
    let wordForSearch = input.value.trim();
    wordFromStart = wordForSearch;
    currentWord = wordForSearch;
      page = 1;
    if (wordForSearch === '') {
      iziToast.error({
        position: "topRight",
          message: 'Please fill the input',
      });
      loader.classList.add("hiden")
      return;
  }  
    searchImagesByQuery(`${wordForSearch}`, page).then((data) => {if (data.total === 0) {
      iziToast.error({
        position: "topRight",
          message: 'Sorry, there are no images matching your search query. Please try again!',
      });
      loader.classList.add("hiden")
      return;
    } else {
    createImages(data);    
    button.classList.remove("hiden");
  }
  if (data.hits.length < 15) {
    button.classList.add("hiden");
    iziToast.info({
      position: "topRight",
      message: "We're sorry, but you've reached the end of search results.",
  });
  message.classList.add("show-text");
}
    loader.classList.add("hiden")
    
  });

}

  function handleClick(event) {
  if (wordFromStart !== currentWord) {
    page = 1;
  }
  page += 1;
  loader.classList.remove("hiden")
  searchImagesByQuery(`${wordFromStart}`, page).then((data) => {
    if (data.hits.length < 15) {
      button.classList.add("hidden");
      iziToast.info({
          position: "topRight",
          message: "We're sorry, but you've reached the end of search results.",
      });
      loader.classList.add("hiden")
      button.classList.add("hiden")
      message.classList.add("show-text")
  }
    createImages(data)
    scrollDown()
    loader.classList.add("hiden");
  }).catch(error => {
    iziToast.error({
        position: "topRight",
        message: error,
    });
    loader.classList.add("hiden");
});
  
}