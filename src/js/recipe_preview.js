import { addLoadSpinner, removeLoadSpinner } from './load_icon.js';
import API_KEY from './api_key';

const prevPageBtn = document.querySelector('.pagination__btn--prev');
const nextPageBtn = document.querySelector('.pagination__btn--next');
const searchResults = document.querySelector('.results');

const recordsPerPage = 10;
export let curPage = 1;

// TODO: Have the pagination buttons and page span hidden until something is searched.

/////////////////////////////////
// User search -> API call
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

//////////////////////////////
// Pagination implementation adapted from https://stackoverflow.com/questions/25434813/simple-pagination-in-javascript
const renderRecipesWithPagination = async function (allRecipes) {
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
