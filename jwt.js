const jwt = require('jsonwebtoken');

if (!process.env.SECRET) {
  console.error(`No JWT secret variable set.`);
  process.exit(0);
}

const secret = process.env.SECRET;

const createToken = (data, exp = 24 * 60 * 60) =>
  jwt.sign(
    {
      username: data.username,
      id: data._id ? data._id : null,
      fullName: data.fullName ? data.fullName : null,
    },
    secret
  );

const verifyToken = (token) => {
  let valid = false;
  let data = null;
  try {
    data = jwt.verify(token, secret);
    valid = true;
  } catch (err) {
    data = null;
    valid = false;
  } finally {
    return {
      valid,
      data,
    };
  }
};

module.exports = { createToken, verifyToken };
