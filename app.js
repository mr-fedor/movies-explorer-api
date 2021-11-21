const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { celebrate, Joi, errors } = require('celebrate');

const { requestLogger, errorLogger } = require('./middlewares/logger');
const auth = require('./middlewares/auth');

const {
  login,
  createUser,
} = require('./controllers/users');

const PORT = 3000;
const app = express();

mongoose.connect('mongodb://localhost:27017/moviesbd', {
  useNewUrlParser: true,
});

const options = {
  origin: [
    'http://localhost:3000',
    'http://localhost:3001',
    'http://blinov-api.nomoredomains.work',
    'https://blinov-api.nomoredomains.work',
  ],
  methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
  preflightContinue: false,
  optionsSuccessStatus: 204,
  allowedHeaders: ['Content-Type', 'origin', 'Authorization'],
  credentials: true,
};

app.use('*', cors(options));
app.use(express.json());
app.use(requestLogger);

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
  }),
}), login);
app.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
    name: Joi.string().min(2).max(30),
  }),
}), createUser);

app.use(auth);
app.use('/users', require('./routes/users'));
app.use('/movies', require('./routes/movies'));

app.use((req, res, next) => {
  const error = new Error('Страница не найдена');
  error.statusCode = 404;

  return next(error);
});

app.use(errorLogger);
app.use(errors()); // celebrate

app.use((err, req, res, next) => {
  res.status(err.statusCode || 500).send({ message: err.message || 'Error 500' });
  next();
});

app.listen(PORT, () => {});
