// managers/moviesManager.js
require('dotenv').config();
const axios = require('axios');

const fetchFromTMDb = async (endpoint) => {
    const apiBaseUrl = 'https://api.themoviedb.org/3'; // Assurez-vous que cette URL est correcte
    const token = process.env.TMDB_API_KEY;

    try {
        const response = await axios.get(`${apiBaseUrl}${endpoint}`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error(`Erreur lors de la requête vers ${endpoint} :`, error.message);
        throw error;
    }
};

const getTrendingMovies = async (req, res) => {
    try {
        const data = await fetchFromTMDb('/trending/movie/week');
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la récupération des films tendance.' });
    }
};

const getPopularMovies = async (req, res) => {
    try {
        const data = await fetchFromTMDb('/movie/popular');
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la récupération des films populaires.' });
    }
};

const getUpcomingMovies = async (req, res) => {
    try {
        const data = await fetchFromTMDb('/movie/upcoming');
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la récupération des films à venir.' });
    }
};

const searchMovie = async (req, res) => {
    const { query } = req.query;
    if (!query) {
        return res.status(400).json({ error: 'Le paramètre de requête "query" est requis.' });
    }
    try {
        const data = await fetchFromTMDb('/search/movie', { query });
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la recherche du film.' });
    }
};

const getMovieDetail = async (req, res) => {
    const { type, id } = req.params;
    try {
        const data = await fetchFromTMDb(`/${type}/${id}`);
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: `Erreur lors de la récupération des détails du ${type}.` });
    }
};

const getMovieCredits = async (req, res) => {
    const { type, id } = req.params;
    try {
        const data = await fetchFromTMDb(`/${type}/${id}/credits`);
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: `Erreur lors de la récupération des crédits du ${type}.` });
    }
};

const getMovieTrailers = async (req, res) => {
    const { type, id } = req.params;
    try {
        const data = await fetchFromTMDb(`/${type}/${id}/videos`);
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: `Erreur lors de la récupération des bandes-annonces du ${type}.` });
    }
};

const getMovieReviews = async (req, res) => {
    const { type, id } = req.params;
    try {
        const data = await fetchFromTMDb(`/${type}/${id}/reviews`);
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: `Erreur lors de la récupération des critiques du ${type}.` });
    }
};

const getMovieRecommendations = async (req, res) => {
    const { type, id } = req.params;
    try {
        const data = await fetchFromTMDb(`/${type}/${id}/recommendations`);
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: `Erreur lors de la récupération des recommandations du ${type}.` });
    }
};

module.exports = {
    getTrendingMovies,
    getPopularMovies,
    getUpcomingMovies,
    searchMovie,
    getMovieDetail,
    getMovieCredits,
    getMovieTrailers,
    getMovieReviews,
    getMovieRecommendations,
};
