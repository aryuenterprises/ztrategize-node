import mongoose from "mongoose";

const accountBidderSchema = new mongoose.Schema({
  name: { type: String, required: [true, "Please provide a name"] },
  status: { type: String, default: "1" },
}, {
  timestamps: true
});

const AccountBidder = mongoose.model("AccountBidder", accountBidderSchema);
export default AccountBidder;
