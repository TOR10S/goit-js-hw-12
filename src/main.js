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

form.addEventListener("submit", handleSubmit)
button.addEventListener("click", handleClick);

function handleSubmit(event) {
    clearImages()
    event.preventDefault();
    loader.classList.remove("hiden");
    message.classList.remove("show-text")
    let wordForSearch = input.value.trim();
    wordFromStart = wordForSearch;
    page = 1;
    if (wordForSearch === '') {
      iziToast.error({
        position: "topRight",
          message: 'Please fill the input',
      });
      loader.classList.add("hiden")
      return;
  }  
    searchImagesByQuery(`${wordForSearch}`, page).then(async (data) => {
    if (data.total === 0) {
      iziToast.error({
        position: "topRight",
          message: 'Sorry, there are no images matching your search query. Please try again!',
      });
      loader.classList.add("hiden")
      return;
    } else {
    await createImages(data);    
    button.classList.remove("hiden");
  }
  if (data.hits.length < 15) {
    button.classList.add("hiden");
    message.classList.add("show-text")
    iziToast.info({
      position: "topRight",
      message: "We're sorry, but you've reached the end of search results.",
  });
}
    loader.classList.add("hiden")
    
  });

}

  function handleClick(event) {
  page += 1;
  loader.classList.remove("hiden")
  button.classList.add("hiden")
  searchImagesByQuery(`${wordFromStart}`, page).then((data) => {
    if (data.hits.length < 15) {
      button.classList.add("hidden");
      message.classList.add("show-text")
      iziToast.info({
          position: "topRight",
          message: "We're sorry, but you've reached the end of search results.",
      });
      loader.classList.add("hiden")
      button.classList.add("hiden")
  } else {button.classList.remove("hiden")}
    createImages(data)
    scrollDown()
    loader.classList.add("hiden");
  }).catch(error => {
    iziToast.error({
        position: "topRight",
        message: error.message,
    });
    loader.classList.add("hiden");
});
  
}
