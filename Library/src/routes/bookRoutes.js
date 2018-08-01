const express = require('express');

const bookRouter = express.Router();
const bookController = require('../controllers/bookController');

// nav is passed to avoid duplicating nav array in render function of all the registered routes
function router(nav) {
  // debug(bookController);

  const { getIndex, getById, middleware } = bookController(nav);

  bookRouter.use(middleware);

  bookRouter.route('/')
    .get(getIndex);

  bookRouter.route('/:id')
    .get(getById);
  return bookRouter;
}

module.exports = router;
