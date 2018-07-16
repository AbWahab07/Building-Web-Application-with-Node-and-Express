const express = require('express');

const bookRouter = express.Router();

const sql = require('mssql');

// const debug = require('debug')('app:bookRoutes');

// nav is passed to avoid duplicating nav array in render function of all the registered routes
function router(nav) {
  bookRouter.route('/')
    .get((req, res) => {
      // used async/await instead of promises
      (async function query() {
        const request = new sql.Request();
        const { recordset } = await request.query('select * from books'); // Destructuring
        // debug(result);
        res.render(
          'bookListView',
          {
            nav,
            title: 'Library',
            books: recordset
          } // Object is passed as a second argument [Hint: Refer to render() definations in docs]
        );
      }());
    });
  bookRouter.route('/:id')
    .all((req, res, next) => {
      (async function query() {
        const { id } = req.params; // Destructuring
        const request = new sql.Request();
        const { recordset } = await request
          .input('id', sql.Int, id)
          .query('select * from books where id = @id');
        // req.record = recordset[0];
        [req.record] = recordset; // Array destructuring. It means the same as above line of code req.record = recordset[0];
        next();
      }());
    })

    .get((req, res) => {
      res.render(
        'bookView',
        {
          nav,
          title: 'Library',
          book: req.record // we use 0 index as only one record is returned
        }
      );
    });
  return bookRouter;
}

module.exports = router;
