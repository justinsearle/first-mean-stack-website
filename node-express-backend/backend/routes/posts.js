//require express JS
const express = require("express");

//get our controller for this route
const PostsController = require("../controllers/posts");

//require multer (for image upload as bodyParser will not work for files)
const multer = require('multer');

//include our middleware to authorize tokens with jwt
const checkAuth = require('../middleware/check-auth');
const extractFile = require('../middleware/file');

//create our express JS router object
const router = express.Router();

//create a post in the database
//use our own middle ware to validate token (protect route)
//multer will verify image type as a middleware
router.post(
  "",
  checkAuth,
  extractFile, 
  PostsController.createPost
);

//use a new middleware on the app to get posts when the user loads the homepage
router.get("", PostsController.getPosts);

//use a new route to get a single post from the api
router.get("/:id", PostsController.getPost);

//use a new route to update a post
//use our own middle ware to validate token (protect route)
//put will overwrite a post, patch will update parts of a post
router.put(
  "/:id", 
  checkAuth,
  extractFile, 
  PostsController.updatePost
);

//add a new route to delete posts
//use our own middle ware to validate token (protect route)
router.delete("/:id", checkAuth, PostsController.deletePost);

//export our router object with node JS
module.exports = router;