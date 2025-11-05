import express from "express";
import { createPaymentType, getPaymentType, editPaymentType, deletePaymentType, getFilter  } from "../controllers/paymentTypeController.js";

const paymentTypeRouter = express.Router();

paymentTypeRouter.post("/create-paymenttype", createPaymentType);
paymentTypeRouter.get("/view-paymenttype", getPaymentType);
paymentTypeRouter.get("/view-filter-paymenttype", getFilter);
paymentTypeRouter.put("/edit-paymenttype/:id", editPaymentType);
paymentTypeRouter.delete("/delete-paymenttype/:id", deletePaymentType);

export default paymentTypeRouter;