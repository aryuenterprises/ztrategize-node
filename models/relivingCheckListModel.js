import mongoose from "mongoose";
const relivingModel = new mongoose.Schema(
    {
    name: { type: String, required: [true, "Please provide a name"]},
    type: { type: String, required: [false, "Please provide a input"] },
    options:[
      {
        option:{ type: String, required: [false, "Please provide a option"] },
      }
    ],
  },
  {
    timestamps: true,
  }
);

const RelivingModel = mongoose.model("RelivingList", relivingModel);
export default RelivingModel;

