import mongoose from "mongoose";
const jobInterviewSchema = new mongoose.Schema(
    {
        name:{type:String, unique:[true,"Name already exists"],required:[true, "Please provide a name"]},
        status:{type:String, default:"1", required:[true, "Please provide a status"]},
    },{
        timestamps: true
    }
);

const JobInterview = mongoose.model("JobInterview", jobInterviewSchema);
export default JobInterview;