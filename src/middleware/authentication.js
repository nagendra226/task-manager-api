const jwt = require('jsonwebtoken');
const userModel = require('../models/user');

const authentication = async (req, res, next) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '');
    const decoded = jwt.verify(token, process.env.JWT_TOKEN);
    const user = await userModel.User.findOne({
      _id: decoded._id,
      'tokens.token': token,
    });

    if (!user) {
      throw new Error('User not exist');
    }
    req.token = token;
    req.user = user;
    next();
  } catch (err) {
    res.status(401).send(err);
  }
};

module.exports = { authentication };
