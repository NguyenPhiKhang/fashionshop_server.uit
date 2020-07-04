const upload = require("../middleware/upload");

const uploadFiles = async (req, res) => {
    try {
      await upload(req, res);
      console.log(req.files);
  
      if (req.files.length <= 0) {
        // return res.send(`You must select at least 1 file.`);
        throw new Error("You must select at least 1 file.");
      }
  
      return `Files have been uploaded.`;
    } catch (error) {
      console.log(error);
    }
  };
  
  module.exports = {
    uploadFiles: uploadFiles
  };