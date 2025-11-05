import mongoose from "mongoose";

const bidderEmployeeSchema = new mongoose.Schema(
  {
    employeeId: { type: mongoose.Schema.Types.ObjectId, ref: "Employee" },
    date: { type: String, required: [true, "Date is required"] },
    account: { type: mongoose.Schema.Types.ObjectId, ref: "AccountBidder" },
    client: { type: String, required: [true, "Please provide a client"] },
    technology: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TechnologyBidder",
    },
    reply: { type: String, required: [true, "Please provide a reply"] },
    noOfConnections: {
      type: String,
      required: [true, "Please provide a no of connections"],
    },
    noOfBoost: {
      type: String,
      required: [false, "Please provide a no of boost"],
    },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "Employee" },
    link: { type: String, required: [true, "Please provide a link"] },
    status: { type: String, default: "Pending" },
  },
  {
    timestamps: true,
  }
);

const BidderEmployee = mongoose.model("BidderEmployee", bidderEmployeeSchema);
export default BidderEmployee;
