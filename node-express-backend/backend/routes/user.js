//require express JS
const express = require("express");

//get the controllers for this route
const UserController = require("../controllers/user.js")

//create our express JS router object
const router = express.Router();

//handle requests going to signup page (Create new user and store in database)
router.post("/signup", UserController.createUser);

//create anouter POST route for logins
router.post("/login", UserController.loginUser);

//export our routes
module.exports = router;