const router = require('express').Router();
const auth = require('../middlewares/auth');

router.use('/api', require('./users'));
router.use('/api/movies', auth, require('./movies'));

router.use((req, res, next) => {
  const error = new Error('Страница не найдена');
  error.statusCode = 404;

  return next(error);
});

module.exports = router;
