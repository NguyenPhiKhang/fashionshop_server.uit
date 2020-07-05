const upload = require("../middleware/upload");

const uploadFiles = async (req, res) => {
  try {
    await upload(req, res);
    // console.log(req.files);

    if (req.files.length <= 0) {
      res.send({ success: false, message: `You must select at least 1 file.`, filenames: [] });
      // throw new Error("You must select at least 1 file.");
    }

    const filenames = await Promise.all(req.files.map(async file =>{
      return await file.filename;
    }));

    return res.send({ success: true, message: "Files have been uploaded.", filenames: filenames });
  } catch (error) {
    console.log(error);

    if (error.code === "LIMIT_UNEXPECTED_FILE") {
      return res.send({ success: false, message: "Too many files to upload.", filenames: [] });
    }
    return res.send({ success: false, message: `Error when trying upload many files: ${error}`, filenames: [] });
  }
};

module.exports = {
  uploadFiles: uploadFiles
};