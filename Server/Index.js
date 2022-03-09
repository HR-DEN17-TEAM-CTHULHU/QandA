const path = require('path');
const axios = require('axios');
const express = require('express');
const { API_KEY, API_ROUTE } = require('./config.js');
const { getQuestions, questionsIncreaseHelpful, answersIncreaseHelpful, questionsReport, answersReport, addQuestion, addAnswer, getAnswers } = require('./Controllers');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use(express.static(path.join(__dirname, '..', '..', 'dist')));

//API Proxy
app.get('/qa/questions', getQuestions)
app.put('/qa/questions/*/helpful', questionsIncreaseHelpful)
app.put('/qa/answers/*/helpful', answersIncreaseHelpful)
app.put('/qa/questions/*/report', questionsReport)
app.put('/qa/answers/*/report', answersReport)
app.post('/qa/questions', addQuestion)
app.post('/qa/questions/*/answers', addAnswer)
app.get('/qa/questions/*/answers', getAnswers)

//Server
app.listen(4000, () => {
  console.log('Express server is listening on 4000');
});
