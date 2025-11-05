import mongoose from "mongoose";

const invoice = new mongoose.Schema(
  {
    clientId: { type: mongoose.Schema.Types.ObjectId, ref: "ClientDetails" },
    invoice_number: {
      type: String,
      required: [true, "Please provide a invoice number"],
    },
    client: { type: String, required: [true, "Please provide a client name"] },
    project: {
      type: String,
      required: [false, "Please provide a project name"],
    },
    invoice_date: {
      type: Date,
      required: [true, "Please provide a invoice date"],
    },
    due_date:{type:Date,required:[true,"Please provide a due date"]},
    currency: { type: String, required: [false, "Please provide a currency"] },
    items: [
      {
        description: {
          type: String,
          required: [false, "Please provide a description"],
        },
        quantity: {
          type: Number,
          required: [false, "Please provide a quantity"],
        },
        rate: { type: Number, required: [false, "Please provide a rate"] },
        amount: { type: Number, required: [false, "Please provide a amount"] },
      },
    ],
    sub_total: {
      type: String,
      required: [false, "please provide a sub total"],
    },
    tax: { type: String, required: [false, "please provide a tax"] },
    total_amount: {
      type: String,
      required: [false, "please provide a total amount"],
    },
    notes:{type:String,required:[false,"Please provide a notes"]},
    status: { type: String, required: [true, "Please select a status"] },
    is_deleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);
invoice.index({ clientId: 1, status: 1 });
const Invoice = mongoose.model("Invoice", invoice);
export default Invoice;

