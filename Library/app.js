const express = require('express'); // To setup Express
const chalk = require('chalk'); // To setup chalk (used for coloring)
const debug = require('debug')('app'); // To setup debug() and avoid console.log()
const morgan = require('morgan'); // Log somethings to the console that have to do with our web traffic
const path = require('path'); // Built-in Module. Used for concatinating strings to form a valid path.
const sql = require('mssql');


const app = express();
const port = process.env.PORT || 3000;

const config = {
  user: 'library',
  password: 'Libr@ry1',
  server: 'ablibrary.database.windows.net', // You can use 'localhost\\instance' to connect to named instance
  database: 'PSLibrary',

  options: {
    encrypt: true // Use this if you're on Windows Azure
  }
};
sql.connect(config).catch(err => debug(err));

// Middleware
app.use(morgan('tiny')); // Logs info about the web traffic
// Configuring express to serve the static files
app.use(express.static(path.join(__dirname, '/public')));
// If you want to serve css or js files directly from node_modules
app.use('/css', express.static(path.join(__dirname, '/node_modules/bootstrap/dist/css')));
app.use('/js', express.static(path.join(__dirname, '/node_modules/bootstrap/dist/js')));
app.use('/js', express.static(path.join(__dirname, '/node_modules/bootstrap/js/dist')));
app.use('/js', express.static(path.join(__dirname, '/node_modules/jquery/dist')));
// Telling express where views are located
app.set('views', './src/views');
// Telling express to use pug for rendering our views
// app.set('view engine', 'pug');
app.set('view engine', 'ejs');


const nav = [
  { link: '/books', title: 'Books' },
  { link: '/authors', title: 'Authors' }
];
const bookRouter = require('./src/routes/bookRoutes')(nav);

app.use('/books', bookRouter);
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
