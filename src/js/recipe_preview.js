import { allRecipesPagination } from './controller';
const paginationContainer = document.querySelector('.pagination');
const prevPageBtn = document.querySelector('.pagination__btn--prev');
const nextPageBtn = document.querySelector('.pagination__btn--next');
const searchResults = document.querySelector('.results');

let paginationButtonsRendered = false;
export let numPages = 1;
export let curPage = 1;
/////////////////////////////////
// Render the recipes in a list

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
export const addPageNumbers = function (recipes) {
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

  if (numPages === 1 || paginationButtonsRendered) return;

  nextPageBtn.addEventListener('click', function () {
    if (curPage === numPages) return;
    curPage++;
    clearSearchResults();
    console.log(`current page: ${curPage}`);
    renderRecipesPreview(allRecipesPagination);
  });

  prevPageBtn.addEventListener('click', function () {
    if (curPage === 1) return;
    curPage--;
    clearSearchResults();
    console.log(`current page: ${curPage}`);
    renderRecipesPreview(allRecipesPagination);
  });

  paginationButtonsRendered = true;
};

const clearSearchResults = function () {
  searchResults.innerHTML = '';
};
