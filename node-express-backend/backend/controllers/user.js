
//require encyption package
const bcrypt = require("bcrypt");

//require json web token for storing authentication on frontend
const jwt = require("jsonwebtoken");

//require our user model
const User = require("../models/user");

//handle requests going to signup page (Create new user and store in database)
exports.createUser = (req, res, next) => {
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
            // error: err
            message: "Invalid authentication credentials!"
          });
        });
    });
}

//create anouter POST route for logins
exports.loginUser = (req, res, next) => {
  let fetchedUser;
  //check if the email exists
  User.findOne({ email: req.body.email })
    .then(user => {
      console.log(user);
      if (!user) {
        //return 401 authentication denied as no user was found
        return res.status(401).json({
          message: "Auth failed"
        });
      }
      //email found - compare password to one in database
      fetchedUser = user;
      return bcrypt.compare(req.body.password, user.password);
    })
    .then(result => {
      //check boolean result
      if (!result) { 
        return res.status(401).json({
          message: "Auth failed"
        });
      }
      //valid password - create token with json web token
      const token = jwt.sign(
        { email: fetchedUser.email, userId: fetchedUser._id }, 
        "secret_only_for_development",
        { expiresIn: "1h" } //allows me to configure token
      );
      //return our token
      res.status(200).json({
        token: token,
        message: "Authenticated!",
        expiresIn: 3600, //3600 seconds = 1 hr,
        userId: fetchedUser._id //already included in token, but this is better for performance
      });
    })
    .catch(err => {
      console.log(err);
      return res.status(401).json({
        message: "Invalid authentication credentials!"
      });
    });
};