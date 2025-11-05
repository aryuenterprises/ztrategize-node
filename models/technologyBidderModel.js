import mongoose from "mongoose";

const technologyBidderSchema = new mongoose.Schema({
  name: { type: String, required: [true, "Please provide a name"] },
  status: { type: String, default: "1" },
}, {
  timestamps: true
});

const TechnologyBidder = mongoose.model("TechnologyBidder", technologyBidderSchema);
export default TechnologyBidder;
