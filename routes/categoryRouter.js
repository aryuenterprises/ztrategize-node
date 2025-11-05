import express from "express";
import {
       createCategory,
          getCategoryDetails,
          categoryDelete,
          editCategoryDetails,
          categoryStatusUpdate
}from "../controllers/categoryController.js";
const categoryRouter = express.Router();

categoryRouter.post("/create-createCategory",createCategory);
categoryRouter.get("/view-category",getCategoryDetails);
categoryRouter.put("/edit-categorydetails/:id",editCategoryDetails); 
categoryRouter.post("/delete-categoryDelete/:id",categoryDelete); 
categoryRouter.put("/category-status-update/:id",categoryStatusUpdate);
export default categoryRouter;