export const scaleRecipe = function (newServings, ingredients) {
  /*
    Takes in an ingredients object and the base number of servings, then returns a new scaled recipe 
    Note that each ingredient has props quantity, unit, and description
  */
  ingredients.forEach((ing, idx) => {
    const newQuantity =
      ing.quantity && (ing.ingredientRatio * newServings).toFixed(2);
    const curIngredientHTML = document.querySelector(`[data-id = "${idx}"]`);
    curIngredientHTML.querySelector('.recipe__quantity').innerText =
      newQuantity;
  });
};

export const getIngredientRatio = function (servings, ingredients) {
  /*
    Returns a new array with a ratio of ingredients to servings that we can use to easily scale recipes

    Basically the ingredient ratio is original quantity / servings
    */
  return ingredients.map(ing => {
    const ingredientRatio = ing.quantity && ing.quantity / servings;
    return { ...ing, ingredientRatio };
  });
};
