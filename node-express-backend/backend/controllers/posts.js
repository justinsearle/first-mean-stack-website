
//captial letter lets us know we can make an object from this onject
const Post = require('../models/post');

//ES6 syntax
//export function createPost(req, res, next) {  

//create a post in the database and return a copy of the post
exports.createPost = (req, res, next) => {  
  //get the url of our server
  const url = req.protocol + '://' + req.get("host");
  //create our post with incoming post data
  // const post = req.body;
  const post = new Post({
    title:  req.body.title,
    content:  req.body.content,
    imagePath: url + "/images/" + req.file.filename,
    creator: req.userData.userId    
  });
  //console.log(req.userData);
  //return res.status(200).json({}); //return so we dont save database to test

  //add the post to the database and return the ID
  post.save().then(createdPost => {
    console.log("ROUTES.POSTS POST: added post to database successfully");
    res.status(201).json({
      message: 'Post added successfully',      
      post: {
        //next gen javascript features (spread operator) copies all properties             
        ...createdPost,
        id: createdPost._id //then we can override some   
      }
    });
  }) //mongoose method add to
  .catch(error => {
    res.status(500).json({
      message: "Creating a post failed."
    });
  });
  console.log(post);  
}

//get all posts from the database
exports.getPosts = (req, res, next) => {
  const pageSize = +req.query.pagesize;
  const currentPage = +req.query.page;
  const postQuery = Post.find(); //only executes when we call .then
  let fetchedPosts;
  if (pageSize && currentPage) {
    postQuery
      .skip(pageSize * (currentPage - 1)) //skip certain amount of posts
      .limit(pageSize); //narrow down further
  }
  //use the mongoose Post model to find all posts
  postQuery.then(documents => {
    console.log("ROUTES.POSTS GET: database results: " + documents);
    fetchedPosts = documents;
    return Post.count(); //return a query that will be executed - this creates a new promise we can listen to
  })
  .then(count => {
    res.status(200).json({
      message: 'Post fetched successfully!',
      posts: fetchedPosts,
      maxPosts: count
    })
    .catch(error => {
      res.status(500).json({message: "Could not get posts."});
    });
  });  
}

//get a single post in the database
exports.getPost = (req, res, next) => {
  Post.findById(req.params.id).then(post => {
    if (post) {
      console.log("ROUTES.POSTS GET: database record found: " + req.params.id);
      res.status(200).json(post);
    } else {
      console.log("ROUTES.POSTS GET: database record not found:" + req.params.id);
      res.status(404).json({message: 'Post not found!'});
    }
  })
  .catch(error => {
    res.status(500).json({message: "Could not get post."});
  });
}

//update a post in the database
exports.updatePost = (req, res, next) => {
  let imagePath = req.body.imagePath;
  if (req.file) {
    const url = req.protocol + '://' + req.get("host");
    imagePath = url + "/images/" + req.file.filename;
  }
  //create a new post
  const post = new Post({
    _id: req.body.id,
    title: req.body.title,
    content: req.body.content,
    imagePath: imagePath,
    creator: req.userData.userId
  });
  console.log("ROUTES.POSTS PUT post:" + post);
  
  //use Mongoose to update a resource via Post model
  Post.updateOne({_id: req.params.id, creator: req.userData.userId}, post).then(result => {
    console.log("ROUTES.POSTS PUT: database record updated successfully: " + req.params.id);
    console.log(result); //log object
    if (result.nModified > 0) {
      res.status(200).json({message: "Update succesful!"});
    } else {
      res.status(401).json({message: "Not authorized."});
    }
  })
  .catch(error => {
    res.status(500).json({
      message: "Couldn't update post!."
    });
  });
}

//delete a post
exports.deletePost = (req, res) => {
  // console.log(req.params.id);

  //use the mongoose Post model to delete the post ID found in the url
  Post.deleteOne({ _id: req.params.id, creator: req.userData.userId }).then(result => {
    console.log("ROUTES.POSTS DELETE: database record deleted: " + req.params.id);
    if (result.n > 0) {
      res.status(200).json({message: "Post deleted!"});
    } else {
      res.status(401).json({message: "Not authorized!"});
    }
  }).catch(error => {
    res.status(500).json({message: "Could not delete post."});
  });
}