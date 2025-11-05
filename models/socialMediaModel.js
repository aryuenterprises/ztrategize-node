import mongoose from "mongoose";
const socialMediaSchema = new mongoose.Schema({
    name:{type:String,required:[true,"Please provide a name"]},
    status:{type:String, default:"1", required:[true,"Please provide a status"]},
},{
    timestamps: true
});

const SocialMedia = mongoose.model("SocialMedia",socialMediaSchema);
export default SocialMedia;