import mongoose from "mongoose";
const connectsPurchasedSchema = new mongoose.Schema({
    date:{type: String,required:[true,"Please provide a date"]},
    account:{type: mongoose.Schema.Types.ObjectId, ref: "AccountBidder",required:[true,"Please provide an account"]},
    noOfConnections:{type: String,required:[true,"Please provide a no of connections"]},
    amount:{type: String,required:[true,"Please provide an amount"]},
},{
    timestamps: true,
});
const ConnectsPurchased = mongoose.model("ConnectsPurchased", connectsPurchasedSchema);
export default ConnectsPurchased;