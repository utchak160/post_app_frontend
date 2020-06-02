const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

exports.createUser = (req, res, next) => {
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
            message: 'Invalid credentials'
          });
        });
    });
};

exports.userLogin = (req, res, next) => {
  let fetchedUser;
  User.findOne({email: req.body.email})
    .then((user) => {
      if (!user) {
        res.status(404).send({
          message: 'Please SignUp and then Login'
        });
      }
      fetchedUser = user;
      return bcrypt.compare(req.body.password, user.password)
    })
    .then((result) => {
      if (!result) {
        res.status(401).send({
          message: 'Email/Password is incorrect'
        });
      }
      const token = jwt.sign({email: fetchedUser.email, userId: fetchedUser._id }, process.env.SECRET_KEY, { expiresIn: '1h' });
      res.status(200).send({
        token: token,
        expiresIn: 3600,
        userId: fetchedUser._id
      });
    })
    .catch(err => {
      return res.status(401).send({
        message: 'Invalid Credentials'
      });
    });
};
