
//require multer (for image upload as bodyParser will not work for files)
const multer = require('multer');

//valid picture types to accept on post upload
const MIME_TYPE_MAP = {
  'image/png': 'png',
  'image/jpeg': 'jpeg',
  'image/jpg': 'jpg'
};

//multer-config: tell multer where to store files that might be attached to incoming request
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const isValid = MIME_TYPE_MAP[file.mimetype];
    let error = new Error("Invalid mime type");
    if (isValid) {
        error = null;
    }
    cb(error, "backend/images"); //pass back the "where to store" info to multer    
  },
  filename: (req, file, cb) => {
    //replace whitepace with hyphens
    const name = file.originalname.toLocaleLowerCase().split(' ').join('-');
    const ext = MIME_TYPE_MAP[file.mimetype]; //get file extension
    cb(null, name + "-" + Date.now() + "." + ext); //pass back file name
  }
});

//export this for routes
module.exports = multer({storage: storage}).single("image");