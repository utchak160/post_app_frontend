const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const verified = jwt.verify(token, 'hey_i_am_fine');
    if (!verified) {
      return res.status(401).send({
        message: 'Auth Failed'
      });
    }
    next();
  } catch (e) {
    res.status(401).send({
      message: 'Auth Failed'
    });
  }
};
