import mongoose from "mongoose";


const attendance = new mongoose.Schema({
  date: { type: Date , default: Date.now }, // stores date + time by default
  shift: { type: String },
  workType: { type: String },
  entries: [
    {
      reason: { type: String},     // 'login', 'break in', 'break out', 'logout'
      time: { type: Date, default: Date.now }          // exact timestamp
    }
  ],
  comments: [{ type: String }],
  employeeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee'},
  editTime:[{
    // reson:{type:String},
    updatedBy:{type:String},
    updatedTime:{type:Date,default:new Date()}

  }]
}, {
  timestamps: true // adds createdAt and updatedAt fields
});
// Index to speed up queries on employee + date (useful for daily lookups)

attendance.index({ employeeId: 1,createdAt: -1});

const Attendance = mongoose.model("Attendance", attendance);
export default Attendance;




