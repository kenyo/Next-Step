const { db } = require('../index')

const getAllAnswers = (req, res, next) => {
    db.any('SELECT a.*, u.username, r.likes FROM answers AS a FULL JOIN users AS u ON a.user_id = u.id FULL JOIN (SELECT answer_id, count(*) AS likes FROM likes GROUP BY answer_id) AS r ON a.id = r.answer_id')
    .then(answers => {
        res.status(200)
        .json({
            status: 'Success',
            answers,
            message: 'Received all answers'
        })
    })
    .catch(err => {
        console.log(err)
        res.json({
            status: 'Failed',
            message: err
        })
        return next(err)
    })
}

const getSingleAnswer = (req, res, next) => {
    let answerId = parseInt(req.params.id)
    db.one('SELECT a.*, u.username, r.likes FROM answers AS a FULL JOIN users AS u ON a.user_id = u.id FULL JOIN (SELECT answer_id, count(*) AS likes FROM likes GROUP BY answer_id) AS r ON a.id = r.answer_id WHERE a.id=$1', [answerId])
    .then(answer => {
        res.status(200)
        .json({
            status: 'Success',
            answer,
            message: `Received answer(${answerId})`
        })
    })
    .catch(err => {
        console.log(err)
        res.json({
            status: 'Failed',
            message: err
        })
        return next(err)
    })
}

const getAllQandAForOneUser = (req, res, next) => {
    let userId = parseInt(req.params.id);
    db.any('SELECT username, question_body, answer_body, likesCount FROM answers JOIN users ON answers.user_id = users.id JOIN questions ON answers.question_id = questions.id FULL JOIN (SELECT answer_id, count(*) AS likesCount FROM likes GROUP BY answer_id) AS l ON answers.id = l.answer_id WHERE users.id=$1', [userId])
    .then(answers => {
        res.status(200)
        .json({
            status: 'Success',
            answers: answers,
            message: 'Received all answers by one user'
        })
    })
    .catch(err => {
        console.log(err)
        res.json({
            status: 'Failed',
            message: err
        })
        return next(err)
    })
};

const getCountAnswersofOneUser = (req, res, next) => {
    let userId = parseInt(req.params.id);
    db.any('SELECT COUNT(id) FROM answers WHERE user_id=$1', [userId])
    .then(count => {
        res.status(200)
        .json({
            status: 'Success',
            count: count,
            message: 'Received all answers by one user'
        })
    })
    .catch(err => {
        console.log(err)
        res.json({
            status: 'Failed',
            message: err
        })
        return next(err)
    })
};

const addNewAnswer = (req, res, next) => {
  req.body.user_id = parseInt(req.body.user_id);
  req.body.question_id = parseInt(req.body.question_id);
  db.none(
  'INSERT INTO answers (user_id, question_id, answer_body) VALUES (${user_id}, ${question_id}, ${answer_body})',
  req.body)
    .then(() => {
      res.status(200).json({
        message: "added a new answer"
      });
    })
    .catch(err => {
      next(err);
    })
};

const editSingleAnswer = (req, res, next) => {

  db.none('UPDATE answers SET answer_body=${answer_body}, user_id=${user_id}, question_id=${question_id} WHERE id=${answerId}', {
    answerId: req.params.id,
    answer_body: req.body.answer_body,
    question_id: req.body.question_id,
    user_id: req.body.user_id
  })
  .then(() => {
    res.status(200)
    .json({
      status: "success",
      message: "edited one answer"
    });
  })
  .catch(err => {
    return next(err)
  })
};

const deleteSingleAnswer = (req, res, next) => {
  let answerId = parseInt(req.params.id);
  db.result('DELETE FROM answers WHERE id=$1', answerId)
  .then(result => {
    res.status(200)
    .json({
      status: "success",
      message: "deleted a single answer"
    });
  })
  .catch(err => {
    return next(err)
  })
};


const getAllAnswersWithTheQuestion = (req, res, next) => {
    db.any('SELECT questions.id AS Question_ID, question_body, answers.id AS answers_ID, answer_body, username AS by_user FROM QUESTIONS LEFT JOIN ANSWERS ON QUESTIONS.id = answers.question_id LEFT JOIN USERS ON ANSWERS.user_id = USERS.ID WHERE question_id = $1',req.params.id)
    .then(answers => {
        res.status(200)
        .json({
            status: 'Success',
            answers,
            message: 'Received one question and multiple answers'
        })
    })
    .catch(err => {
        console.log(err)
        res.json({
            status: 'Failed/ ERROR',
            message: err
        })
        return next(err)
    })
}

const getAnswerByQuestionByUser = (req, res, next) => {
    // console.log(req.query.questionID)
    // console.log(req.query.userID)
    db.oneOrNone('SELECT questions.id AS Question_ID, answers.id AS answers_ID, answer_body, users.id AS user_id, username AS by_user FROM QUESTIONS LEFT JOIN ANSWERS ON QUESTIONS.id = answers.question_id LEFT JOIN USERS ON ANSWERS.user_id = USERS.ID WHERE question_id = $1 AND users.id = $2',[req.query.questionID, req.query.userID])
    .then(answer => {
        res.status(200)
        .json({
            status: '200',
            answer,
            message: 'Got answer of user by the question '
        })
    })
    .catch(err => {
        console.log(err)
        res.json({
            status: '404',
            message: err
        })
        return next(err)
    })
}

const getAllAnswersWithQuestionsLikes = (req, res, next) => {
    let userId = parseInt(req.params.id)

    db.any('SELECT a.id, a.user_id, a.answer_body, u.username, qc.question_body, qc.category, l.count AS like_count FROM answers AS a FULL JOIN users AS u ON a.user_id = u.id FULL JOIN (SELECT q.id, q.question_body, c.category FROM questions AS q FULL JOIN categories AS c ON q.category_id = c.id) AS qc ON qc.id = a.question_id FULL JOIN (SELECT answer_id, COUNT(*) FROM likes GROUP BY answer_id) AS l ON a.id = l.answer_id WHERE a.user_id = $1 ORDER BY a.id', [userId])
    .then(answers => {
        res.status(200)
        .json({
            status: 'Success',
            answers,
            message: 'Received answers with pertaining questions and likes'
        })
    })
    .catch(err => {
        console.log(err)
        res.json({
            status: 'Failed',
            message: err
        })
        next(err)
    })
}

module.exports = {
    getAllAnswers,
    getSingleAnswer,
    getAllQandAForOneUser,
    getCountAnswersofOneUser,
    addNewAnswer,
    editSingleAnswer,
    deleteSingleAnswer,
    getAllAnswersWithTheQuestion,
    getAnswerByQuestionByUser,
    getAllAnswersWithQuestionsLikes
}
