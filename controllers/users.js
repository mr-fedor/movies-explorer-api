const { NODE_ENV, JWT_SECRET } = process.env;
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

module.exports.getProfile = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        const error = new Error('Пользователь не найден.');
        error.statusCode = 404;

        return next(error);
      }

      return res.status(200).send({
        name: user.name, email: user.email, _id: user._id,
      });
    })
    .catch(() => {
      const error = new Error('Error 500');
      error.statusCode = 500;

      return next(error);
    });
};

module.exports.updateProfile = (req, res, next) => {
  const { name, email } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { name, email },
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (!user) {
        const error = new Error('Пользователь не найден.');
        error.statusCode = 404;

        return next(error);
      }

      return res.status(200).send({
        name: user.name, email: user.email, _id: user._id,
      });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        const error = new Error('Переданы некорректные данные при обновлении профиля.');
        error.statusCode = 4;

        return next(error);
      }

      const error = new Error('Error 500');
      error.statusCode = 500;

      return next(error);
    });
};

module.exports.createUser = (req, res, next) => {
  const {
    email, password, name,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      email, password: hash, name,
    }))
    .then((user) => res.status(200).send({
      email: user.email, name: user.name, _id: user._id,
    }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        const error = new Error('Переданы некорректные данные при создании пользователя.');
        error.statusCode = 400;

        return next(error);
      }

      if (err.code === 11000) {
        const error = new Error('Передан e-mail уже существующий в базе');
        error.statusCode = 409;

        return next(error);
      }

      const error = new Error('Error 500');
      error.statusCode = 500;

      return next(error);
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  let userId;

  User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        const error = new Error('Неправильные почта или пароль');
        error.statusCode = 401;

        return next(error);
      }

      userId = user._id;

      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            const error = new Error('Неправильные почта или пароль');
            error.statusCode = 401;

            return next(error);
          }

          const token = jwt.sign(
            { _id: userId },
            NODE_ENV === 'production' ? JWT_SECRET : 'some-secret-key',
            { expiresIn: '7d' },
          );

          return res.send({ token });
        });
    })
    .catch(() => {
      const error = new Error('Error 500');
      error.statusCode = 500;

      return next(error);
    });
};
