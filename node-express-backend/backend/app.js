//include express JS in our app
const express = require('express');

//include body parser package
const bodyParser = require('body-parser');

//include mongoose
const mongoose = require('mongoose');

//captial letter lets us know we can make an object from something for this
const Post = require('./models/post');

//add a route for home
const app = express();

//connect to the database
// mongoose.connect("mongodb://[username:password@]host1[:port1][,...hostN[:portN]][/[defaultauthdb][?options]]");
mongoose.set('useNewUrlParser', true);
// mongoose.set('useFindAndModify', false);
// mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);
mongoose.connect("mongodb://localhost:27017/first-mean")
  .then(() => {
    console.log("Connected to database.");
  })
  .catch(() => {
     console.log("Connection failed.");
  });

// This is left here from when I was learning
// //use a new middleware on the app
// app.use((req, res, next) => {
//     console.log("first middleware");    
//     console.log(req.method, req.path)
//     res.send('Hello from express');
//     next();
// });

//set up middle ware for parsing incoming requests and adding to the response as a property
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false })); //only support default url encoding

//set app headers
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    // res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
    // res.setHeader("Access-Control-Allow-Origin", "http://localhost:4200");
    res.setHeader(
      "Access-Control-Allow-Methods", 
      "GET, POST, PATCH, PUT, DELETE, OPTIONS"
    );
    res.setHeader(
        "Access-Control-Allow-Headers", 
        "Origin, X-Requested-With, Content-Type, Accept"
    );
    if (req.method === "OPTIONS") {
      //res.status(200).end();
    }
    next();
});

//get response of posts if entered
app.post('/api/posts', (req, res, next) => {  

  //create our post with incoming post data
  // const post = req.body;
  const post = new Post({
    title:  req.body.title,
    content:  req.body.content,
  });

  //add the post to the database and return the ID
  post.save().then(createdPost => {
    res.status(201).json({
      message: 'Post added successfully',
      postId: createdPost._id
    });
  }); //mongoose method add to

  console.log(post);  
});

// This is left here from when I was learning
// //use a new middleware on the app
// app.use('/api/posts', (req, res, next) => {
  // const posts = [
  //   {
  //     id: 'adf3asdf', 
  //     title:'first server side post',
  //     content: 'this is coming from server.'
  //   },
  //   {
  //     id: 'adfdasda a3asdf', 
  //     title:'2 server side post',
  //     content: 'this is coming from server.'
  //   }
  // ];
  // res.status(200).json({
  //     message: 'Post fetched successfully!',
  //     posts: posts
  // });
// });

//use a new middleware on the app to get posts when the user loads the homepage
app.get('/api/posts', (req, res, next) => {

  //use the mongoose Post model to find all posts
  Post.find().then(documents => {
    console.log(documents);
    res.status(200).json({
      message: 'Post fetched successfully!',
      posts: documents
    });
  });  
});

//use a new route to update a post
//put will overwrite a post, patch will update parts of a post
app.put("/api/posts/:id", (req, res, next) => {

  //create a new post
  const post = new Post({
    _id: req.body.id,
    title: req.body.title,
    content: req.body.content
  });

  //use Mongoose to update a resource via Post model
  Post.updateOne({_id: req.params.id}, post).then(result => {
    console.log(result);
    res.status(200).json({message: "Update succesful!"});
  });

});

//use a new route to get a single post from the api
app.get("/api/posts/:id", (req, res, next) => {
  Post.findById(req.params.id).then(post => {
    if (post) {
      res.status(200).json(post);
    } else {
      res.status(404).json({message: 'Post not found!'});
    }
  })
});

//add a new route to delete posts
app.delete("/api/posts/:id", (req, res) => {
  // console.log(req.params.id);

  //use the mongoose Post model to delete the post ID found in the url
  Post.deleteOne({ _id: req.params.id }).then(result => {
     console.log(result);
     res.status(200).json({message: 'Post deleted!'});
  });    
});

//export the app
module.exports = app;




