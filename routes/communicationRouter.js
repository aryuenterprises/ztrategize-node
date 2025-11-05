import express from "express";
import {
    createCommunication,
    communicationDelete,
    editCommunication,
    getCommunication
} from "../controllers/communicationController.js";
const communicationRouter = express.Router();

communicationRouter.post("/create-communication",createCommunication);
communicationRouter.get("/get-communication/:id",getCommunication);
communicationRouter.put("/edit-communication/:id",editCommunication);
communicationRouter.delete("/delete-communication/:id",communicationDelete);
export default communicationRouter;