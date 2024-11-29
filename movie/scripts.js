// Check for saved dark mode preference or system preference
if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    document.documentElement.classList.add('dark');
}
// Listen for dark mode toggle
document.getElementById('darkModeToggle').addEventListener('click', function () {
    if (document.documentElement.classList.contains('dark')) {
        document.documentElement.classList.remove('dark');
        localStorage.theme = 'light';
    } else {
        document.documentElement.classList.add('dark');
        localStorage.theme = 'dark';
    }
});
 

//  Write your JavaScript code here

// Search Movies api intigration

const searchResult = document.querySelector("#searchResults");
const movieInfo = document.querySelector("#movieInfo");
const showMoreContainer = document.querySelector("#showMoreContainer");
const showMoreButton = document.querySelector("#showMoreButton");

let currentQuery = ""; // Store the current search query
let currentPage = 1; // Track the current page


// show details
const showMovieDetails = (imdbId) => {
    fetch(
        `http://www.omdbapi.com/?apikey=b1e2af0e&i=${imdbId}`
    )
        .then((response) => response.json())
        .then((data) => {

            const genreHtml = data.Genre.split(", ").map(
                (genre) => `<span class="px-3 py-1 rounded-full glass-effect text-sm">${genre}</span>`
            ).join("");

           const movieDetails = `
           <div class="glass-effect rounded-xl p-8 transform transition-all duration-500">
                <div class="grid md:grid-cols-3 gap-8">
                    <div class="md:col-span-1">
                        <!-- Poster Image -->
                        <img src="${data.Poster}"
                            alt="${data.Title}"
                            class="w-full rounded-xl shadow-2xl hover:scale-105 transition-transform duration-300">

                        <div class="mt-6 grid grid-cols-2 gap-4">
                            <!-- IMDB Rating -->
                            <div class="glass-effect rounded-lg p-4 text-center">
                                <div class="text-3xl font-bold text-blue-400">${data.imdbRating}</div>
                                <div class="text-sm text-gray-400">IMDb</div>
                            </div>

                            <!-- Metascore -->
                            <div class="glass-effect rounded-lg p-4 text-center">
                                <div class="text-3xl font-bold text-purple-400">${data.Metascore}</div>
                                <div class="text-sm text-gray-400">Metascore</div>
                            </div>
                        </div>
                    </div>
                    <div class="md:col-span-2">
                        <!-- Movie Title -->
                        <h2 class="text-4xl font-bold mb-4">${data.Title}
                            <!-- Movie Year -->
                            <span class="text-gray-400">(${data.Year})</span>
                        </h2>

                        <!-- Movie Genre -->
                        <div class="flex flex-wrap gap-2 mb-6">
                            ${genreHtml}
                        </div>

                        <!-- Movie Plot -->
                        <p class="text-lg mb-6 leading-relaxed text-gray-300">
                            ${data.Plot}
                        </p>
                        <div class="grid grid-cols-2 gap-6">
                            <!-- Movie Director -->
                            <div>
                                <h3 class="font-semibold text-blue-400 mb-2">Director</h3>
                                <p class="text-gray-300">${data.Director}</p>
                            </div>

                            <!-- Movie Cast -->
                            <div>
                                <h3 class="font-semibold text-blue-400 mb-2">Cast</h3>
                                <p class="text-gray-300">${data.Actors}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
           `

           movieInfo.innerHTML = movieDetails
           movieInfo.classList.remove("hidden")

           window.scrollTo({
            top: 0,
            behavior: "smooth"
           })
        })
};


 // search result 

 const searchMovie = (title, pageNo, year) => {
    fetch(`http://www.omdbapi.com/?apikey=b1e2af0e&s=${title}&page=${pageNo} &y=${year}`)
        .then((response) => response.json())
        .then((data) => {
            if (data.Response === "True") {
                // Append movies to the search results
                data.Search.forEach((movie) => {
                    const movieCard = `
                        <div class="movie-card glass-effect rounded-xl overflow-hidden cursor-pointer hover:shadow-xl"
                            onclick="showMovieDetails('${movie.imdbID}')">
                            <div class="aspect-[2/3] bg-gray-200 dark:bg-gray-800 relative overflow-hidden">
                                <img src="${movie.Poster}" alt="${movie.Title}"
                                    class="w-full h-full object-cover hover:scale-110 transition-transform duration-300">
                            </div>
                            <div class="p-4">
                                <h3 class="font-semibold text-gray-900 dark:text-white line-clamp-1">${movie.Title}</h3>
                                <p class="text-sm text-gray-600 dark:text-gray-400">${movie.Year}</p>
                            </div>
                        </div>`;
                    searchResult.innerHTML += movieCard;
                });

                // Calculate total pages and toggle "Show More" button visibility
                const totalPages = Math.ceil(data.totalResults / 10);
                if (pageNo < totalPages) {
                    showMoreContainer.classList.remove("hidden");
                } else {
                    showMoreContainer.classList.add("hidden");
                }
            } else {
                // Hide "Show More" if no results or error
                showMoreContainer.classList.add("hidden");
            }
        });
};



document.querySelector("#searchInput").addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        currentQuery = e.target.value.trim(); // Store the current query
        currentPage = 1; // Reset to the first page
        searchResult.innerHTML = ""; // Clear previous results
        searchMovie(currentQuery, currentPage); // Fetch the first page of results
        movieInfo.classList.add("hidden"); // Hide movie details
    }
});

// Event listener for the "Show More" button
showMoreButton.addEventListener("click", () => {
    currentPage++; // Increment the page number
    searchMovie(currentQuery, currentPage); // Fetch the next page of results
});



