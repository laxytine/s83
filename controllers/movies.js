const Movie = require("../models/Movie");
const { errorHandler } = require('../auth.js');


// [SECTION] Add Movie (Admin)
module.exports.addMovie = (req, res) => {
    const { title, director, year, description, genre } = req.body;

    if (!title || !director || !year || !description || !genre) {
        return res.status(400).send({ message: 'All fields are required' });
    }

    Movie.findOne({ title })
        .then(existingMovie => {
            if (existingMovie) {
                return res.status(400).send({ message: 'Movie with the same title already exists' });
            }

            const newMovie = new Movie({
                title,
                director,
                year,
                description,
                genre
            });

            return newMovie.save();
        })
        .then(savedMovie => {
            res.status(201).send(savedMovie);
        })
        .catch(error => {
            console.error("Error in saving the movie: ", error);
            res.status(500).send({ error: 'Failed to save the movie' });
        });
};



// [SECTION] Get All Movies
module.exports.getAllMovies = (req, res) => {
	Movie.find({})
    .then(movies => {

        if (movies.length > 0){
            return res.status(200).send({ movies });
        }
        else {

            return res.status(404).send({ message: 'No movie found.' })
        }

    }).catch(err => res.status(500).send({ error: 'Error finding movies.' }));
};


// [SECTION] Get Single Movie
module.exports.getMovieById = (req, res) => {
    Movie.findById(req.params.id)
    .then(foundMovie => {
        if (!foundMovie) {
            return res.status(404).send({ error: 'Movie not found' });
        }
        return res.status(200).send( foundMovie );
    })
    .catch(err => {
        console.error("Error in fetching the movie: ", err)
        return res.status(500).send({ error: 'Failed to fetch Movie' });
    });
};

// [SECTION] Update Movie (Admin)
module.exports.updateMovie = async (req, res) => {
    try {
        const userId = req.user.id;
        const movieId = req.params.id;
        
        const movie = await Movie.findById(movieId);
        if (!movie) {
            return res.status(404).send({ error: 'Movie not found' });
        }

        const movieUpdates = {
            title: req.body.title,
            director: req.body.director,
            year: req.body.year,
            description: req.body.description,
            genre: req.body.genre
        };

        if (
            movie.title === movieUpdates.title &&
            movie.director === movieUpdates.director &&
            movie.year === movieUpdates.year &&
            movie.description === movieUpdates.description &&
            movie.genre === movieUpdates.genre
        ) {
            return res.status(400).send({ message: 'No updates provided' });
        }

        const updatedMovie = await Movie.findByIdAndUpdate(movieId, movieUpdates, { new: true });

        return res.status(200).send({ 
            message: 'Movie updated successfully', 
            updatedMovie 
        });
    } catch (error) {
        console.error("Error in updating a movie:", error);
        return res.status(500).send({ error: 'Error in updating a movie.' });
    }
};


// [SECTION] Delete Movie (Admin)
module.exports.deleteMovie = (req, res) => {
	return Movie.deleteOne({ _id: req.params.id})
    .then(deletedMovie => {

        if (!deletedMovie) {
            return res.status(400).send({ error: 'No movie deleted' });
        }

        return res.status(200).send({ 
        	message: 'Movie deleted successfully'
        });

    })
    .catch(err => {
		console.error("Error in deleting a movie : ", err)
		return res.status(500).send({ error: 'Error in deleting a movie.' });
	});
    
};


// [SECTION] Add Movie Comment
module.exports.addMovieComment = async (req, res) => {
    try {
        const movieId = req.params.id;
        const userId = req.user.id;
        const { comment } = req.body;

        if (!comment) {
            return res.status(400).send({ error: 'Comment is required' });
        }

        const updatedMovie = await Movie.findById(movieId);
        if (!movieId) {
            return res.status(404).send({ error: 'Movie not found' });
        }

        updatedMovie.comments.push({ userId, comment });
        await updatedMovie.save();

        return res.status(201).send({ message: 'Comment added successfully', updatedMovie });
    } catch (error) {
        console.error("Error in adding a comment: ", error);
        return res.status(500).send({ error: 'Failed to add comment' });
    }
};


// [SECTION] Get Movie Comments
module.exports.getMovieComments = async (req, res) => {
	try {
        const movieId = req.params.id;

        const movie = await Movie.findById(movieId);
        if (!movie) {
            return res.status(404).send({ error: 'Movie not found' });
        }

        return res.status(200).send({ comments: movie.comments });
    } catch (error) {
        console.error("Error in fetching comments: ", error);
        return res.status(500).send({ error: 'Failed to fetch comments' });
    }
};