const { db } = require('../index');

const authHelpers = require("../../auth/helper");

const getAllUsers = (req, res, next) => {
  db.any("SELECT * FROM users")
    .then(users => {
      res.status(200).json({
        status: "success!",
        users: users,
        message: "got all users!"
      });
    })
    .catch(err => {
      return next(err)
    });
};

const getSingleUser = (req, res, next) => {
  let userId = parseInt(req.params.id);
  db.one('SELECT * FROM users WHERE id=$1', [userId])
  .then(user => {
    res.status(200)
    .json({
      status: "success",
      user: user,
      message: "got one user"
    });
  })
  .catch(err => {
    return next(err)
  })
};

const getSearchUser = (req, res, next) => {
  let searchQuery = (req.params.id).toLowerCase();
  db.any(`SELECT  * FROM  users WHERE LOWER (username) LIKE '%${searchQuery}%'`)
  .then(users => {
    res.status(200)
    .json({
      status: 'Success',
      users,
      message: `Received users for search (${searchQuery})`
    })
  })
  .catch(err => {
    console.log(err)
    res.json({
      status: 'Failed',
      message: err
    })
  })
}


const deleteSingleUser = (req, res, next) => {
  let userId = parseInt(req.params.id);
  db.result('DELETE FROM users WHERE id=$1', userId)
  .then(result => {
    res.status(200)
    .json({
      status: "success",
      message: "deleted a single user"
    });
  })
  .catch(err => {
    return next(err)
  })
};

const editUser = (req, res, next) => {

  db.none('UPDATE users SET username=${username}, first_name=${first_name}, last_name=${last_name}, email=${email}, last_login=${last_login} WHERE id=${userId}', {
    userId: req.params.id,
    username: req.body.username,
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    last_login: req.body.last_login,
    email: req.body.email
  })
  .then(() => {
    res.status(200)
    .json({
      status: 'Success',
      message: 'Edited user'
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

const updateLoginTime = (req, res, next) => {
  let userId = parseInt(req.params.id)
  db.none('UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id=$1', [userId])
  .then(() => {
    res.status(200)
    .json({
      status: 'Success',
      message: 'Updated login time'
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

const createUser = (req, res, next) => {
  const hash = authHelpers.createHash(req.body.password);
  console.log(hash)
  db.none(
    "INSERT INTO users (username, first_name, last_name, email,  password_digest) VALUES (${username}, ${first_name}, ${last_name}, ${email}, ${password_digest})",
    { username: req.body.username, first_name: req.body.first_name, last_name: req.body.last_name, email: req.body.email, password_digest: hash }
  )
    .then(() => {
      res.status(200).json({
        message: "Registration successful."
      });
    })
    .catch(err => {
      next(err);
    });
}

const logoutUser = (req, res, next) => {
  console.log(req)
  req.logout();
  res.status(200).json({ message: "log out success" });
}

const loginUser = (req, res) => {
  console.log(req.username)
  res.json(req.user);
}

const isLoggedIn = (req, res) => {
  db.oneOrNone('SELECT * FROM USERS WHERE username=${params}',{
    params: req.user
  }).then((data)=>{
    console.log(data)
    if(data){
    res.json({
      username: data.username,
      userID: data.id
    })
  }
  else {
    res.json({
      username: null,
      userID: null
  })}
}
  )
  .catch(err =>{
    console.log(err)
  })
}



module.exports = {
  isLoggedIn,
  getAllUsers,
  getSingleUser,
  getSearchUser,
  deleteSingleUser,
  createUser,
  logoutUser,
  loginUser,
  editUser,
  updateLoginTime
};
