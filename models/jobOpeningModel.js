import mongoose from "mongoose";
const socialMediaSchema = new mongoose.Schema({
    jobType:{type: mongoose.Schema.Types.ObjectId, ref: "JobType",required:[true,"Please provide a job type"]},
    jobTitle:{type:String, required:[true,"Please provide a job title"]},
    jobDescription:{type:String, required:[true,"Please provide a job description"]},
    jobRequirement:{type:String, required:[true,"Please provide a job requirement"]},
    startFrom:{type:Date, required:[true,"Please provide a start date"]},
    endingTo:{type:Date, required:[true,"Please provide a ending date"]},
    note:{type:String, required:[true,"Please provide a note"]},
    status:{type:String, required:[true,"Please provide a status"]},
},{
    timestamps: true
});

const JobOpening = mongoose.model("JobOpening",socialMediaSchema);
export default JobOpening;