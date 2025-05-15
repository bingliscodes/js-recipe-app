import { allRecipesPagination } from './controller';
import { addLoadSpinner, removeLoadSpinner } from './load_icon.js';
import API_KEY from './api_key';

const prevPageBtn = document.querySelector('.pagination__btn--prev');
const nextPageBtn = document.querySelector('.pagination__btn--next');
const searchResults = document.querySelector('.results');

let paginationButtonsRendered = false;
const recordsPerPage = 10;
export let curPage = 1;

export const searchAPI = async function (searchText) {
  try {
    addLoadSpinner(searchResults);
    const res = await fetch(
      `https://forkify-api.jonas.io/api/v2/recipes?search=${searchText}&key=${API_KEY}`
    );

    if (!res.ok) throw new Error('Error getting recipes');

    const recipeJSON = await res.json();
    removeLoadSpinner();
    const allRecipes = recipeJSON.data.recipes;
    renderRecipesWithPagination(allRecipes);
    return allRecipes;
  } catch (err) {
    console.error(err);
  }
};

// Use below for testing
const renderRecipesWithPagination = async function (allRecipes) {
  //   const allRecipes = await searchAPI('Pizza');
  // console.log(allRecipes);
  const prevPage = function () {
    if (curPage > 1) {
      curPage--;
      changePage(curPage);
    }
  };

  const nextPage = function () {
    if (curPage < numPages()) {
      curPage++;
      changePage(curPage);
    }
  };

  prevPageBtn.addEventListener('click', prevPage);
  nextPageBtn.addEventListener('click', nextPage);

  const changePage = function (page) {
    const pageSpan = document.getElementById('page');

    // Validate page
    if (page < 1) page = 1;
    if (page > numPages()) page = numPages();

    searchResults.innerHTML = '';

    for (let i = (page - 1) * recordsPerPage; i < page * recordsPerPage; i++) {
      const recipe = allRecipes[i];
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
      searchResults.innerHTML += html;
    }
    pageSpan.innerHTML = page;

    if (page == 1) {
      prevPageBtn.style.visibility = 'hidden';
    } else {
      prevPageBtn.style.visibility = 'visible';
    }

    if (page == numPages()) {
      nextPageBtn.style.visibility = 'hidden';
    } else {
      nextPageBtn.style.visibility = 'visible';
    }
  };

  const numPages = function () {
    return Math.ceil(allRecipes.length / recordsPerPage);
  };

  changePage(1);
};

// TODO: replace objJson with an array of the recipes (allRecipes). We can likely remove the "addpages" call since that's handled just by using the
// length of the array
// Use for testing purposes. Will replace with search results
// Basically this will become an array of recipe objects, then we can extract the previews from the objects when rendering the searchResults
const objJson = [
  { adName: 'AdName 1' },
  { adName: 'AdName 2' },
  { adName: 'AdName 3' },
  { adName: 'AdName 4' },
  { adName: 'AdName 5' },
  { adName: 'AdName 6' },
  { adName: 'AdName 7' },
  { adName: 'AdName 8' },
  { adName: 'AdName 9' },
  { adName: 'AdName 10' },
];

///////////////////////////////////////
// Render the recipe previews in a list

export const renderRecipesPreview = function (recipes) {
  /*
  Takes in an array of recipe objects. Each recipe has props publisher, image_url, title, and pageNumber
  */

  recipes
    .filter(recipe => recipe.pageNumber === curPage)
    .forEach(recipe => {
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
  renderPageButtons();
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
// const renderPageButtons = function () {
//   /*
//   Dynamically render page buttons and add event listeners.
//   We always start on page one.
//   We only show the prev page button when not on page one
//   */

//   if (numPages === 1 || paginationButtonsRendered) return;

//   nextPageBtn.addEventListener('click', function () {
//     if (curPage === numPages) return;
//     curPage++;
//     clearSearchResults();
//     console.log(`current page: ${curPage}`);
//     renderRecipesPreview(allRecipesPagination);
//   });

//   prevPageBtn.addEventListener('click', function () {
//     if (curPage === 1) return;
//     curPage--;
//     clearSearchResults();
//     console.log(`current page: ${curPage}`);
//     renderRecipesPreview(allRecipesPagination);
//   });

//   paginationButtonsRendered = true;
// };

// const clearSearchResults = function () {
//   searchResults.innerHTML = '';
// };
