# ronnie-bookmarks-app
https://thinkful-ei-panda.github.io/ronnie-bookmarks-app/

-------------------------------------------------------
user stories
As a user:

I can add bookmarks to my bookmark list. Bookmarks contain:

title
url link
description
rating (1-5)
I can see a list of my bookmarks when I first open the app

All bookmarks in the list default to a "condensed" view showing only title and rating
I can click on a bookmark to display the "detailed" view

Detailed view expands to additionally display description and a "Visit Site" link
I can remove bookmarks from my bookmark list

I receive appropriate feedback when I cannot submit a bookmark

Check all validations in the API documentation (e.g. title and url field required)
I can select from a dropdown (a <select> element) a "minimum rating" to filter the list by all bookmarks rated at or above the chosen selection
----------------------------------------------------
function renderHome(){
//initial view when open page

//fetch get all bookmarks in store

//generate their template and insert in home page html

}

Function addNewBookmark(){
//on click of add button

//render add bookmark form in html

// add title

//add rating(select dropdown)

//add url

//add descritpion

//cancel and create buttons
}

function cancelBookmark(){
//on click of cancel

//render home page
}

Function toggleExpand(){
// on click of + button

//find id and match with corresponding one in store

//change removeclass'hidden' to see more details and change + to -

//on click of - button

//change addclass 'hidden'
}

Function deleteBookmark(){
//on click of delete

//find id corresponding to store

//fetch then delete to remove from store

// render new bookmark list
}

function createBookmark(){
//on click of create button

//get all values from form
//validate values to be correct or send corresponding errors to fix
//fetch post to store

//render new bookmark list
}

function filterBookmark(){
//on change of rating

//change minRating in store to what user clicks

//filter new array of bookmarks with corresponding rating and greater

//render the bookmark list
}
--------------------------------------------------------
wireframe idea layout
https://s3.amazonaws.com/assets.mockflow.com/app/wireframepro/company/C6f636151e081c3d949854edf15433804/projects/Mdbd27f72a87acddf71a316e9a39dbf4f1591889719498/pages/2f1d4b027ddf472cac1252b0aad91ce1/image/2f1d4b027ddf472cac1252b0aad91ce1.png
