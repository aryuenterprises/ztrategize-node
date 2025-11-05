import express from 'express';
import {
    createLetter, getLetterDetails, editLetterDetails, letterDelete,
    letterTemplate} from '../controllers/letterController.js';

const letterRouter = express.Router();

letterRouter.post("/create-letter", createLetter);
letterRouter.get("/view-letter", getLetterDetails);
letterRouter.put("/edit-letter/:id", editLetterDetails);
letterRouter.delete("/delete-letter/:id", letterDelete);
letterRouter.get("/particular-letter-template/:id",letterTemplate);
export default letterRouter;