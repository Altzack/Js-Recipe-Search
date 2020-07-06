"use strict";

const APP_KEY = "6407832403245de17c5a488b24112750";
const searchURL = "https://api.themoviedb.org/3/discover/movie";

$(document).ready(function() {
  watchSubmitForm();
});

function watchSubmitForm() {
  $("#js-form").submit(e => {
    e.preventDefault();
    getMovie();
  });
}

function formatQueryParams(params) {
  const queryItems = Object.keys(params).map(
    key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`
  );
  return queryItems.join("&");
}

$(".dot").click(function() {
  const genres = this.id;
  const params = {
    api_key: APP_KEY,
    with_genres: genres
  };

  const queryString = formatQueryParams(params);
  const url = searchURL + "?" + queryString;
  fetch(url)
    .then(response => response.json())
    .then(function(data) {
      console.log(data);
      displayResults(data);
    })
    .catch(err => {
      console.log(err);
      alert("Something went wrong, try again!");
    });
});

function displayResults(data) {
  $("#results-list").empty();
  let moviePick = Math.floor(Math.random() * 20);
  let imgVar = `https://image.tmdb.org/t/p/original${data.results[moviePick].backdrop_path}`;
  if (data.results[moviePick].backdrop_path) {
    imgVar = `https://image.tmdb.org/t/p/original${data.results[moviePick].backdrop_path}`;
  } else {
    imgVar =
      "https://listonline.com.au/wp-content/uploads/2018/04/no_image_ava.png";
  }
  $("#results-list").append(`
    <div class="panel">
    <div class="heading">
      <h3 id="movieTitle" class="title">${data.results[moviePick].title}</h3>
    </div>
    <div class="heading">
    <img class="image" src="${imgVar}"    />
  </div>
  <div class="heading">
  <h3 class="description">${data.results[moviePick].overview}</h3>
</div>

    </div>`);
  $("#results").removeClass("hidden");
}
let movieArray = [];

$("#listButton").click(function() {
  let name = $("#movieTitle").text();
  if (!movieArray.includes(name)) {
    movieArray.push(name);
    console.log(movieArray);
    $("#movieList").append(`
    <li id="newMovie">${name}   <i onclick="remove()" id="icon" class="fa fa-trash"></i></li>
    `);
  }
});

function remove() {
  $("li").click(function(event) {
    let movieText = $(this).text();
    let movieIndex = movieArray.indexOf(movieText);
    movieArray.splice(movieIndex, 1);
    $(this).remove();
  });
}
