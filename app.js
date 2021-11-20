const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const auth = require('./middlewares/auth');

const PORT = 3000;
const app = express();

mongoose.connect('mongodb://localhost:27017/moviesbd', {
  useNewUrlParser: true,
});

const options = {
  origin: [
    'http://localhost:3000',
    'http://localhost:3001',
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

app.use(auth);
app.use('/users', require('./routes/users'));
app.use('/movies', require('./routes/movies'));

app.use((req, res, next) => {
  const error = new Error('Страница не найдена');
  error.statusCode = 404;

  return next(error);
});

app.use(errorLogger);

app.use((err, req, res, next) => {
  res.status(err.statusCode || 500).send({ message: err.message || 'Error 500' });
  next();
});

app.listen(PORT, () => {});
