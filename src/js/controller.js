import API_KEY from './api_key.js';
import { getRecipeById } from './api_calls.js';
import {
  renderRecipe,
  clearRecipeContainer,
  recipeContainer,
  bookmarkedRecipes,
} from './render_recipe.js';
import { addRecipeClick } from './add_recipe.js';
import { addLoadSpinner, removeLoadSpinner } from './load_icon.js';
import { renderBookmarks } from './bookmarks.js';

const searchBar = document.querySelector('.search__field');
const searchBtn = document.querySelector('.search__btn');
const searchResults = document.querySelector('.results');
const paginationContainer = document.querySelector('.pagination');
const prevPageBtn = document.querySelector('.pagination__btn--prev');
const nextPageBtn = document.querySelector('.pagination__btn--next');

let numPages = 1;
let curPage = 1;
export const bookmarkContainer = document.querySelector('.bookmarks__list');
export let selectedRecipePreview;
export let selectedRecipeData;
export let selectedRecipeId;
export const bookmarks = [];
export let userRecipes = [];

const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};

// NEW API URL (instead of the one shown in the video)
// https://forkify-api.jonas.io

///////////////////////////////////////
//https://forkify-api.jonas.io/api/v2/recipes?search=pizza&key=<APIKEY>to search

/////////////////////////////////
// User search -> API call

const searchAPI = async function (searchText) {
  try {
    addLoadSpinner(searchResults);
    const res = await fetch(
      `https://forkify-api.jonas.io/api/v2/recipes?search=${searchText}&key=${API_KEY}`
    );

    if (!res.ok) throw new Error('Error getting recipes');

    const recipeJSON = await res.json();
    removeLoadSpinner();
    const allRecipes = recipeJSON.data.recipes;
    const allRecipesPagination = addPageNumbers(allRecipes);
    renderRecipesPreview(allRecipesPagination);
  } catch (err) {
    console.error(err);
  }
};

searchBtn.addEventListener('click', async function (e) {
  e.preventDefault();
  const searchText = searchBar.value;
  try {
    searchAPI(searchText.toLowerCase());
  } catch (err) {
    console.error(err);
  }
});

/////////////////////////////////
// Render the recipes in a list

const renderRecipesPreview = function (recipes) {
  /*
  Takes in an array of recipe objects. Each recipe has props publisher, image_url, and title
  */
  recipes.forEach(recipe => {
    const html = `
            <li class="preview" data-recipe-id="${recipe.id}">
              <a class="preview__link preview__link--active" href="#${
                recipe.id
              }">
                <figure class="preview__fig">
                  <img src=${
                    recipe.image_url
                  } alt=${`Image of ${recipe.title}`} />
                </figure>
                <div class="preview__data">
                  <h4 class="preview__title">${recipe.title}</h4>
                  <p class="preview__publisher">${recipe.publisher}</p>
                  <div class="preview__user-generated">
                    <svg>
                      <use href="src/img/icons.svg#icon-user"></use>
                    </svg>
                  </div>
                </div>
              </a>
            </li>
            `;
    searchResults.insertAdjacentHTML('afterbegin', html);
  });
};

/////////////////////////////////
// Implement pagination
/*
We want 10 results per page. Basically we want to implement the slider behavior using the floor of dividing by 10 to assign a page
then we can show the first 10 when page 1 is selected, second 10 page 2, etc.
*/
const addPageNumbers = function (recipes) {
  const recipesPagination = recipes.map((recipe, idx) => {
    const pageNumber = Math.floor(idx / 10);
    return { ...recipe, pageNumber };
  });
  numPages = recipesPagination[recipesPagination.length - 1].pageNumber + 1;
  return recipesPagination;
};
const renderPageButtons = function () {
  /*
  Dynamically render page buttons and add event listeners.
  We always start on page one.
  We only show the prev page button when not on page one
  */

  if (numPages === 1) return;

  nextPageBtn.addEventListener('click', function () {
    if (curPage === numPages) return;
    curPage++;
    console.log(curPage);
  });

  prevPageBtn.addEventListener('click', function () {
    if (curPage === 1) return;
    curPage--;
    console.log(curPage);
  });
};

renderPageButtons();

/////////////////////////////////
// Display Recipe

const renderClickedRecipe = async function (e) {
  selectedRecipePreview = e.target.closest('.preview');
  selectedRecipeId = selectedRecipePreview?.dataset?.recipeId;

  if (!selectedRecipeId) return;
  try {
    clearRecipeContainer();
    addLoadSpinner(recipeContainer);
    selectedRecipeData = await getRecipeById(selectedRecipeId);
    removeLoadSpinner();
    renderRecipe(selectedRecipeData);
  } catch (err) {
    console.error(err);
  }
};
searchResults.addEventListener('click', renderClickedRecipe);
bookmarkContainer.addEventListener('click', renderClickedRecipe);

/////////////////////////////////
// Implement Bookmarks
/*

The implementation for adding to the bookmarks bar is currently in render_recipe as an event listener on the bookmark button

Rendering recipe from bookmarks bar is handled by adding the renderClickedRecipe listener to the bookmarkContainer

TODO: Bookmarks should persist in local storage. Can store the entire recipe JSON object in local storage
*/

renderBookmarks(bookmarkContainer);
// See add_recipe module for Add Recipe implementation
