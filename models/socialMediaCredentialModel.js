import mongoose from "mongoose";
const socialMediaSchema = new mongoose.Schema({
    account :{type: mongoose.Schema.Types.ObjectId, ref: "SocialMedia"},
    title:{type:String,required:[true,"Please provide a title"]},
    url:{type:String, required:[true,"Please provide a url"]},
    email:{type:String, required:[false,"Please provide an email"]},
    password:{type:String, required:[false,"Please provide a password"]},
    username:{type:String, required:[false,"Please provide a username"]},
    recovery_email:{type:String, required:[false,"Please provide a recovery email"]},
    recovery_phone:{type:String, required:[false,"Please provide a recovery phone"]},
    recovery_backup_code:{type:String, required:[false,"Please provide a recovery backup code"]},
    note:{type:String, required:[false,"Please provide a note"]},
},{
    timestamps: true,
});

const SocialMediaCredential = mongoose.model("SocialMediaCredential",socialMediaSchema);
export default SocialMediaCredential;