const STORE = {
  bookmarks: [],
  adding: false,
  error: null,
  filter: 0,
  minRating: 0
};

function findById(id) {
  return this.STORE.bookmarks.find(currentItem => currentItem.id === id);
}

function addItem(item) {
  this.STORE.bookmarks.push(item);
}

function findAndDelete(id) {
  this.STORE.bookmarks = this.STORE.bookmarks.filter(currentItem => currentItem.id !== id);
}

function changeFilter(newMin) {
  this.STORE.minRating = newMin;
}

function getMinRating() {
  return this.STORE.minRating;
}
function getBookmarks() {
  return this.STORE.bookmarks;
}
export default {
  STORE,
  findById,
  addItem,
  findAndDelete,
  changeFilter,
  getBookmarks,
  getMinRating
};
