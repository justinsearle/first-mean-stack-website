//require express JS
const express = require("express");

//require encyption package
const bcrypt = require("bcrypt");

//require our user model
const User = require("../models/user");

//create our express JS router object
const router = express.Router();

//handle requests going to signup page (Create new user and store in database)
router.post("/signup", (req, res, next) => {
  bcrypt.hash(req.body.password, 10)
    .then(hash => {
      //create our password with the hashed password
      const user = new User({
        email: req.body.email,
        password: hash
      });
      //save the user to the database
      user.save()
        .then(result => {
          res.status(201).json({
            message: 'User created!',
            result: result
          });
        })
        .catch(err => {
          res.status(500).json({
            error: err
          });
        });
    });  
});

//export our routes
module.exports = router;