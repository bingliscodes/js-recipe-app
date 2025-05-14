import { sendPostRequest } from './api_calls';
import { userRecipes } from './controller';

const userInputOverlay = document.querySelector('.overlay');
const userInputForm = document.querySelector('.add-recipe-window');
const closeBtn = document.querySelector('.btn--close-modal');
const addRecipeForm = document.querySelector('.upload');
const addRecipeBtn = document.querySelector('.nav__btn--add-recipe');

/////////////////////////////
// Implement addRecipe functionality.
/*
When the "add Recipe" button is clicked a pop up should appear with user inputs and an "upload" button at the bottom.

When upload is clicked, it should upload the recipe somehow. Not entirely sure how that is implemented, but likely as an object created from the inputs

*/

export const toggleUserInput = function () {
  userInputOverlay.classList.toggle('hidden');
  userInputForm.classList.toggle('hidden');
};

addRecipeBtn.addEventListener('click', toggleUserInput);
closeBtn.addEventListener('click', toggleUserInput);

const parseIngredient = function (ingredientStr) {
  /*
    Takes in a string from a user input in format quantity,unit,description'
    Returns an object for the ingredient
    */

  const ingredientArr = ingredientStr.split(',');
  const ingredientObj = {
    quantity: ingredientArr[0] !== '' ? +ingredientArr[0] : null,
    unit: ingredientArr[1],
    description: ingredientArr[2],
  };
  return ingredientObj;
};

addRecipeForm.addEventListener('submit', function (e) {
  e.preventDefault();
  let ingredients = [];
  for (let i = 1; i <= 6; i++) {
    let ing = addRecipeForm.elements[`ingredient-${i}`].value;
    if (ing !== '') {
      ingredients.push(
        parseIngredient(addRecipeForm.elements[`ingredient-${i}`].value)
      );
    }
  }
  // Extract input data into an object similar to format we receive from API
  /* A recipe object contains:
    -publisher
    -ingredients (where each ingredient is an object with quantity, unit, and description)
    -source_url
    -image_url
    -title
    -servings
    -cooking_time
    -id (this is returned from a successful POST request)
    All are strings except ingredients
  */
  const newRecipe = {
    title: addRecipeForm.elements['title'].value,
    source_url: addRecipeForm.elements['sourceUrl'].value,
    image_url: addRecipeForm.elements['image'].value,
    publisher: addRecipeForm.elements['publisher'].value,
    cooking_time: +addRecipeForm.elements['cookingTime'].value,
    servings: +addRecipeForm.elements['servings'].value,
    ingredients,
  };

  // Clear form and hide the user input interface
  addRecipeForm.reset();
  toggleUserInput();

  // Make a POST request to the Forkify API with the new recipe. Make sure to include the API key for this to work.
  sendPostRequest(newRecipe);
  return newRecipe;
});
