const express = require('express'); // To setup Express
const chalk = require('chalk'); // To setup chalk (used for coloring)
const debug = require('debug')('app'); // To setup debug() and avoid console.log()
const morgan = require('morgan'); // Log somethings to the console that have to do with our web traffic. Helpful in debugging
const path = require('path'); // Built-in Module. Used for concatinating strings to form a valid path.
const bodyParser = require('body-parser');
const passport = require('passport');
const cookieParser = require('cookie-parser');
const session = require('express-session');

const app = express();
const port = process.env.PORT || 3000;


// Middleware
app.use(morgan('tiny')); // Logs info about the web traffic
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({ secret: 'library' })); // session takes a secret. secret is used when session builds the cookie
require('./src/config/passport')(app); // we've passed app to passport.js file

app.use((req, res, next) => {
  debug('my middleware');
  next();
});

// Configuring express to serve the static files
app.use(express.static(path.join(__dirname, '/public')));
// If you want to serve css or js files directly from node_modules
app.use('/css', express.static(path.join(__dirname, '/node_modules/bootstrap/dist/css')));
app.use('/js', express.static(path.join(__dirname, '/node_modules/bootstrap/dist/js')));
app.use('/js', express.static(path.join(__dirname, '/node_modules/bootstrap/js/dist')));
app.use('/js', express.static(path.join(__dirname, '/node_modules/jquery/dist')));


// Telling express where views are located
app.set('views', './src/views');
// Telling express to use pug/ejs for rendering our views
// app.set('view engine', 'pug');
app.set('view engine', 'ejs');


const nav = [
  { link: '/books', title: 'Books' },
  { link: '/authors', title: 'Authors' }
];
const bookRouter = require('./src/routes/bookRoutes')(nav);
const adminRouter = require('./src/routes/adminRoutes')(nav);
const authRouter = require('./src/routes/authRoutes')(nav);


app.use('/books', bookRouter);
app.use('/admin', adminRouter);
app.use('/auth', authRouter);
app.get('/', (req, res) => {
  // res.send('Hello from the App');
  // res.sendFile(path.join(__dirname, 'views', 'index.html')); // Sending HTML file to the server
  // res.render('index');
  res.render(
    'index',
    {
      nav: [
        { link: '/books', title: 'Books' },
        { link: '/authors', title: 'Authors' }
      ],
      title: 'Library'
    }
  );
});

app.listen(port, () => {
  // this will not work in VS code integrated powershell
  debug(`Running server at ${chalk.green(port)}`); // using template string
});
