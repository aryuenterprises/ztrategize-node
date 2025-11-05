import express from "express";
import { createDeclaration, getDeclaration, editDeclaration, deleteDeclaration  } from "../controllers/declarationController.js";

const declarationRouter = express.Router();

declarationRouter.post("/create-declarationlist", createDeclaration);
declarationRouter.get("/view-declarationlist", getDeclaration);
declarationRouter.put("/edit-declarationlist/:id", editDeclaration);
declarationRouter.delete("/delete-declarationlist/:id", deleteDeclaration);

export default declarationRouter;