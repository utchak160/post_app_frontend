const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
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

router.post('/login', (req, res, next) => {
  let fetchedUser;
  User.findOne({email: req.body.email})
    .then((user) => {
      if (!user) {
        res.status(404).send({
          message: 'User not found'
        });
      }
      fetchedUser = user;
       return bcrypt.compare(req.body.password, user.password)
    })
    .then((result) => {
      if (!result) {
        res.status(401).send({
          message: 'Auth Failed'
        });
      }
      const token = jwt.sign({email: fetchedUser.email, userId: fetchedUser._id }, 'hey_i_am_fine', { expiresIn: '1h' });
      res.status(200).send({
        token: token
      });
    })
    .catch(err => {
      return res.status(401).send({
        message: 'Auth Failed'
      });
    });
});

module.exports = router;
