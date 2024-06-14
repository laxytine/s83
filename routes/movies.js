const express = require("express");
const moviesController = require("../controllers/movies");

const {verify, verifyAdmin} = require("../auth");

const router = express.Router();

router.post("/addMovie", verify, verifyAdmin, moviesController.addMovie);
router.get("/getAllMovies", moviesController.getAllMovies);
router.get("/getMovie/:id", moviesController.getMovieById);
router.patch("/updateMovie/:id", verify, verifyAdmin, moviesController.updateMovie);
router.delete("/deleteMovie/:id", verify, verifyAdmin, moviesController.deleteMovie);
router.patch("/addComment/:id", verify, moviesController.addMovieComment);
router.get("/getComments/:id", verify, moviesController.getMovieComments);


module.exports = router;
