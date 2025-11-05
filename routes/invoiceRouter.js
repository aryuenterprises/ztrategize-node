import express from "express";
import {
    addNotesInvoice,
    createInvoice,
    getInvoiceDetails,
    editInvoiceDetails,
    deleteInvoiceDetails,
    getProjectName,
    getProjectDetails,
    getProjectNameWithClient

}from "../controllers/invoiceController.js";
const invoiceRouter = express.Router();

invoiceRouter.post("/create-invoice", createInvoice);
invoiceRouter.get("/view-invoice", getInvoiceDetails);
invoiceRouter.put("/edit-invoice/:id", editInvoiceDetails); 
invoiceRouter.post("/delete-invoice/:id", deleteInvoiceDetails); 
invoiceRouter.post("/add-notes/:id", addNotesInvoice);
invoiceRouter.get("/get-project-name", getProjectName);
invoiceRouter.get("/get-project-details/:type", getProjectDetails);
invoiceRouter.get("/get-project-name-with-client", getProjectNameWithClient);
export default invoiceRouter;