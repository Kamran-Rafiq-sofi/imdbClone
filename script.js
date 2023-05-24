// const BASE_URL = "https://www.omdbapi.com/";

// const searchInput = document.getElementById("searchInput");
// const searchResults = document.getElementById("searchResults");
// const favoritesList = document.getElementById("favoritesList");

// searchInput.addEventListener("input", handleSearch);
// favoritesList.addEventListener("click", removeFavorite);

// function handleSearch() {
//   const searchTerm = searchInput.value.trim();

//   if (searchTerm === "") {
//     searchResults.innerHTML = "";
//     return;
//   }

//   fetchMovies(searchTerm)
//     .then((data) => displaySearchResults(data))
//     .catch((error) => console.error(error));
// }

// function fetchMovies(searchTerm) {
//   const url = `${BASE_URL}?s=${searchTerm}`;

//   return fetch(url)
//     .then((response) => response.json())
//     .then((data) => {
//       if (data.Response === "True") {
//         return data.Search;
//       } else {
//         throw new Error(`Error: ${data.Error}`);
//       }
//     });
// }

// function displaySearchResults(results) {
//   searchResults.innerHTML = "";

//   results.forEach((result) => {
//     const movieCard = createMovieCard(result);
//     searchResults.appendChild(movieCard);
//   });
// }

// function createMovieCard(movie) {
//   const movieCard = document.createElement("div");
//   movieCard.className = "movie-card";

//   const movieTitle = document.createElement("h3");
//   movieTitle.textContent = movie.Title;

//   const moviePoster = document.createElement("img");
//   moviePoster.src = movie.Poster;
//   moviePoster.alt = movie.Title;

//   const favoriteButton = document.createElement("button");
//   favoriteButton.textContent = "Add to Favorites";
//   favoriteButton.addEventListener("click", () => addFavorite(movie));

//   movieCard.appendChild(movieTitle);
//   movieCard.appendChild(moviePoster);
//   movieCard.appendChild(favoriteButton);

//   return movieCard;
// }

// function addFavorite(movie) {
//   const favoriteItem = document.createElement("li");
//   favoriteItem.textContent = movie.Title;
//   favoritesList.appendChild(favoriteItem);
// }

// function removeFavorite(event) {
//   if (event.target.tagName === "LI") {
//     event.target.remove();
//   }
// }


// Titles: https://www.omdbapi.com/?s=thor&page=1&apikey=bfd6b563
// details: http://www.omdbapi.com/?i=tt3896198&apikey=bfd6b563
const movieSearchBox = document.getElementById('movie-search-box');
const searchList = document.getElementById('search-list');
const resultGrid = document.getElementById('result-grid');

// load movies from API
async function loadMovies(searchTerm){
    const URL = `https://www.omdbapi.com/?s=${searchTerm}&page=1&apikey=bfd6b563`;
    const res = await fetch(`${URL}`);
    const data = await res.json();
    // console.log(data.Search);
    if(data.Response == "True") displayMovieList(data.Search);
}

function findMovies(){
    let searchTerm = (movieSearchBox.value).trim();
    if(searchTerm.length > 0){
        searchList.classList.remove('hide-search-list');
        loadMovies(searchTerm);
    } else {
        searchList.classList.add('hide-search-list');
    }
}

function displayMovieList(movies){
    searchList.innerHTML = "";
    for(let idx = 0; idx < movies.length; idx++){
        let movieListItem = document.createElement('div');
        movieListItem.dataset.id = movies[idx].imdbID; // setting movie id in  data-id
        movieListItem.classList.add('search-list-item');
        if(movies[idx].Poster != "N/A")
            moviePoster = movies[idx].Poster;
        else 
            moviePoster = "imagenotfound.jpg";

        movieListItem.innerHTML = `
        <div class = "search-item-thumbnail">
            <img src = "${moviePoster}">
        </div>
        <div class = "search-item-info">
            <h3>${movies[idx].Title}</h3>
            <p>${movies[idx].Year}</p>
        </div>
        `;
        searchList.appendChild(movieListItem);
    }
    loadMovieDetails();
}

function loadMovieDetails(){
    const searchListMovies = searchList.querySelectorAll('.search-list-item');
    searchListMovies.forEach(movie => {
        movie.addEventListener('click', async () => {
            // console.log(movie.dataset.id);
            searchList.classList.add('hide-search-list');
            movieSearchBox.value = "";
            const result = await fetch(`https://www.omdbapi.com/?i=${movie.dataset.id}&apikey=bfd6b563`);
            const movieDetails = await result.json();
            // console.log(movieDetails);
            displayMovieDetails(movieDetails);
        });
    });
}

function displayMovieDetails(details){
    resultGrid.innerHTML = `
    <div class = "movie-poster">
        <img src = "${(details.Poster != "N/A") ? details.Poster : "image_not_found.png"}" alt = "movie poster">
    </div>
    <div class = "movie-info">
        <h3 class = "movie-title">${details.Title}</h3>
        <ul class = "movie-misc-info">
            <li class = "year">Year: ${details.Year}</li>
            <li class = "rated">Ratings: ${details.Rated}</li>
            <li class = "released">Released: ${details.Released}</li>
        </ul>
        <p class = "genre"><b>Genre:</b> ${details.Genre}</p>
        <p class = "writer"><b>Writer:</b> ${details.Writer}</p>
        <p class = "actors"><b>Actors: </b>${details.Actors}</p>
        <p class = "plot"><b>Plot:</b> ${details.Plot}</p>
        <p class = "language"><b>Language:</b> ${details.Language}</p>
        <p class = "awards"><b><i class = "fas fa-award"></i></b> ${details.Awards}</p>
    </div>
    `;
}


window.addEventListener('click', (event) => {
    if(event.target.className != "form-control"){
        searchList.classList.add('hide-search-list');
    }
});