import express from 'express';
import{
    createRevision, getRevisionInformation, revisionDelete , editRevisionDetails
}from '../controllers/revisionController.js';
const revisedRouter = express.Router();

revisedRouter.post("/create-revision",createRevision);
revisedRouter.get("/view-revision/:id",getRevisionInformation);
revisedRouter.delete("/delete-revision/:id",revisionDelete);
revisedRouter.put("/edit-revision/:id",editRevisionDetails);
export default revisedRouter;