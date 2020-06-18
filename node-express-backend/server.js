//old way (used while learing)
//----------------------------
// //import http package
// const http = require('http');

// //import app
// const app = require('./backend/app');

// //default port
// const port = (process.env.PORT || 3000)

// //create the server with a request and a response old
// // const server = http.createServer((req, res) => {
// //     res.end('This is my first response');
// // });

// //set a configuration for the port
// app.set('port', port);

// //create the server with a request and a response new
// const server = http.createServer(app);

// //listen on the server
// server.listen(port);
//----------------------------

//setup server variables
const app = require("./backend/app");
const debug = require("debug")("node-angular");
const http = require("http");

//this is a function to normalize a given value to be used for our server port (string or int based on port type)
const normalizePort = val => {
  var port = parseInt(val, 10); //attempt to get Int value in base 10

  //checks for named port intstead of number
  if (isNaN(port)) {    
    return val; //named pipe
  }

  //validates number port
  if (port >= 0) {    
    return port; //valid port
  }

  //default - bad port value
  return false;
};

//this is a constant function that stores the error event listener
const onError = error => {
  if (error.syscall !== "listen") {
    throw error;
  }
  const bind = typeof port === "string" ? "pipe " + port : "port " + port;
  switch (error.code) {
    case "EACCES":
      console.error(bind + " requires elevated privileges");
      process.exit(1);
      break;
    case "EADDRINUSE":
      console.error(bind + " is already in use");
      process.exit(1);
      break;
    default:
      throw error;
  }
};

//this is a constant function that stores the connection input event listener
const onListening = () => {
  const addr = server.address();
  const bind = typeof port === "string" ? "pipe " + port : "port " + port;
  debug("Listening on " + addr + ", " + bind);
};

//set the app port
//const port = normalizePort(process.env.PORT || "3000"); //uncomment for environment port with static default
const port = normalizePort("3000");
app.set("port", port);

//create the server variable and start listening
const server = http.createServer(app);
server.on("error", onError);
server.on("listening", onListening);
server.listen(port);
