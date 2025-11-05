// // import multer from "multer";
// // import path from "path";

// // // Optional: Validate allowed file types
// // const fileFilter = (req, file, cb) => {
// //   const allowedTypes = /jpeg|jpg|png|gif|pdf/;
// //   const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
// //   const mimetype = allowedTypes.test(file.mimetype);

// //   if (extname && mimetype) {
// //     cb(null, true);
// //   } else {
// //     cb(new Error("Only image and PDF files are allowed"));
// //   }
// // };

// // const storage = multer.diskStorage({
// //   destination: (req, file, cb) => {
// //     cb(null, "uploads/"); // Make sure this folder exists
// //   },
// //   filename: (req, file, cb) => {
// //     const uniqueName = `${Date.now()}-${file.originalname}`;
// //     cb(null, uniqueName);
// //   },
// // });

// // const upload = multer({
// //   storage,
// //   limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5MB
// //   fileFilter,
// // });

// // export default upload;

// import multer from "multer";
// import path from "path";

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "uploads/"); // store files in 'uploads' folder
//   },
//   filename: function (req, file, cb) {
//     const uniqueName = Date.now() + "-" + file.originalname;
//     cb(null, uniqueName);
//   }
// });

// const upload = multer({
//   storage,
//   limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
// });

// export default upload;

// const multer = require("multer");
// const path = require("path");

import multer from "multer";
import path from "path";
import fs from "fs";

import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ensureDirExists = (dirPath) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
};
// Multer storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let destPath;
    console.log("file.fieldname", file.fieldname);
    console.log("hhhhhh", file.fieldname);
    if (file.fieldname === "photo") {
      destPath = path.join(__dirname, "../uploads");
    }
    // else if (file.fieldname === 'files'){
    //   console.log("download 123");
    //   destPath =path.join(__dirname,'../uploads/documents');
    // }
    else if (
      /^document\[\d+\]\[files\]\[\d+\]\[selectedfile\]$/.test(file.fieldname)
    ) {
      console.log("Matched file upload field");
      destPath = path.join(__dirname, "../uploads/documents");
    } else {
      destPath = path.join(__dirname, "../uploads/others");
    }
    ensureDirExists(destPath);
    cb(null, destPath);
  },
  filename: (req, file, cb) => {
    const uniqueName =
      Date.now() + "-" + file.originalname.replace(/\s+/g, "_");
    cb(null, uniqueName);
  },
});
// Multer instance
const upload = multer({
  storage,
  // limits: {
  //   fileSize: 5 * 1024 * 1024, // 5MB limit per file
  // },

  // fileFilter: (req, file, cb) => {
  //   // Accept only images and PDFs (adjust as needed)
  //   const fileTypes = /jpeg|jpg|png|pdf/;
  //   const ext = path.extname(file.originalname).toLowerCase();
  //   const mime = file.mimetype;

  //   if (fileTypes.test(ext) && fileTypes.test(mime)) {
  //     cb(null, true);
  //   } else {
  //     cb(new Error("Only images and PDF files are allowed!"));
  //   }
  // }
//   fileFilter: (req, file, cb) => {
//   const allowedTypes = /jpeg|jpg|png|gif|pdf|mp4|mkv|avi/; //  Added video types
//   const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
//   const mimetype = allowedTypes.test(file.mimetype);

//   if (extname && mimetype) {
//     cb(null, true);
//   } else {
//     cb(new Error("Only images, videos, and PDF files are allowed"));
//   }
// }

  // Optional: Validate allowed file types
  // fileFilter: (req, file, cb) => {  
  //   const allowedTypes = /jpeg|jpg|png|gif|pdf/;
  //   const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  //   const mimetype = allowedTypes.test(file.mimetype);

  //   if (extname && mimetype) {
  //     cb(null, true);
  //   } else {
  //     cb(new Error("Only image and PDF files are allowed"));
  //   }
  // }
});
export default upload;
