const express = require('express');
const { MongoClient } = require('mongodb');
const debug = require('debug')('app:authRoutes');
const passport = require('passport');

const authRouter = express.Router();
function router(nav) {
  authRouter.route('/signUp')
    .post((req, res) => {
      debug(req.body);
      // create user
      const { username, password } = req.body;
      const url = 'mongodb://localhost:27017';
      const dbName = 'libraryApp';

      (async function addUser() {
        let client;
        try {
          client = await MongoClient.connect(url);
          debug(`Connected to the server ${client}`);

          const db = client.db(dbName);
          const col = await db.collection('users'); // we're using users collection without creating MongoDB feature
          const user = { username, password };
          const results = await col.insertOne(user);
          debug(results);
          // login user, req.login is available due to passport intiailization
          req.login(results.ops[0], () => {
            res.redirect('/auth/profile');
          });
        } catch (error) {
          debug(error.stack);
        }
        client.close();
      }());
    });

  authRouter.route('/signin')
    .get((req, res) => {
      res.render('signin',
        {
          nav,
          title: 'Sign In'
        });
    })
    .post(passport.authenticate('local', {
      successRedirect: '/auth/profile',
      failureRedirect: '/'
    }));

  authRouter.route('/profile')
    // protecting /profile route from unauthorized users.
    .all((req, res, next) => {
      if (req.user) {
        next();
      } else {
        res.redirect('/');
      }
    })
    .get((req, res) => {
      // req.user is provided by done() of passport.js
      // passport.js gets it from done() of local.strategy.js
      res.json(req.user);
    });
  return authRouter;
}

module.exports = router;
