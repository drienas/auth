const jwt = require('jsonwebtoken');

if (!process.env.SECRET) {
  console.error(`No JWT secret variable set.`);
  process.exit(0);
}

const secret = process.env.SECRET;

const createToken = (username, exp = 24 * 60 * 60) =>
  jwt.sign(
    {
      username,
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
