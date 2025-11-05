import mongoose from "mongoose";
const debitDetails = new mongoose.Schema({
    date:{type:Date,required:[true,"Please provide a date"]},
    financeName:{type: mongoose.Schema.Types.ObjectId, ref: "FinanceCompany",required:[true,"Please provide a finance name"]},
    debit_amount:{type:String,required:[true,"Please provide a debit amount"]},
    source:{type:String,required:[true,"Please provide a source"]},
    notes:{type:String,required:[false,"Please provide a notes"]},
},{
    timestamps:true,
});
debitDetails.index({ date: -1 }); // Index on date (descending)
debitDetails.index({ status: 1 }); // Filter/search by status
debitDetails.index({ source: 1 }); // Filter by source
const ExpenseDetails = mongoose.model("ExpenseDetails",debitDetails);
export default ExpenseDetails;