import express from "express";
import MoviesController from "./movies.controller.js";
import ReviewsController from './reviews.controller.js';
import MoviesDAO from '../dao/moviesDAO.js'

const router = express.Router(); // get access to express router
router.route("/").get(MoviesController.apiGetMovies);
router.route("/id/:id").get(MoviesController.apiGetMovieById)
router.route("/ratings").get(MoviesController.apiGetRatings)
router 
.route("/review")  
.post(ReviewsController.apiPostReview) 
.put(ReviewsController.apiUpdateReview) 
.delete(ReviewsController.apiDeleteReview);
router.route("/id/:id").get(MoviesController.apiGetMovieById); 
router.route("/ratings").get(MoviesController.apiGetRatings);
export default router;
