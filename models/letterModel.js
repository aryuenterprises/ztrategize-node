import mongoose from "mongoose";
const letterSchema = new mongoose.Schema({
    title:{type:String, required:[true,"Please provide the Title"]},
    subject:{type:String, required:[true,"Please provide the Subject"]},
    content:{type:String, required:[true,"Please provide the Content"]},
    status:{type: String, default:"1"}
},{
    timestamps:true,
});
const LetterSchema = mongoose.model("LetterSchema",letterSchema);
export default LetterSchema;