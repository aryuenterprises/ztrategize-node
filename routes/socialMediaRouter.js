import express from "express";
import {
    createSocialMediaAccount,
      getSocialMediaAccount,
      editSocialMediaAccount,
      deleteSocialMedia,
    
      createSocialMediaCredential,
      getSocialMediaCredential,
      editSocialMediaCredential,
      deleteSocialMediaCredential,
      getSocialMediaName
} from "../controllers/socialMediaController.js";

const socialMediaRouter = express.Router();

socialMediaRouter.post("/create-socialmedia", createSocialMediaAccount);
socialMediaRouter.get("/view-socialmedia", getSocialMediaAccount);
socialMediaRouter.put("/edit-socialmedia/:id", editSocialMediaAccount);
socialMediaRouter.delete("/delete-socialmedia/:id", deleteSocialMedia);

//credentials
socialMediaRouter.post("/create-socialmedia-credential", createSocialMediaCredential);
socialMediaRouter.get("/view-socialmedia-credential", getSocialMediaCredential);
socialMediaRouter.put("/edit-socialmedia-credential/:id", editSocialMediaCredential);
socialMediaRouter.delete("/delete-socialmedia-credential/:id", deleteSocialMediaCredential);
socialMediaRouter.get("/view-socialmedia-name", getSocialMediaName);
export default socialMediaRouter;