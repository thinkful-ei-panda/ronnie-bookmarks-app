
import store from './store.js';
import api from './api.js';

function generateNewBookmarkForm(){
 return`
  <section id="new-bookmark-section"> 
  
  <form id="new-bookmark-form">
  <p class="error hidden"></p>
    <fieldset>
    <legend class="hidden">Add New Bookmark</legend> 
          <h2>Add New Bookmark:</h2>
          <label for="new-name-input" class="hidden">Enter Title</label>
         <input type="text" class="new-name" id="new-name-input" name="new-name" placeholder="Website Name" required>
         <label for="select-a-rating" class="hidden">Choose a rating</label>
          <select class="new-rating" id="select-a-rating" name='new-rating' required>
            <option value="">Select a rating</option>
            <option value="5">★★★★★</option>
            <option value="4">★★★★</option>
            <option value="3">★★★</option>
            <option value="2">★★</option>
            <option value="1">★</option>
          </select>
        </div>
      </div>
      <label for="new-url-input" class="hidden">Enter a URL</label>
      <input type="text" class="new-url" id="new-url-input" name="new-url" placeholder="www.example.com" required>
      
     

      <div class='add-description-box'>
      <label for="new-description" class="hidden">Enter a description</label>
        <textarea id="new-description" name="description-text" placeholder='Add a description'></textarea>
      </div>

      <div class="bookmark-form-buttons">
        <input type="button" id="cancel-new-bookmark" value="Cancel"></input>
        <button type="submit" id="submit-new-bookmark">Create</button>
      </div>
    </fieldset>
  </form>
</section>`
}

function renderNewBookmarkForm(){
  const html = generateNewBookmarkForm();
  $('main').html(html);
}

function generateExpand(item){
  return `
  <div id='${item.id}-description'>
  <section>
  <a href="${item.url}" target="_blank">Visit Site</a>
  <p class='description'>${item.desc}</p>
  <button type="button" class='far fa-trash-alt js-item-delete'> delete</button>
  </section>
</div>
  `
}

function generateCollapse(item){
  return ``
}

function renderExpand(currentElement){
  const html = generateExpand(currentElement);
  $(`.js-item-element-${currentElement.id}`).append(html);
}

function renderCollapse(currentElement){
  const html = generateCollapse();
  $(`#${currentElement.id}-description`).replaceWith(html);
}

function generateHome(){
  return `
 
  <section class='flex flex-row' id='top-buttons'>
    <form id='new-bookmark-button'>
      <button type="submit" class='new-bookmark-button'>+ADD</button>
    </form>
    <form id='rating-selector-form'>
      <label for="min-rating-selector" class='hidden'>Minimum Rating</label>
      <select class="min-rating-selector" id="min-rating-selector" name="min-rating-selector">
        <option value="1">Minimum Rating</option>
        <option value="5">★★★★★</option>
        <option value="4">★★★★</option>
        <option value="3">★★★</option>
        <option value="2">★★</option>
        <option value="1">★</option>
    </select>
    </form>
  </section>

    <ul class="bookmark-list js-bookmark-list">
     </ul>  
  `
}

function renderHome(){
  const html = generateHome();
  $('main').html(html);
}

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
  
  return `<li class='js-item-element-${item.id}' id='${item.id}' data-item-id="${item.id}">
              <h2 class="bookmark-label">${item.title}</h2>
                <span class="star-rating">
                    ${generateItemRating(item)}
                </span>
                  <button id='${item.id}-button' type="button" class="fa fa-plus" > more</button>
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
  let bookmarks = store.getBookmarks();
  let minRating = store.getMinRating();
  if (minRating) {
    bookmarks = bookmarks.filter(item => item.rating >= minRating);
  }
  const bookmarksString = generateBookmarksString(bookmarks);
  $('.js-bookmark-list').html(bookmarksString);
}

function handleNewBookmarkButton() {
  $('main').on('click','.new-bookmark-button', event => {
    event.preventDefault();
    renderNewBookmarkForm();  
  });
}

function handleNewItemSubmit() {
  $('main').submit('#submit-new-bookmark', event => {
    event.preventDefault();
    let expression = /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/gi;
    let regex = new RegExp(expression);
    const newItemName = $('.new-name').val();
    const newItemURL = $('.new-url').val();
    const newItemRating = $('.new-rating').val();
    let newItemDesc = '';
    if ($('#new-description')) {
      newItemDesc = $('#new-description').val();
    }
    if (newItemURL.match(regex)) {
      if (!$('.error').hasClass('hidden')){
        $('.error').removeClass('hidden');
      };
      const newOne = api.createBookmark(newItemName, newItemURL, newItemDesc, newItemRating);
      newOne.then((data)=> {
        store.addItem(data);
        render();
        renderHome();
        
      })
      .catch((err) => {
        renderErrorMessage(err.message)
      })
    } else {
      renderErrorMessage('Check the URL')
    }
  })
}

function getItemIdFromElement(item) {
  return $(item)
    .closest('.js-item-element')
    .data('item-id');
}

function handleBookmarkExpand() {
  $('main').on('click','.fa-plus', event => {
    event.preventDefault();
    let id = $(event.target).closest('li').attr('id');
    const currentElement = store.findById(id);
    if(currentElement){
      renderExpand(currentElement);
    }
    $(`#${id}-button`).removeClass('fa-plus');
    $(`#${id}-button`).addClass('fa-minus');
  });
}

function handleBookmarkCollapse() {
  $('main').on('click','.fa-minus', event => {
    event.preventDefault();
    let id = $(event.target).closest('li').attr('id');
    const currentElement = store.findById(id);
    if(currentElement){
      renderCollapse(currentElement);
    }
    
    $(`#${id}-button`).removeClass('fa-minus');
    $(`#${id}-button`).addClass('fa-plus');
  });
}

function handleDeleteItemClicked() {
  $('main').on('click', '.js-item-delete', event => {
    event.preventDefault();
    const id = $(event.target).closest('li').attr('id');
    api.deleteBookmark(id)
      .then(() => {
        store.findAndDelete(id);
        render();
      })
      .catch(err => renderErrorMessage(err.message));
  });
}

function handleCancelNewBookmark() {
  $('main').on('click', '#cancel-new-bookmark', event => {
    event.preventDefault();
    renderHome();
    render();
  });
}

function handleFilterChange() {
  $('main').change('.min-rating-selector', event => {
    event.preventDefault();
    store.changeFilter($('.min-rating-selector').val());
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
  renderHome,
  render,
  bindEventListeners
};
