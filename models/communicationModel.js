import mongoose from "mongoose";
const communicationSchema = new mongoose.Schema({
    employeeId: { type: mongoose.Schema.Types.ObjectId, ref: "Employee" },
    date:{type:Date,required:[true,"Please provide a date"]},
    notes:{type:String,required:[true,"Please provide a notes"]},
},{
    timestamps:true,
});
const Communication = mongoose.model("Communication",communicationSchema);
export default Communication;