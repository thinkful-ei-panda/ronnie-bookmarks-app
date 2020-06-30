const BASE_URL = 'https://thinkful-list-api.herokuapp.com/rwnjmz';

function listApiFetch(...args) {
  let error;
  return fetch(...args)
    .then(res => {
      console.log(res);
      if (!res.ok) {
        error = { code: res.status };
      }
      return res.json();
    })
    .then(data => {
      if (error) {
        error.message = data.message;
        return Promise.reject(error);
      }
      return data;
    });
}

function getBookmarks() {
  return listApiFetch(`${BASE_URL}/bookmarks`);
}

function createBookmark(title, url, desc, rating) {
  let newBookmark = {
    title: title,
    url: url,
    desc: desc,
    rating: rating,
  };
  return fetch(`${BASE_URL}/bookmarks`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newBookmark),
  }).then(response => response.json())
  .then(data => {
    console.log('Success:', data);
    return data
  })
  .catch((error) => {
    console.error('Error:', error);
  });
  
}

function deleteBookmark(id) {
  return fetch(`${BASE_URL}/bookmarks/${id}`, {
    method: 'DELETE'
  });
}

export default {
  getBookmarks,
  createBookmark,
  deleteBookmark
};
