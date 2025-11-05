import express from "express";
import {
      addClientDetails,
      getClientDetails,
      editClientDetails,
      deleteClientDetails,
      addNotes,
      loginClient,
      getClientDetailsById
}from "../controllers/clientController.js";
const clientRouter = express.Router();
clientRouter.post("/client-login",loginClient);
clientRouter.post("/create-clientdetails",addClientDetails);
clientRouter.get("/view-clientdetails",getClientDetails);
clientRouter.get("/view-clientdetails-id/:id",getClientDetailsById);
clientRouter.put("/edit-clientdetails/:id",editClientDetails); 
clientRouter.post("/delete-clientdetails/:id",deleteClientDetails); 
clientRouter.post("/add-notes/:id",addNotes);
export default clientRouter;