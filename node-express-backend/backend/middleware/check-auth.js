
//include json web token to verify
const jwt = require('jsonwebtoken');

//check there is a token attached to the request and also validate the token

//this middleware is just a function so that is what we will return
module.exports = (req, res, next) => {
  //get our token from the request
  try {
    const token = req.headers.authorization.split(" ")[1];
    //verify the token (with result)
    const decodedToken = jwt.verify(token, "secret_only_for_development");
    //add a new field to the request
    req.userData = { email: decodedToken.email, userId: decodedToken.userId };
    next();
  } catch (error) {
    console.log(error);
    res.status(401).json({
      message: "Auth failed"
    });
  }
};