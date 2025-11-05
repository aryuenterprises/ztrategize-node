import { time } from 'console';
import mongoose from 'mongoose';

const leave = new mongoose.Schema({
  employeeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee',
    required:[true,"Employee Id required"],
  },
  leaveType: {
    type: String,
    // enum: ['sick', 'casual', 'earned'],
    required: [true, 'Leave type is required'],
  },
  leaveCategory:{
      type: String,
    // enum: ['sick', 'casual', 'earned'],
    // required: [true, 'Leave type is required'],
  },
  // subLeaveType:{
  //   type: String,
  //   required: [false, 'Leave type is required'],
  // },
  startDate: {
    type: Date,
    required:[true,"StartDate is required"],
  },
  endDate: {
    type: Date,
   
      required:[true,"EndDate is required"],
  },
   startTime: {
    type:String,
    // required: true,
  },
  endTime: {
    type:String,
    // required: true,
  },
  leaveReason: {
    type: String,
    required:[false, 'Leave reason is required'],
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending',
  },
  createdBy:{
    type:String,
    required:[false,"CreatedBy is required"],
  },
  note:{
    type:String
  },
  leaveDuration:[{
    date:{type:Date},
    subLeaveType:{type:String},
    // status:{type:String,enum:['pending', 'approved', 'rejected'],default:'pending'},
  }],
  
  
}, { timestamps: true });

function formatTimeToIST(dateString) {
  const date = new Date(dateString);
  return date.toLocaleTimeString("en-IN", {
    timeZone: "Asia/Kolkata",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
}
//  Pre-save middleware
leave.pre('save', function (next) {
  if (this.startTime) {
    this.startTime = formatTimeToIST(this.startTime);
  }
  if (this.endTime) {
    this.endTime = formatTimeToIST(this.endTime);
  }
  next();
});


const Leave = mongoose.model('Leave', leave);
export default Leave;
