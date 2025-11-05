import express from 'express';
import{
    createLinks,
    getLinkDetails,
    linkDelete,
    editLinkDetails,
    getTitleFromCategory,
    linkStatusUpdate,
    getLinkByCategory
}from '../controllers/linkController.js';
const linkRouter = express.Router();

linkRouter.post("/create-link",createLinks);
linkRouter.get("/view-link",getLinkDetails);
linkRouter.delete("/delete-link/:id",linkDelete);
linkRouter.put("/edit-linkdetails/:id",editLinkDetails);
linkRouter.get("/get-title-from-category",getTitleFromCategory);
linkRouter.put("/link-status-update/:id",linkStatusUpdate);
linkRouter.get("/get-link-by-category", getLinkByCategory);
export default linkRouter;