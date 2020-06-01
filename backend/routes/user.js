const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/user');

const router = express.Router();

router.post('/signup', (req, res, next) => {
  bcrypt.hash(req.body.password, 10)
    .then((hash) => {
      const user = new User({
        email: req.body.email,
        password: hash
      });
      user.save().then((result) => {
        res.status(201).send({
          message: 'User Created',
          user: result
        });
      })
        .catch(error => {
          res.status(500).send({
            error: error
          });
        });
    });
});



module.exports = router;
