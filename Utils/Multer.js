import multer from "multer";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },

  filename: function (req, file, cb) {
    const newFileName = file.originalname.split(".")[0];
    const fileType = file.mimetype.split("/")[1];
    cb(null, newFileName + new Date().getTime() + "." + fileType);
  },
});

const upload = multer({ storage: storage });

export default upload;
