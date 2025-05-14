import icons from 'url:../img/icons.svg';

export const renderBookmarks = function (bookmarkContainer) {
  // For each recipe bookmarkedRecipes, append the value to the bookmarks bar to repopulate the bookmarks
  const bookmarks = JSON.parse(localStorage.getItem('bookmarks'));
  bookmarkContainer.innerHTML = '';
  if (bookmarks.length > 0) {
    //bookmarkContainer.querySelector('.message').style.display = 'none';
    let html = ``;
    bookmarks.forEach(bookmark => {
      html = html + renderPreview(bookmark);
    });
    bookmarkContainer.innerHTML = ('beforeend', html);
  }

  if (bookmarks.length === 0) {
    bookmarkContainer.innerHTML = `
                <div class="message">
                    <div>
                      <svg>
                        <use href="${icons}#icon-smile"></use>
                      </svg>
                    </div>
                    <p>
                      No bookmarks yet. Find a nice recipe and bookmark it :)
                    </p>
                  </div>`;
  }
};
const renderPreview = function (recipe) {
  // Takes in a recipe object and returns a preview html element
  const previewHtml = `
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
  return previewHtml;
};
