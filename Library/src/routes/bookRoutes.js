const express = require('express');

const bookRouter = express.Router();

const { MongoClient, ObjectID } = require('mongodb');

const debug = require('debug')('app:bookRoutes');

// nav is passed to avoid duplicating nav array in render function of all the registered routes
function router(nav) {
  bookRouter.use((req, res, next) => {
    if (req.user) {
      next();
    } else {
      res.redirect('/');
    }
  });
  bookRouter.route('/')
    .get((req, res) => {
      const url = 'mongodb://localhost:27017';
      const dbName = 'libraryApp';

      (async function mongo() {
        let client;
        try {
          client = await MongoClient.connect(url);
          debug(`Connected to the server ${client}`);

          const db = client.db(dbName);

          const col = await db.collection('books');

          const books = await col.find().toArray();
          res.render(
            'bookListView',
            {
              nav,
              title: 'Library',
              books
            } // Object is passed as a second argument [Hint: Refer to render() definations in docs]
          );
        } catch (error) {
          debug(error.stack);
        }
        client.close();
      }());
    });
  bookRouter.route('/:id')
    .get((req, res) => {
      const { id } = req.params;
      const url = 'mongodb://localhost:27017';
      const dbName = 'libraryApp';

      (async function mongo() {
        let client;
        try {
          client = await MongoClient.connect(url);
          debug(`Connected to the server ${client}`);

          const db = client.db(dbName);

          const col = await db.collection('books');

          const book = await col.findOne({ _id: new ObjectID(id) });
          res.render(
            'bookView',
            {
              nav,
              title: 'Library',
              book // we use 0 index as only one record is returned
            }
          );
        } catch (error) {
          debug(error.stack);
        }
        client.close();
      }());
    });
  return bookRouter;
}

module.exports = router;
