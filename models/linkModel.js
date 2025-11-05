import mongoose from "mongoose";
const linkSchema = new mongoose.Schema({
    category:{type:String,required:[true,"Please provide a category"]},
    url:{type:String,required:[true,"Please provide a url"]},
    title:{type:String, required: [true, "Please provide a title"]},
},{
    timestamps:true,
});
const LinkSchema = mongoose.model("LinkSchema",linkSchema);

export default LinkSchema;