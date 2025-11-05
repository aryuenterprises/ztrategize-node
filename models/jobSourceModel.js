import mongoose from "mongoose";
const jobSourceSchema = new mongoose.Schema({
    name:{type:String, required:[true, "Please provide a name"]},
    status:{type:String, default:"1", required:[true, "Please provide a status"]},
},{
    timestamps: true
});

const JobSource = mongoose.model("JobSource", jobSourceSchema);
export default JobSource;