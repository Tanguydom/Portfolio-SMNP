// moviesRoutes.js
const express = require('express');
const router = express.Router();
const movieManager = require('../managers/moviesManager');

// Définition des routes et association aux méthodes du contrôleur
router.get('/trending/movie/week', movieManager.getTrendingMovies);
router.get('/movie/popular', movieManager.getPopularMovies);
router.get('/movie/upcoming', movieManager.getUpcomingMovies);
router.get('/search', movieManager.searchMovie);
router.get('/:type/:id', movieManager.getMovieDetail);
router.get('/:type/:id/credits', movieManager.getMovieCredits);
router.get('/:type/:id/trailers', movieManager.getMovieTrailers);
router.get('/:type/:id/reviews', movieManager.getMovieReviews);
router.get('/:type/:id/recommendations', movieManager.getMovieRecommendations);

module.exports = router;
