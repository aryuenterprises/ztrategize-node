import mongoose from "mongoose";

const paymentTypeModel = new mongoose.Schema({
    client_name: { type:mongoose.Schema.Types.ObjectId,ref:"ClientDetails",required:[true,"Please provide a client name"] },
    // project_name: { type: String, required: [true, "Please provide a project name"] },
    project_name: { type: mongoose.Schema.Types.ObjectId, ref: "Project", required: [true, "Please provide a project name"] },
    budget: { type: String, required: [false, "Please provide a budget"] },
    // gst:{type:String, required:[true,"Please provide a gst"]},
    // gst_amount:{type:String, required:[true,"Please provide a gst amount"]},
    payment_date: { type: String, required: [false, "Please provide a payment date"] },
    payment_amount:[{
        payment:{type:String,required:[true,"Please provide a payment"]},
        date:{type:String},
    }],
    reference_no: { type: String, required: [false, "Please provide a reference number"] },
    file: { type: String, required: [false, "Please provide a file"] },
    status: { type: String, required: [true, "Please provide a status"] },
    notes: { type: String, required: [false, "Please provide a note"] },
});
const PaymentType = mongoose.model("PaymentType", paymentTypeModel);
export default PaymentType;