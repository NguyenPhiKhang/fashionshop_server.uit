const util = require("util");
const multer = require("multer");
const GridFsStorage = require("multer-gridfs-storage");

var storage = new GridFsStorage({
  url: "mongodb+srv://khangse616:khangse616@cluster0-wpib7.mongodb.net/fashion-shop?retryWrites=true&w=majority",
  options: { useNewUrlParser: true, useUnifiedTopology: true },
  file: (req, file) => {
    const match = ["image/png", "image/jpeg"];

    if (match.indexOf(file.mimetype) === -1) {
      const filename = `${Date.now()}-khang-${file.originalname}`;
      return filename;
    }

    return {
      bucketName: "photos",
      filename: `${Date.now()}-khang-${file.originalname}`
    };
  }
});

var uploadFile = multer({ storage: storage }).array("multi-files", 10);
var uploadFilesMiddleware = util.promisify(uploadFile);
module.exports = uploadFilesMiddleware;