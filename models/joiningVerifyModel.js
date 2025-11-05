import mongoose from "mongoose";
const joiningVerifyModel = new mongoose.Schema(
  {
    verify: [
      {
        title: { type: String, required: true },
        option: { type: String, required: false }
      }
    ]
  },
  {
    timestamps: true
  }
);

const JoiningVerifyModel = mongoose.model("JoiningVerifyList", joiningVerifyModel);
export default JoiningVerifyModel;