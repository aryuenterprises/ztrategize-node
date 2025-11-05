import express from 'express';
import{
    createExpenses,
    getExpensesDetails,
    ExpenseDelete,
    editExpenseDetails,
    getMonthlyTotalExpenses,
    getYearlyTotalExpenses
}from '../controllers/incomeController.js';
const expenseRouter = express.Router();
expenseRouter.post("/create-expense",createExpenses);
expenseRouter.put("/edit-expense/:id",editExpenseDetails);
expenseRouter.get("/view-expense",getExpensesDetails);
expenseRouter.get("/get-monthly-total-expense",getMonthlyTotalExpenses);
expenseRouter.get("/get-yearly-total-expense",getYearlyTotalExpenses);
expenseRouter.delete("/delete-enpense/:id",ExpenseDelete);
export default expenseRouter;