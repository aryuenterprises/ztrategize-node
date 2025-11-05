import mongoose from "mongoose";
const incomeDetails = new mongoose.Schema({
    date:{type:Date,required:[true,"Please provide a date"]},
    financeName:{type: mongoose.Schema.Types.ObjectId, ref: "FinanceCompany",required:[true,"Please provide a finance name"]},
    credit_amount:{type:String,required:[true,"Please provide a credit amount"]},
    source:{type:String,required:[true,"Please provide a source"]},
    notes:{type:String,required:[false,"Please provide a notes"]},
},{
    timestamps:true,
});
incomeDetails.index({ date: -1 }); // Index on date (descending)
incomeDetails.index({ status: 1 }); // Filter/search by status
incomeDetails.index({ source: 1 }); // Filter by source
const IncomeDetails = mongoose.model("IncomeDetails",incomeDetails);
export default IncomeDetails;