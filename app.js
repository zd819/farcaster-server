import createError from 'http-errors';
import express, { json, urlencoded, static as serveStatic } from 'express';
// const frameRoutes = require('./routes/frame'); // Your new route file
import loadFramesRouter from './routes/load-frames.js';
import cookieParser from 'cookie-parser';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

import cors from 'cors';
const app = express();

// view engine setup
app.set('views', join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(cors());
app.use(json({ limit: '25MB' }));

//app.use(bodyParser.urlencoded({ extended: false }));
// Use Express's built-in JSON parser middleware with a limit of 25MB
app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ extended: true, limit: '25mb' }));
app.use(cookieParser());
app.use(serveStatic(join(__dirname, 'public')));

// app.use('/frame', frameRoutes); // Mount your frame routes
app.use('/api', loadFramesRouter);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

app.options("/*", function(req, res, next){
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
  res.send(200);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  console.log('In Error Handler');
  console.log(err);
  console.log(req.body);
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});



export default app;