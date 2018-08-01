const express = require('express');

const bookRouter = express.Router();
const bookController = require('../controllers/bookController');
const bookService = require('../services/goodreadsService'); // we've named bookService instead of goodreadsService cause when we change the API we'll have to make the edit to require statement


// nav is passed to avoid duplicating nav array in render function of all the registered routes
function router(nav) {
  // debug(bookController);

  // Passing nav and bookService to controller
  const { getIndex, getById, middleware } = bookController(bookService, nav); // Object Destructring

  bookRouter.use(middleware); // calling bookController middleware()

  bookRouter.route('/')
    .get(getIndex); // calling bookController getIndex()

  bookRouter.route('/:id')
    .get(getById); // calling bookController getById()

  return bookRouter;
}

module.exports = router;
