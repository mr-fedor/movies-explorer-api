const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

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

app.listen(PORT, () => {});
