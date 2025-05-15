////////////////
// Implement loading spinner
import icons from 'url:../img/icons.svg';

export const addLoadSpinner = function (element) {
  /*
    Adds the loading spinner to the specified element
  */
  const html = `
  <div class="spinner">
    <svg>
      <use href="${icons}#icon-loader"></use>
    </svg>
  </div>
`;
  element.insertAdjacentHTML('afterbegin', html);
};

export const removeLoadSpinner = function () {
  if (document.querySelector('.spinner'))
    document.querySelector('.spinner').remove();
};
