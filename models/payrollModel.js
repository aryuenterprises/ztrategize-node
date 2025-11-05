import mongoose from "mongoose";
import Employee from "./employeeModel";
const payrollSchema=new mongoose.Schema({
    employee:{type:mongoose.Schema.Types.ObjectId,ref:"Employee",required:true},
    grossSalary:{type:Number,required:true},    
    isMetro:{type:Boolean,default:true},
    basicPercent:{type:Number,default:50},
    conveyanceFixed:{type:Number,default:1600},
    medicalFixed:{type:Number,default:1250},
    bonus:{type:Number,default:0},
    benefits:{type:Number,default:0},
    basic:{type:Number,required:true},
    hra:{type:Number,required:true},
    conveyance:{type:Number,required:true},
    medical:{type:Number,required:true},
    otherAllowances:{type:Number,required:true},
    erPf:{type:Number,required:true},
    eePf:{type:Number,required:true},   
    eps:{type:Number,required:true},
    eeEsi:{type:Number,required:true},
    erEsi:{type:Number,required:true},
})