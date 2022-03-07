const path = require('path');
const axios = require('axios');
const express = require('express');
const { API_KEY, API_ROUTE } = require('./config.js');
const { getQuestions } = require('./Controllers');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use(express.static(path.join(__dirname, '..', '..', 'dist')));

//API Proxy
app.get('/qa/questions', getQuestions)

//Server
app.listen(4000, () => {
  console.log('Express server is listening on 4000');
});
