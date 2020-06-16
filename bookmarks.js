
import store from './store.js';
import api from './api.js';


function generateItemRating(item) {
  let html = [];
  for (let i=0; i<item.rating; i++) {
    html.push('<i class=\'fas fa-star\'></i>');
  }
  if (item.rating<5) {
    for (let i=0; i < (5-item.rating); i++) {
      html.push('<i class=\'far fa-star\'></i>');
    }
  }
  return html.join('');
}

function generateItemElement(item) {
  
  return `<li class='js-item-element' id='${item.id}' data-item-id="${item.id}">
              <h3 class="bookmark-label">${item.title}</h3>
                <span class="star-rating">
                    ${generateItemRating(item)}
                </span>
                  <button id='${item.id}-button' type="button" class="fa fa-plus"></button>
                  <div id='${item.id}-description' class='hidden'>
                  <section>
                  <a href="${item.url}" target="_blank">Visit Site</a>
                  <p class='description'>${item.desc}</p>
                  <button type="button" class='far fa-trash-alt js-item-delete'></button>
                  </section>
                </div>
          </li>`;
}

function generateErrorMessage(message) {
  return `Something went wrong: ${message}`;
}

function renderErrorMessage(message) {
  const html = generateErrorMessage(message);
  $('.error').html(html)
    .removeClass('hidden');
}

function generateBookmarksString(bookmarks) {
  const items = bookmarks.map((item) => generateItemElement(item));
  return items.join('');
}

function render() {
  let bookmarks = [...store.STORE.bookmarks];
  if (store.STORE.minRating) {
    bookmarks = bookmarks.filter(item => item.rating >= store.STORE.minRating);
  }
  const bookmarksString = generateBookmarksString(bookmarks);
  $('.js-bookmark-list').html(bookmarksString);
}

function handleNewBookmarkButton() {
  $('#new-bookmark-button').submit(event => {
    event.preventDefault();
    $('#new-bookmark-section').removeClass('hidden');
    render();
  });
}

function handleNewItemSubmit() {
  $('#new-bookmark-form').submit(event => {
    event.preventDefault();
    const newItemName = $('.new-name').val(),
      newItemURL = $('.new-url').val(),
      newItemRating = $('.new-rating').val();
    let newItemDesc = '';
    if ($('#new-description')) {
      newItemDesc = $('#new-description').val();
    }
    if (newItemURL.match(/http/g)) {
      if (!$('.error').hasClass('hidden')){
        $('.error').addClass('hidden');
      }
      api.createBookmark(newItemName,newItemURL,newItemDesc,newItemRating)
        .then((newItem) => {
          store.addItem(newItem);
          $('#new-bookmark-section').addClass('hidden');
          render();
        })
        .catch(err => renderErrorMessage(err.message));
    } else {
      renderErrorMessage('Check the url (http/https)');
    }
  });
}

function getItemIdFromElement(item) {
  return $(item)
    .closest('.js-item-element')
    .data('item-id');
}

function handleBookmarkExpand() {
  $('ul').on('click','.fa-plus', event => {
    event.preventDefault();
    let id = $(event.target).closest('li').attr('id');
    $(`#${id}-description`).removeClass('hidden');
    $(`#${id}-button`).removeClass('fa-plus');
    $(`#${id}-button`).addClass('fa-minus');
  });
}

function handleBookmarkCollapse() {
  $('ul').on('click','.fa-minus', event => {
    event.preventDefault();
    let id = $(event.target).closest('li').attr('id');
    $(`#${id}-description`).addClass('hidden');
    $(`#${id}-button`).removeClass('fa-minus');
    $(`#${id}-button`).addClass('fa-plus');
  });
}

function handleDeleteItemClicked() {
  $('.js-bookmark-list').on('click', '.js-item-delete', event => {
    const id = getItemIdFromElement(event.currentTarget);
    api.deleteBookmark(id)
      .then(() => {
        store.findAndDelete(id);
        render();
      })
      .catch(err => renderErrorMessage(err.message));
  });
}

function handleCancelNewBookmark() {
  $('#cancel-button').click(event => {
    event.preventDefault();
    $('#new-bookmark-section').addClass('hidden');
  });
}

function handleFilterChange() {
  $('.min-rating-selector').change(event => {
    store.changeFilter($(event.target).val());
    render();
  });
}

function bindEventListeners() {
  handleNewBookmarkButton();
  handleNewItemSubmit();
  handleDeleteItemClicked();
  handleBookmarkExpand();
  handleBookmarkCollapse();
  handleFilterChange();
  handleCancelNewBookmark();
}

export default {
  render,
  bindEventListeners
};