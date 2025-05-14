import { scaleRecipe, getIngredientRatio } from './scale_recipe.js';
import {
  selectedRecipePreview,
  selectedRecipeData,
  selectedRecipeId,
  bookmarks,
  bookmarkContainer,
} from './controller.js';
import icons from 'url:../img/icons.svg';
import { renderBookmarks } from './bookmarks.js';
export const recipeContainer = document.querySelector('.recipe');
export let bookmarkedRecipes = {};
export const testData = {
  recipe: {
    cooking_time: 60,
    image_url: 'http://forkify-api.herokuapp.com/images/IMG_15866d21.jpg',
    ingredients: [
      { quantity: 1, unit: 'pound', description: 'fresh pizza dough' },
      { quantity: null, unit: '', description: 'Olive oil for brushing' },
      { quantity: 0.33, unit: 'cup', description: 'bbq sauce' },
      { quantity: 1, unit: 'cup', description: 'shredded cheddar cheese' },
      { quantity: 1, unit: 'cup', description: 'shredded cooked chicken' },
      {
        quantity: 0.5,
        unit: 'cup',
        description: 'roasted corn cut off the cob',
      },
      { quantity: 1, unit: '', description: 'red onion thinly sliced' },
      { quantity: 0.5, unit: 'cup', description: 'halved cherry tomatoes' },
      { quantity: null, unit: '', description: 'Small handful of cilantro' },
      {
        quantity: null,
        unit: '',
        description: 'Small handful of chopped green onions',
      },
      {
        quantity: null,
        unit: '',
        description: 'Kosher salt and freshly cracked black pepper to taste',
      },
    ],
    servings: 4,
    publisher: 'Ben',
    source_url: 'http://whatsgabycooking.com/grilled-bbq-chicken-pizza/',
    title: 'Pizza',
  },
};
export const renderRecipe = function ({ recipe }) {
  const {
    cooking_time,
    image_url,
    ingredients,
    publisher,
    servings,
    source_url,
    title,
  } = recipe;

  let curServings = servings;
  const ingredientsWithRatio = getIngredientRatio(servings, ingredients);
  // Render components from the passed in recipe
  const figureHTML = `
    <figure class="recipe__fig">
        <img src="${image_url}" alt="Tomato" class="recipe__img" />
        <h1 class="recipe__title">
        <span>${title}</span>
        </h1>
        </figure>

    <div class="recipe__details">
        <div class="recipe__info">
            <span class="material-icons">timer</span>
                <span class="recipe__info-data recipe__info-data--minutes">${cooking_time}</span>
            <span class="recipe__info-text">minutes</span>
        </div>
        <div class="recipe__info">
            <span class="material-icons">people</span>
                <span class="recipe__info-data recipe__info-data--people">${servings}</span>
            <span class="recipe__info-text">servings</span>

        <div class="recipe__info-buttons">
            <button class="btn--tiny btn--decrease-servings">
                <span class="material-icons">remove</span>
            </button>
            <button class="btn--tiny btn--increase-servings">
                <span class="material-icons">add</span>
            </button>
        </div>
     </div>
        <div class="recipe__user-generated hidden">
            <span class="material-icons">person</span>
        </div>
          <button class="btn--round">
            <svg class="btn--bookmark">
              <use href="${icons}#icon-bookmark"></use>
            </svg>
          </button>
      </div>`;

  recipeContainer.insertAdjacentHTML('beforeend', figureHTML);

  const increaseBtn = recipeContainer.querySelector('.btn--increase-servings');
  const decreaseBtn = recipeContainer.querySelector('.btn--decrease-servings');
  const bookmarkBtn = recipeContainer.querySelector('.btn--bookmark');

  increaseBtn.addEventListener('click', () => {
    scaleRecipe(++curServings, ingredientsWithRatio);
    renderServings(curServings);
  });
  decreaseBtn.addEventListener('click', () => {
    if (servings === 1) return;
    scaleRecipe(--curServings, ingredientsWithRatio);
    renderServings(curServings);
  });
  bookmarkBtn.addEventListener('click', handleBookmarkClick);

  // This is how we will unhide the user icon if needed. Meaning we should prob put it in the main index.html?
  const userGeneratedIcon = document.querySelector('.recipe__user-generated');

  renderIngredients(ingredients);

  renderFooter(publisher, source_url);
};

const renderIngredients = function (ingredients) {
  // Takes in an object of ingredients and renders each one as a list item
  // Note that each ingredient has props quantity, unit, and description
  const ingredientsHTML = `
  <div class="recipe__ingredients">
      <h2 class="heading--2">Recipe ingredients</h2>
          <ul class="recipe__ingredient-list">
          
          </ul>
    </div>`;
  recipeContainer.insertAdjacentHTML('beforeend', ingredientsHTML);
  const ingredientsContainer = document.querySelector(
    '.recipe__ingredient-list'
  );

  ingredients.forEach((ingredient, idx) => {
    const ingredientHTML = `<li class="recipe__ingredient" data-id="${idx}">
        <span class="material-icons">done</span>
        <div class="recipe__quantity">${ingredient.quantity || ''}</div>
        <div class="recipe__description">
         <span class="recipe__unit">${ingredient.unit}</span>
        ${ingredient.description}
        </div>
    </li>`;
    ingredientsContainer.insertAdjacentHTML('beforeend', ingredientHTML);
  });
};

const renderServings = function (servings) {
  document.querySelector(
    '.recipe__info-data--people'
  ).innerText = `${servings}`;
};

const renderFooter = function (publisher, source_url) {
  const footerHTML = `
        <div class="recipe__directions">
            <h2 class="heading--2">How to cook it</h2>
                <p class="recipe__directions-text">
                This recipe was carefully designed and tested by
                <span class="recipe__publisher">${publisher}</span>. Please check out
                directions at their website.
                </p>
            <a
                class="btn--small recipe__btn"
                href="${source_url}"
                target="_blank"
                >
            <span>Directions</span>
            <span class="material-icons">arrow_forward</span>
            </a>
        </div>`;
  recipeContainer.insertAdjacentHTML('beforeend', footerHTML);
};

export const clearRecipeContainer = function () {
  recipeContainer.innerHTML = ``;
};

const handleBookmarkClick = async function (e) {
  let bookmarked = false;
  let idxToDelete = -1;
  // TODO: Fix the highlighting of the target element
  for (const [idx, rec] of Object.entries(bookmarks)) {
    if (selectedRecipeId === rec.id) {
      bookmarked = true;
      idxToDelete = idx;
    }
  }
  if (!bookmarked) {
    bookmarks.push(selectedRecipeData.recipe);
    e.target.innerHTML = `<use href="${icons}#icon-bookmark-fill"></use>`;
  } else {
    if (idxToDelete > -1) bookmarks.splice(idxToDelete, 1);
    if (bookmarks.length === 0) {
      //bookmarkContainer.querySelector('.message').style.display = 'flex';
    }
    e.target.innerHTML = `<use href="${icons}#icon-bookmark"></use>`;
  }
  localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
  renderBookmarks(bookmarkContainer);
};
