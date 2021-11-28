const Movie = require('../models/movie');

module.exports.getMovies = (req, res, next) => {
  Movie.find({ owner: req.user._id })
    .then((movies) => res.send(movies))
    .catch(() => {
      const error = new Error('Error 500');
      error.statusCode = 500;

      return next(error);
    });
};

module.exports.addMovie = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
  } = req.body;

  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
    owner: req.user._id,
  })
    .then((movie) => res.status(200).send(movie))
    .catch((e) => {
      if (e.name === 'ValidationError') {
        const error = new Error('Переданы некорректные данные при сохранении фильма');
        error.statusCode = 400;

        return next(error);
      }

      const error = new Error('Error 500');
      error.statusCode = 500;

      return next(error);
    });
};

module.exports.deleteMovie = (req, res, next) => {
  Movie.findById(req.params.movieId)
    .then((movie) => {
      if (!movie) {
        const error = new Error('Фильм не найден.');
        error.statusCode = 404;

        return next(error);
      }

      if (!movie.owner.equals(req.user._id)) {
        const error = new Error('Не хватает прав.');
        error.statusCode = 403;

        return next(error);
      }

      return Movie.deleteOne(movie).then(() => res.status(200).send(movie));
    })
    .catch(() => {
      const error = new Error('Error 500');
      error.statusCode = 500;

      return next(error);
    });
};
