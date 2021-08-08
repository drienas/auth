if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');

if (!process.env.MONGO_DB) {
  console.error(`No MongoDB variable set.`);
  process.exit(0);
}

const MONGO_DB = process.env.MONGO_DB;

const mongoUrl = `${MONGO_DB}/auth`;

const auth = require('./auth');
const {
  createUser,
  verifyUser,
  getAllUsers,
  getSingleUser,
  getSingleUserByName,
} = require('./User');
const { createToken, verifyToken } = require('./jwt');
const { getAllGroups } = require('./Group');

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.get('/', (req, res) => res.send('Hello World'));

app.post('/users', auth, (req, res) => {
  createUser(req.body)
    .then((resp) => {
      res.json(resp);
    })
    .catch((err) => {
      res.status(500).json(err);
    });
});

app.post('/login', (req, res) => {
  let body = req.body;
  let user = body.username;
  let tpw = body.password;
  verifyUser(user, tpw)
    .then(({ valid, data }) => {
      if (valid) {
        let token = null;
        let username = data.username;
        token = createToken(data);
        res.status(200).json({
          success: true,
          token,
        });
      } else {
        res.status(200).send({
          success: false,
          message: 'Fehlerhafte Login-Daten',
        });
      }
    })
    .catch((err) => res.json(err));
});

app.get('/validate/:token', (req, res) => {
  let token = req.params.token;
  res.json(verifyToken(token));
});

app.get('/users', auth, (req, res) => {
  getAllUsers()
    .then((data) => res.json(data))
    .catch((error) => res.status(500).json({ error }));
});

app.get('/user/:id', auth, (req, res) => {
  getSingleUser()
    .then((data) => res.json(data))
    .catch((error) => res.status(500).json({ error }));
});

app.get('/groupsbyn/:username', auth, (req, res) => {
  getSingleUserByName(req.params.username)
    .then((data) => res.json({ username: data.username, groups: data.groups }))
    .catch((error) => res.status(500).json({ error }));
});

app.get('/groups', auth, (req, res) => {
  getAllGroups()
    .then((data) => res.json(data))
    .catch((error) => res.status(500).json({ error }));
});

mongoose.connect(mongoUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});

mongoose.connection.on('error', (err) => {
  console.error(err);
  process.exit(0);
});

mongoose.connection.on('disconnected', (msg) => {
  console.error(msg);
  process.exit(0);
});

mongoose.connection.on('connected', async (err) => {
  console.log(`Connceted to MongoDB`);
  app.listen(3334, () => console.log(`App runnning on port 3334`));
});
