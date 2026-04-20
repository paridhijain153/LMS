const express = require('express');
const app = express();

const notFound = require('./middlewares/notFound.middleware');
const errorHandler = require('./middlewares/error.middleware');
app.use(express.json());

// All routes come from routes/index.js
const routes = require('./routes/index');
app.use('/api', routes);

app.use(notFound); // Handle 404 errors if no route matches
app.use(errorHandler); // Handle other errors if they occur

module.exports = app;