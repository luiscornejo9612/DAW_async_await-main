const keys = {
    api_key: '2a6dc8bf03a63f7c1325e66e61de3c55',
    session_id: 'b67b962e27c4321834d3df137cdff3338c729421',
    account_id: '21215214'
}

let moviesResult = document.getElementById("moviesResult");
let total_pages = 0;
let current_page = 1;

async function setFav(id, favBool) {
    try {
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIyYTZkYzhiZjAzYTYzZjdjMTMyNWU2NmU2MWRlM2M1NSIsInN1YiI6IjY2MWQ0MTYzY2I2ZGI1MDE4NTBhMDc3NSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.A2VBAxOPhPdbSbgpUUF4u8OVgJ02_i6FHwPJ400abpI'
            },
            body: JSON.stringify({
                media_type: 'movie',
                media_id: id,
                favorite: favBool
            })
        };

        const response = await fetch(`https://api.themoviedb.org/3/account/${keys.account_id}/favorite?api_key=${keys.api_key}&session_id=${keys.session_id}`, options);
        if (!response.ok) {
            throw new Error('No se pudo marcar la película como favorita');
        }

        console.log(`ID ${id} marcado como ${favBool ? 'favorito' : 'no favorito'}`);
        await showFavs(); // Actualizar la lista de películas favoritas después de marcar/desmarcar una película
    } catch (error) {
        console.error('Error al marcar la película como favorita:', error);
    }
}


async function showFavs() {
    moviesResult.innerHTML = "";
    try {
        const favoriteMovies = await getFavoriteMovies(); // Obtiene las películas favoritas
        favoriteMovies.forEach(movie => printMovie(movie, true, false));
    } catch (error) {
        console.error("Error al obtener las películas favoritas:", error);
    }
}

async function getFavoriteMovies() {
    try {
        const response = await fetch(`https://api.themoviedb.org/3/account/${keys.account_id}/favorite/movies?api_key=${keys.api_key}&session_id=${keys.session_id}&language=es-ES&page=1`);
        if (!response.ok) {
            throw new Error('No se pudo obtener las películas favoritas');
        }
        
        const data = await response.json();
        return data.results;
    
    } catch (error) {
        console.error('Error al obtener las películas favoritas:', error);
        return []; 
    }
}

// Obtener el elemento de entrada de búsqueda
const searchInput = document.getElementById("search");

// Agregar un evento de escucha para el evento "input"
searchInput.addEventListener("input", function(event) {
    // Obtener el valor actual del campo de entrada de búsqueda
    const query = event.target.value.trim(); // Trim elimina los espacios en blanco al inicio y al final
    
    // Llamar a la función searchMovies con el término de búsqueda actual
    searchMovies(query);
});


async function searchMovies(query) {
    moviesResult.innerHTML = ""; // Limpia el contenido anterior de resultados de películas
    try {
        const searchResults = await getSearchResults(query); // Obtiene los resultados de búsqueda
        searchResults.forEach(movie => printMovie(movie, false, false)); // Imprime cada película en los resultados
    } catch (error) {
        console.error("Error al buscar películas:", error);
    }
}


async function getSearchResults(query) {
    try {
        const options = {
            method: 'GET',
            headers: {
                accept: 'application/json',
                Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIyYTZkYzhiZjAzYTYzZjdjMTMyNWU2NmU2MWRlM2M1NSIsInN1YiI6IjY2MWQ0MTYzY2I2ZGI1MDE4NTBhMDc3NSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.A2VBAxOPhPdbSbgpUUF4u8OVgJ02_i6FHwPJ400abpI'
            }
        };

        const response = await fetch(`https://api.themoviedb.org/3/search/movie?query=${query}&include_adult=false&language=en-US&page=1`, options);
        if (!response.ok) {
            throw new Error('No se pudo obtener los resultados de la búsqueda');
        }

        const data = await response.json();
        return data.results;
    } catch (error) {
        console.error('Error al obtener los resultados de la búsqueda:', error);
        return [];
    }
}


window.addEventListener('scroll', async () => {
    const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
    if (scrollTop + clientHeight >= scrollHeight - 5 && current_page < total_pages) {
        current_page++;
        const query = ""; // Aquí deberías mantener el valor de la última búsqueda
        const loadingGif = document.getElementById("loading");
        loadingGif.style.display = "block"; // Muestra el gif de carga
        await searchMovies(query); // Realiza la búsqueda de la siguiente página
        loadingGif.style.display = "none"; // Oculta el gif de carga
    }
});

// Resto del código...

function printMovie(movie, fav, watch) {
    let favIcon = fav ? 'iconActive' : 'iconNoActive';
    let watchIcon = watch ? 'iconActive' : 'iconNoActive';

    moviesResult.innerHTML += `<div class="movie">
                                    <img src="https://image.tmdb.org/t/p/original${movie.poster_path}">
                                    <h3>${movie.original_title}</h3>
                                    <div class="buttons">
                                        <a id="fav" onClick="setFav(${movie.id}, ${!fav})"><i class="fa-solid fa-heart ${favIcon}"></i></a>
                                        <a id="watch" onClick="setWatch(${movie.id}, ${!watch})"><i class="fa-solid fa-eye ${watchIcon}"></i></a>
                                    </div>`;
}
