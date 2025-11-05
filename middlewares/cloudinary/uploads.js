// config/upload.js
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "./cloudinary.js"; // from previous step

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    let folder = "others";

    if (file.mimetype.startsWith("image/")) folder = "images";
    else if (file.mimetype === "application/pdf") folder = "pdfs";
    else if (file.mimetype.startsWith("video/")) folder = "videos";

    return {
      folder,
      resource_type: "auto", // auto-detects type: image, video, raw
      public_id: `${Date.now()}-${file.originalname}`,
    };
  },
});

const upload = multer({ storage });

export default upload;
