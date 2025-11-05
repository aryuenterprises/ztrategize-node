import mongoose from "mongoose";
const joiningModel = new mongoose.Schema(
  {
    title: { type: String, required: [true, "Please provide a title"], unique:[ true,"title already exists"] },
    input: { type: String, required: [false, "Please provide a input"] },
    inputField:[
      {
        option:{ type: String, required: [false, "Please provide a title"] },
      }
    ],
  },
  {
    timestamps: true,
  }
);

const JoiningModel = mongoose.model("JoiningList", joiningModel);
export default JoiningModel;
