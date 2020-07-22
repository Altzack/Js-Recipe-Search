"use strict";

const APP_KEY = "6407832403245de17c5a488b24112750";
const searchURL = "https://api.themoviedb.org/3/discover/movie";
let movieId = "";

// formatting query paramaters
function formatQueryParams(params) {
  const queryItems = Object.keys(params).map(
    key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`
  );
  return queryItems.join("&");
}

//Showing alt text on hover
$(".dot").hover(function() {
  let alt = $(this).attr("aria-label");
  $(this).text(alt);
});

$(".dot").mouseout(function() {
  $(this).text("\u00A0");
});

//page scroll
function pageScrollDown() {
  $("html, body").animate({ scrollTop: $("#results").offset().top }, 400);
}

function pageScrollUp() {
  $("html, body").animate({ scrollTop: $(".dd").offset().top }, 400);
}

function randomNumber(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Fetching the data and randomizing the page number
$(".dot").on("click", function() {
  const randomPage = randomNumber(1, 50);
  const genres = this.id;
  const params = {
    api_key: APP_KEY,
    with_genres: genres,
    page: randomPage
  };
  let moviePick = randomNumber(0, 19);

  const queryString = formatQueryParams(params);
  const url = searchURL + "?" + queryString;
  fetch(url)
    .then(response => response.json())
    .then(function(data) {
      displayResults(data, moviePick);
      getTrailer(data, moviePick);
      movieId = data.results[moviePick].id;
    })
    .catch(err => {
      alert("Something went wrong, try again!");
      console.log(err);
    });
  pageScrollDown();
});

// Randomizing the result data and displaying it
function displayResults(data, moviePick) {
  $("#results-list").empty();
  let imgVar = `https://image.tmdb.org/t/p/original${data.results[moviePick].backdrop_path}`;
  $("#results-list").append(`
    <div class="panel">
    <div class="heading">
    <h3 id="movieTitle" class="title">${data.results[moviePick].title}</h3>
    </div>
    <div class="heading">
    <img class="image" src="${imgVar}"/>
  </div>
  <div class="heading">
  <h3 class="description">${data.results[moviePick].overview}</h3>
</div>
    </div>`);
  if (data.results[moviePick].backdrop_path) {
    imgVar = `https://image.tmdb.org/t/p/original${data.results[moviePick].backdrop_path}`;
  } else {
    imgVar = "img/noimg.png";
    $("img").addClass("hidden");
  }
  $("#results").removeClass("hidden");
  pageScrollDown();
}

function displayResultsList(data) {
  $("#results-list").empty();
  let imgVar = `https://image.tmdb.org/t/p/original${data.backdrop_path}`;
  $("#results-list").append(`
    <div class="panel">
    <div class="heading">
    <h3 id="movieTitle" class="title">${data.title}</h3>
    </div>
    <div class="heading">
    <img class="image" src="${imgVar}"/>
  </div>
  <div class="heading">
  <h3 class="description">${data.overview}</h3>
</div>
    </div>`);
  if (data.backdrop_path) {
    imgVar = `https://image.tmdb.org/t/p/original${data.backdrop_path}`;
  } else {
    imgVar = "img/noimg.png";
    $("img").addClass("hidden");
  }
  $("#results").removeClass("hidden");
}
let movieArray = [];

// Adding movies to the watch list
$("#listButton").on("click", function() {
  let name = $("#movieTitle").text();
  if (!movieArray.includes(name)) {
    movieArray.push(name);
    $("#movieList").append(`
    <li class="newMovie"><span class="listSpan" id="${movieId}">${name}</span> <i class="fa fa-trash icon"></i></li>
    `);
  } else {
    alert("movie already in watch list!");
  }
  $("#checkBox").prop("checked", true);
  $(".dd-a").removeClass("hidden");
  displayli();
  rotate();
  pageScrollUp();
});

function displayli() {
  if (movieArray.length === 0) {
    $("#starterLi").show();
  } else {
    $("#starterLi").hide();
  }
}

// Removing movies from the watch list
$("#movieList").on("click", "i", function() {
  let movieText = $(this)
    .text()
    .trim();
  let movieIndex = movieArray.indexOf(movieText);
  movieArray.splice(movieIndex, 1);
  $(this)
    .closest(".newMovie")
    .remove();
  displayli();
});

function rotate() {
  if ($("#checkBox").prop("checked")) {
    $("#caret").addClass("toggleUp");
  } else {
    $("#caret").removeClass("toggleUp");
  }
}

// Clicking movies in the watch list loads the movie
$("#movieList").on("click", "span", function() {
  let listMovieId = this.id;
  let listUrl = `https://api.themoviedb.org/3/movie/${listMovieId}?api_key=${APP_KEY}&language=en-US`;
  fetch(listUrl)
    .then(response => response.json())
    .then(function(data) {
      displayResultsList(data);
      getTrailerList(listMovieId);
    })
    .catch(err => {
      alert("Something went wrong, try again!");
      console.log(err);
    });
  pageScrollDown();
});

// second api call
function getTrailer(data, moviePick) {
  const trailerUrl = `https://api.themoviedb.org/3/movie/${data.results[moviePick].id}/videos?api_key=${APP_KEY}&language=en-US`;
  fetch(trailerUrl)
    .then(response => response.json())
    .then(function(data) {
      $("#trailerButton")
        .off("click")
        .on("click", function() {
          if (data.results.length > 0) {
            let youtubeUrl = `https://www.youtube.com/watch?v=${data.results[0].key}`;
            window.open(youtubeUrl);
          } else {
            alert("sorry, no trailer found for this movie");
          }
        });
    });
}

function getTrailerList(movieId) {
  const trailerUrl = `https://api.themoviedb.org/3/movie/${movieId}/videos?api_key=${APP_KEY}&language=en-US`;
  fetch(trailerUrl)
    .then(response => response.json())
    .then(function(data) {
      $("#trailerButton")
        .off("click")
        .on("click", function() {
          if (data.results.length > 0) {
            let youtubeUrl = `https://www.youtube.com/watch?v=${data.results[0].key}`;
            window.open(youtubeUrl);
          } else {
            alert("sorry, no trailer found for this movie");
          }
        });
    });
}
