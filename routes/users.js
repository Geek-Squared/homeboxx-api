const express = require('express');
const router = express.Router();
const User = require('../models/UserModel.js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Invitation = require("../models/InvitationModel");

// Register a new user
router.post('/register', function(req, res) {
  // Check if a user with the same username or email already exists
  User.countDocuments({ $or: [{ username: req.body.username }, { email: req.body.email }] })
    .then(count => {
      if (count > 0) {
        return res.status(400).send('A user with this username or email already exists.');
      }

      const newUser = new User({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
      });

      newUser.save()
        .then(() => {
          const token = jwt.sign({ id: newUser._id }, 'your-secret-key', {
            expiresIn: 86400 // expires in 24 hours
          });

          res.status(200).send({ auth: true, token: token });
        })
        .catch(err => {
          console.error(err); // Log the error message
          return res.status(500).send('Error on the server.');
        });
    })
    .catch(err => {
      console.error(err); // Log the error message
      return res.status(500).send('Error on the server.');
    });
});

// Login a user
router.post('/login', function(req, res) {
  User.findOne({ email: req.body.email })
    .then(user => {
      if (!user) return res.status(404).send('No user found.');
      
      var passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
      if (!passwordIsValid) return res.status(401).send({ auth: false, token: null });
      
      var token = jwt.sign({ id: user._id }, 'your-secret-key', {
        expiresIn: 86400 // expires in 24 hours
      });

      // Include user's ID in the response
      res.status(200).send({ auth: true, token: token, userId: user._id });
    })
    .catch(err => {
      console.error(err);
      return res.status(500).send('Error on the server.');
    });
});

// Get all users
router.get('/', function(req, res) {
  User.find({})
    .then(users => {
      res.status(200).send(users);
    })
    .catch(err => {
      return res.status(500).send('Error on the server.');
    });
});

// Get user by id
router.get('/:id', function(req, res) {
  User.findById(req.params.id)
    .then(user => {
      if (!user) return res.status(404).send('No user found.');
      res.status(200).send(user);
    })
    .catch(err => {
      return res.status(500).send('Error on the server.');
    });
});

module.exports = router;