//include from node JS to map to paths (image folder)
const path = require('path');

//include express JS in our app
const express = require('express');

//include body parser package
const bodyParser = require('body-parser');

//include mongoose
const mongoose = require('mongoose');

//include posts routes file
const postsRoutes = require('./routes/posts');

//create our router object essentially
const app = express();

//connect to the database
// mongoose.connect("mongodb://[username:password@]host1[:port1][,...hostN[:portN]][/[defaultauthdb][?options]]");
mongoose.set('useNewUrlParser', true);
// mongoose.set('useFindAndModify', false);
// mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);
mongoose.connect("mongodb://localhost:27017/first-mean")
  .then(() => {
    console.log("APP: Connected to Database.");
  })
  .catch(() => {
     console.log("APP: Database Connection failed.");
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

//allow any requests to the image folder to be granted (ExpressJS middleware)
app.use("/images", express.static(path.join("backend/images")));

//set app headers and enable CORS
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

// This is left here from when I was learning
// //use a new middleware on the app
// app.use('/api/posts', (req, res, next) => {
  // const posts = [
  //   {
  //     id: 'adf3asdf', 
  //     title:'first server side post',
  //     content: 'this is coming from server.'
  //   }
  // ];
  // res.status(200).json({
  //     message: 'Post fetched successfully!',
  //     posts: posts
  // });
// });

//forward any posts requests into our posts routes with express JS
app.use("/api/posts", postsRoutes);

//export the app
module.exports = app;




