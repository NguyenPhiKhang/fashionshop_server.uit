const util = require("util");
const multer = require("multer");
const crypto = require("crypto");
const path = require('path');
const GridFsStorage = require("multer-gridfs-storage");

const storage = new GridFsStorage({
  url: "mongodb+srv://khangse616:khangse616@cluster0-wpib7.mongodb.net/fashion-shop?retryWrites=true&w=majority",
  options:{useUnifiedTopology: true},
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err, buf) => {
        if (err) {
          return reject(err);
        }
        const filename = buf.toString('hex') + path.extname(file.originalname);
        const fileInfo = {
          filename: filename,
          bucketName: 'photos'
        };
        resolve(fileInfo);
      });
    });
  }
});

var uploadFile = multer({ storage: storage }).array("multi-files", 20);
var uploadFilesMiddleware = util.promisify(uploadFile);
module.exports = uploadFilesMiddleware;