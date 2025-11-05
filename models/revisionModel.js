import mongoose from "mongoose";
const revisionSchema = new mongoose.Schema({
    employeeId: { type: mongoose.Schema.Types.ObjectId, ref: "Employee" },
    revision_date:{type: Date, required: [false, "Please provide a revision date"]},
    percentage:{type:String, required: [false, "Please provide a percentage"]},
    current_salary:{type:String,required: [false, "Please provide a current salary"]},
    revised_salary:{type:String,required: [false, "Please provide a revised salary"]},
    next_revision_date:{type:Date,required: [false, "Please provide a next revision date"]},
    revision_notes:{type:String,required: [false, "Please provide a revision notes"]},
},{
    timestamps: true,
});
revisionSchema.index({employeeId:1})
const Revision = mongoose.model("Revision", revisionSchema);
export default Revision;