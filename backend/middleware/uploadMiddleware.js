import multer from "multer";
import path from "path";

// Configure where and how the file is saved
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, "uploads/"); // Save files to the uploads folder
  },
  filename(req, file, cb) {
    // Rename the file to include the user's ID and the current timestamp
    cb(null, `${req.user._id}-${Date.now()}${path.extname(file.originalname)}`);
  },
});

// Check file type to ensure it is a document
function checkFileType(file, cb) {
  const filetypes = /pdf|doc|docx/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new Error("Error: Resumes must be PDF or Word documents!"));
  }
}

// Initialize multer
const upload = multer({
  storage,
  limits: { fileSize: 5000000 }, // 5MB file size limit
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
});

export default upload;
