const express = require("express");

//captial letter lets us know we can make an object from this onject
const Post = require('../models/post');

//create our express JS router object
const router = express.Router();

//get response of posts if entered
router.post("", (req, res, next) => {  

  //create our post with incoming post data
  // const post = req.body;
  const post = new Post({
    title:  req.body.title,
    content:  req.body.content,
  });

  //add the post to the database and return the ID
  post.save().then(createdPost => {
    console.log("ROUTES.POSTS POST: added post to database successfully");
    res.status(201).json({
      message: 'Post added successfully',
      postId: createdPost._id
    });
  }); //mongoose method add to

  console.log(post);  
});

//use a new middleware on the app to get posts when the user loads the homepage
router.get("", (req, res, next) => {

  //use the mongoose Post model to find all posts
  Post.find().then(documents => {
    console.log("ROUTES.POSTS GET: database results: " + documents);
    res.status(200).json({
      message: 'Post fetched successfully!',
      posts: documents
    });
  });  
});

//use a new route to update a post
//put will overwrite a post, patch will update parts of a post
router.put("/:id", (req, res, next) => {

  //create a new post
  const post = new Post({
    _id: req.body.id,
    title: req.body.title,
    content: req.body.content
  });

  //use Mongoose to update a resource via Post model
  Post.updateOne({_id: req.params.id}, post).then(result => {
    console.log("ROUTES.POSTS PUT: database record updated successfully: " + req.params.id);
    res.status(200).json({message: "Update succesful!"});
  });

});

//use a new route to get a single post from the api
router.get("/:id", (req, res, next) => {
  Post.findById(req.params.id).then(post => {
    if (post) {
      console.log("ROUTES.POSTS GET: database record found: " + req.params.id);
      res.status(200).json(post);
    } else {
      console.log("ROUTES.POSTS GET: database record not found:" + req.params.id);
      res.status(404).json({message: 'Post not found!'});
    }
  })
});

//add a new route to delete posts
router.delete("/:id", (req, res) => {
  // console.log(req.params.id);

  //use the mongoose Post model to delete the post ID found in the url
  Post.deleteOne({ _id: req.params.id }).then(result => {
    console.log("ROUTES.POSTS DELETE: database record deleted: " + req.params.id);
     res.status(200).json({message: 'Post deleted!'});
  });    
});

//export our router object with node JS
module.exports = router;