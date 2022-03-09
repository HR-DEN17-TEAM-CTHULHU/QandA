const database = require('../Database');
const util = require('util');

const Query = {
  getQuestions: (req, res) => {
    let page = req.query.page || 0;
    let limit= req.query.limit || 5;
    let productID = req.query.product_id;
    let array = [page, limit, productID]
    database
      .query(`SELECT * FROM QUESTIONS WHERE PRODUCT_ID = $3 AND REPORTED = 0 ORDER BY (id) LIMIT $2 OFFSET $1`, array, (err, results) => {
        if (err) {
          console.log(err)
        }
        let returnObj = results.rows;
        returnObj.map((singleQuestion) => {
          singleQuestion.reported = false;
          singleQuestion.answers = {};
          database
              .query(`SELECT * FROM ANSWERS WHERE QUESTION_ID = ${singleQuestion.id}`, (err, results2) => {
                results2.rows.map(singleAnswer => {
                  singleAnswer.photos = [];
                  singleQuestion.answers[singleAnswer.id] = singleAnswer;
                  database
                    .query(`SELECT * FROM ANSWERS_PHOTOS WHERE ANSWER_ID = ${singleAnswer.id}`, (err, photoResults) => {
                      if (photoResults.rows) {
                        // console.log(photoResults, typeof photoResults)
                        photoResults.rows.map(singlePhoto => {
                          singleAnswer.photos.push(singlePhoto.url)
                        })
                      }
                    })
                })
              })

        })
        setTimeout(() => res.json(returnObj), 50)
        //res.json(returnObj);
      })
  },
    questionsIncreaseHelpful: (req, res) => {
    database
      .query(`UPDATE questions SET helpful = helpful + 1 WHERE id = ${req.params['0']}`)
      res.send()
  },
    answersIncreaseHelpful: (req, res) => {
      database
        .query(`UPDATE answers SET helpful = helpful + 1 WHERE id = ${req.params['0']}`)
        res.send()
    },
    questionsReport: (req, res) => {
      database
        .query(`UPDATE questions SET reported = reported + 1 WHERE id = ${req.params['0']}`)
        res.send()
    },
    answersReport: (req, res) => {
      database
        .query(`UPDATE answers SET reported = reported + 1 WHERE id = ${req.params['0']}`)
        res.send()
    },
    addQuestion: (req, res) => {
      let array = [req.body.body, req.body.name, req.body.email, req.body.product_id]
      database
        .query(`INSERT INTO questions (PRODUCT_ID, BODY, DATE_WRITTEN, ASKER_NAME, ASKER_EMAIL, REPORTED, HELPFUL)
        VALUES ($4, $1, '${util.inspect(new Date())}', $2, $3, 0, 0)`, array)
      res.send()
    },
    addAnswer: (req, res) => {
      let array1 = [req.params['0'], req.body.body, req.body.name, req.body.email, JSON.stringify(req.body.photos)]
      console.log(typeof req.body.photos)
      database
        .query(`WITH answer_insert AS (
          INSERT INTO answers (QUESTION_ID, BODY, DATE_WRITTEN, ANSWERER_NAME, ANSWERER_EMAIL, REPORTED, HELPFUL)
          VALUES ($1, $2, '${util.inspect(new Date())}', $3, $4, 0, 0)
          RETURNING id)
          INSERT INTO answers_photos(answer_id, url)
          (SELECT * FROM answer_insert t1 JOIN (SELECT * FROM json_array_elements_text($5)) AS ARR(url) ON 1=1)`, array1, (err, results) => {
            if (err) {
              console.log(err)
              res.send('borked')
            } else {
              res.send(results)
            }
          })
    },
    getAnswers: (req, res) => {
      let questionID = req.params['0']
      let page = req.query.page || 1
      let count = req.query.page || 5
      let array = [questionID, page, count]
      //console.log(questionID)
      database
        .query(`SELECT * FROM (SELECT * FROM answers WHERE question_id = $1 AND REPORTED = 0) AS t1
        LEFT JOIN answers_photos
        ON t1.id = answers_photos.answer_id
        ORDER BY (t1.id) LIMIT $3 OFFSET $2`, array, (err, results) => {
          if (err) {
            console.log(err)
            res.send('yikes')
          } else {
            res.send(results.rows)
          }
        })
    }
}

  module.exports = Query;



  // `SELECT ARRAY_AGG (answer_id) answers_photos`

  // WITH step_one AS (
  //   INSERT INTO foo(blah, wibble)
  //   VALUES($1, $2)
  //   RETURNING id
  // )
  // INSERT INTO other(foo_id, floogle)
  // SELECT id, $3 FROM step_one

  // SELECT * FROM json_array_elements_text('[]')