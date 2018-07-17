const passport = require('passport');
require('./strategies/local.strategy');

function passportConfig(app) {
  // Middleware [Hint: Refer to the docs on https://www.npmjs.com/package/passport]
  app.use(passport.initialize());
  app.use(passport.session());

  // Stores user in the session
  passport.serializeUser((user, done) => {
    done(null, user);
  });

  // Retrieves user from the session
  passport.deserializeUser((user, done) => {
    done(null, user);
  });

  // require('./strategies/local.strategy');
}

module.exports = passportConfig;
