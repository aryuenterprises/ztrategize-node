import mongoose from "mongoose";
const categoryDetails = new mongoose.Schema({
    title:{type:String,required:[true,"Please provide a title"]},
    status:{type:String, required: [true, "Please provide a status"]},

   
} ,{
    timestamps:true,
});
categoryDetails.index({ title: 1 }); // 1 = ascending

const CategoryDetails = mongoose.model("CategoryDetails",categoryDetails);
export default CategoryDetails;