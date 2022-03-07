const database = require('../Database');

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
    }
      )
}}

  module.exports = Query;

  // .catch(err => console.log(err.stack))
  // .then(results => {
  //   let returnObj = results.rows;
  //   returnObj.map((singleQuestion) => {
  //     singleQuestion.reported = false;
  //     database
  //       .query(`SELECT * FROM ANSWERS WHERE QUESTION_ID = ${singleQuestion.id}`)
  //       .then(results2 => {
  //         singleQuestion.answers = results2.rows;
  //         console.log(results2.rows)
  //         if (singleQuestion.id === returnObj[5].id) {
  //           res.json(returnObj)
  //         }
  //       })
  //   })

  // })