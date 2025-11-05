import mongoose from "mongoose";

const taskCommentsSchema = new mongoose.Schema(
  {
    comment: {
      type: String,
      required: [true, "Please type comment is required"], //  fixed typo: `require` → `required`
    },
    document: [
      {
        type: Object, // You might want to define a schema here if structure is known
      },
    ],
    taskId: {
      type:String,required:[true,"Please provied TaskId"]
     
    },
    createdBy:{
       type: mongoose.Schema.Types.ObjectId,
        ref: "Employee",
        required:[true,"Please provied TaskId"]
      }
  },
  { timestamps: true }
);

taskCommentsSchema.index({taskId:1});

const TaskComments = mongoose.model("TaskComments", taskCommentsSchema);
export default TaskComments;
