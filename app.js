const { NODE_ENV, DB } = process.env;
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { errors } = require('celebrate');

const { requestLogger, errorLogger } = require('./middlewares/logger');

const PORT = 3000;
const app = express();

mongoose.connect(NODE_ENV === 'production' ? DB : 'mongodb://localhost:27017/moviesdb', {
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

app.use('/', require('./routes'));

app.use(errorLogger);
app.use(errors()); // celebrate

app.use((err, req, res, next) => {
  res.status(err.statusCode || 500).send({ message: err.message || 'Error 500' });
  next();
});

app.listen(PORT, () => {});
