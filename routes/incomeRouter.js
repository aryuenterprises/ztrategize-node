import express from "express";
import {
  createIncome,
  getincomeDetails,
  IncomeDelete,
  editIncomeDetails,
  getMonthlyTotalCredit,
  getYearlyTotalCredit,

  //finance company
  createFinanceCompany,
  getFinanceCompany,
  editFinanceCompany,
  deleteFinanceCompany,
  getFinanceName
} from "../controllers/incomeController.js";
const incomeRouter = express.Router();

incomeRouter.post("/create-income", createIncome);
incomeRouter.put("/edit-income/:id", editIncomeDetails);
incomeRouter.get("/get-monthly-total-credit", getMonthlyTotalCredit);
incomeRouter.get("/get-yearly-total-credit", getYearlyTotalCredit);
incomeRouter.get("/view-income", getincomeDetails);
incomeRouter.delete("/delete-income/:id", IncomeDelete);

//finance Company

incomeRouter.post("/create-financecompany", createFinanceCompany);
incomeRouter.get("/view-financecompany", getFinanceCompany);
incomeRouter.put("/edit-financecompany/:id", editFinanceCompany);
incomeRouter.delete("/delete-financecompany/:id", deleteFinanceCompany);
incomeRouter.get("/finance-name", getFinanceName);
export default incomeRouter;
