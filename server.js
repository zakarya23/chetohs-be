//////////////////////////////
// Author(s): Zakarya Butt, Nicholas
// Date Made: 07/09/2021
//////////////////////////////
const express = require("express")
const app = express()   
const cors = require('cors');

require('dotenv').config();

const port = process.env.PORT
const mongoose = require('mongoose');
const userRouter = require("../backend/routers/userRouter.js");
const User = require('./models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

app.use(cors());
app.use(express.json());

const uri = process.env.DB_URI;

mongoose.connect(uri, { useNewUrlParser: true, dbName: 'crm'}
);

const connection = mongoose.connection;

connection.once('open', () => {
  console.log("MongoDB database connection established successfully");
})

app.post('/register', async (req, res) => {
  const username = req.body.username;
  
  const existingUser = await User.findOne({ username: username });
  if (existingUser) {
    console.log("Username already in use.");
    return res.status(500).send({ error: 'Username already in use.'});
  }
		
  const newUser = await User.create({
    familyName: req.body.familyName,
    firstName: req.body.firstName,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync()),
    username: username,
  })
  console.log(newUser);
  res.json({status:true});
})

app.put('/edit', async (req, res) => {
  User.findOneAndUpdate({ username: req.body.username }, (req.body), (err, result) => {
    if (err) return res.json({ msg: "Could not update." });
    return res.json({status:true});
  })
})

app.put('/changePassword', async (req, res) => {
  const user = await User.findOne({ username: req.body.username });
  if(!user) {
    return res.json({ msg: `No account with this username found` });
  }
  const passwordMatch = bcrypt.compareSync(req.body.oldPw, user.password);
  if(!passwordMatch) {
    console.log("wrong password\n");
    return res.json({ msg: `Passwords did not match` });
  }
  if (user && passwordMatch) {
    if (req.body.newPw != req.body.confirmPw) return res.json({ msg: "Passwords don't match."})
    User.findOneAndUpdate({username: user.username}, {$set: { password: bcrypt.hashSync(req.body.newPw, bcrypt.genSaltSync())}})
    return res.json({status:true});
  }
})

app.post('/login', async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  const user = await User.findOne({ username: username });

  if(!user) {
    return res.json({ msg: `No account with this username found` });
  }
  const passwordMatch = bcrypt.compareSync(password, user.password);
  if(!passwordMatch) {
    console.log("wrong password\n");
    return res.json({ msg: `Passwords did not match` });
  }
  console.log(user);
  if (user && passwordMatch) {
    user.password = undefined;
    jwt.sign({ firstName:user.firstName, familyName:user.familyName, username:user.username, email:user.email}, process.env.SECRET_KEY, {expiresIn: '24h'}, (err, token) => {
      if (err) console.log(err)
      res.json({
        token:token
      })
    })
  }
})

app.use('/user', userRouter);

app.listen(port, () => {
    console.log('server is listening on port', port)
})

// Exports app for testing
module.exports = app