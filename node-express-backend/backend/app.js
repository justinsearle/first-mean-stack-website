//include express JS in our app
const express = require('express');

//include body parser package
const bodyParser = require('body-parser');

//add a route for home
const app = express();

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
    res.setHeader(
        "Access-Control-Allow-Headers", 
        "Origin, X-Requested-With, Content-Type, Accept"
    );
    res.setHeader(
        "Access-Control-Allow-Methods", 
        "GET, POST, PATCH, DELETE, OPTIONS"
    );
    next();
});

//get response of posts if entered
app.post('/api/posts', (req, res, next) => {
  const post = req.body;
  console.log(post);
  res.status(201).json({
    message: 'Post added successfully'
  });
});

//use a new middleware on the app
app.use('/api/posts', (req, res, next) => {
    const posts = [
      {
        id: 'adf3asdf', 
        title:'first server sie post',
        content: 'this is coming from server.'
      },
      {
        id: 'adfdasda a3asdf', 
        title:'2 server sie post',
        content: 'this is coming from server.'
      },
      {
        id: 'aaaa', 
        title:'3 server sie post',
        content: 'this is coming from server.'
      }
    ];
    res.status(200).json({
        message: 'Post fetched successfully!',
        posts: posts
    });
});

//export the app
module.exports = app;




