

import { error } from 'console';
import sendEmail from '../config/nodemailer.js';
import EmployeeDepartment from '../models/departmentModel.js';

const addEmployeeDepartment = async (req, res) => {
  const { name,status } = req.body;
  console.log(req.body)
  try {
    if (!req.body) {
      res.status(200).json({ success: false, message: "Data is required" });
    }
    // Check if department already exists
    const existingDepartment = await EmployeeDepartment.findOne({ name });
    if (existingDepartment) {
      return res.status(400).json({ success: false, errors:{ name: "Department already exists"} });
    } 
  const emp = await EmployeeDepartment.create({ name,status});
//   const emailText = `Hello ${user.name || "User"},\n\nThank you!`;
//   await sendEmail(email, "emplooye account created", emailText);
  res.status(200).json({success:true,message:"Employee Department Added Successfully"});
  }catch(error) {
    if (error.name === "ValidationError") {
      const errors = {};
      for (let field in error.errors) {
        errors[field] = error.errors[field].message;
      }
      return res.status(400).json({ errors });
    } else {
      res.status(500).json({ success: false, error: "Internal Server Error" });
    }
    console.log("error", error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

const getEmployeesDepartment = async (req, res) => {
  const data = await EmployeeDepartment.find();
  res.status(200).json({success:true,data});
};

const editEmployeeDepartment = async (req, res) => {
  const { id } = req.params;
  const { name, status } = req.body;
  if (!name || !status) {
    return res.status(400).json({ success: false, message: "Name and status are required" });
  }
  // Check if department exists
  const existingDepartment = await EmployeeDepartment.findById(id);
  if (!existingDepartment) {
    return res.status(404).json({ success: false, message: "Department not found" });
  }
  // Check if name already exists for another department
  if (name) {
    const departmentExists = await EmployeeDepartment.findOne({ name, _id: { $ne: id } });
    if (departmentExists) {
      return res.status(400).json({ success: false, errors: { name: "Department Exists name already exists" } });
    }
  }

  const updated = await EmployeeDepartment.findByIdAndUpdate(id, req.body,{
    new: true,
  });
  res.status(200).json({success:true,message:"uploaded successfully employee Department"});
};

const deleteEmployeeDepartment = async (req, res) => {
  
  const user =await EmployeeDepartment.findByIdAndDelete(req.params.id);
  if(!user)
  {
     res.status(204).json({ message: "Department not found" });
  }
  res.status(200).json({success:true, message: "Deleted Department Successfully"});
};

export  {

  addEmployeeDepartment,
  getEmployeesDepartment,
  editEmployeeDepartment,
  deleteEmployeeDepartment,

};