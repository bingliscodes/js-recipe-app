import API_KEY from './api_key.js';
import { getRecipeById } from './api_calls.js';
import {
  renderRecipe,
  clearRecipeContainer,
  recipeContainer,
} from './render_recipe.js';
import { addRecipeClick } from './add_recipe.js';
import { addLoadSpinner, removeLoadSpinner } from './load_icon.js';
import { renderBookmarks } from './bookmarks.js';
import { renderRecipesPreview, searchAPI } from './recipe_preview.js';

const searchBar = document.querySelector('.search__field');
const searchBtn = document.querySelector('.search__btn');
const searchResults = document.querySelector('.results');

export const bookmarkContainer = document.querySelector('.bookmarks__list');
export let selectedRecipePreview;
export let selectedRecipeData;
export let selectedRecipeId;
export let searchResultsArr;
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
