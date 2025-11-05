import mongoose from "mongoose";
const jobTypeSchema = new mongoose.Schema({
    name:{type:String,required:[true,"Please provide a name"]},
    status:{type:String, default:"1", required:[true,"Please provide a status"]},
},{
    timestamps: true
});

const JobType = mongoose.model("JobType",jobTypeSchema);
export default JobType;