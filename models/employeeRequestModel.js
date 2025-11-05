import mongoose from "mongoose";
const employeeRequest = new mongoose.Schema({
     employeeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee'},
      date:{
        type: Date,
        required:[true, 'Date is required'],
      },
      subject:{
        type:String,
        required:[true, 'Subject is required'],
      },
      message:{
        type:String,
        required:[true, 'Message is required'],
      },
      customSubject:{
        type:String,
        required:false
      },
      notes:{
        type:String,
        required:false
      },
      status:{
        type:String,
        default:'pending',
      },
      
},{ timestamps: true });
const EmployeeRequest = mongoose.model("EmployeeRequest", employeeRequest);
export default EmployeeRequest;