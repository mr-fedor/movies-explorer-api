const router = require('express').Router();
const validator = require('validator');
const { celebrate, Joi } = require('celebrate');

const {
  getMovies,
  addMovie,
  deleteMovie,
} = require('../controllers/movies');

router.get('/', getMovies);
router.post('/', celebrate({
  body: Joi.object().keys({
    country: Joi.string().min(2).required(),
    director: Joi.string().min(2).required(),
    duration: Joi.number().required(),
    year: Joi.number().precision(4).required(),
    description: Joi.string().required(),
    image: Joi.string().required().custom((value, helper) => {
      if (validator.isURL(value, { require_protocol: true })) {
        return value;
      }

      return helper.message('Введите валидный url, например: https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png');
    }),
    trailer: Joi.string().required().custom((value, helper) => {
      if (validator.isURL(value, { require_protocol: true })) {
        return value;
      }

      return helper.message('Введите валидный url, например: https://www.youtube.com/watch?v=_v4jZTPknI0');
    }),
    thumbnail: Joi.string().required().custom((value, helper) => {
      if (validator.isURL(value, { require_protocol: true })) {
        return value;
      }

      return helper.message('Введите валидный url, например: https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png');
    }),
    movieId: Joi.string().length(24).hex().required(),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
  }),
}), addMovie);
router.delete('/:movieId', celebrate({
  params: Joi.object().keys({
    movieId: Joi.string().length(24).hex().required(),
  }),
}), deleteMovie);

module.exports = router;
