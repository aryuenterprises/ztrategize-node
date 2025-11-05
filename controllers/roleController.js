
import EmployeeRole from '../models/employeeRoleModel.js'
import sendEmail from '../config/nodemailer.js';

const addEmployeeRole = async (req, res) => {
  const { name,status,departmentId } = req.body;
  console.log(req.body)
  try{
  //   if(!req.body){
  //      res.status(200).json({success:false,message:"Data is required"});
  //   }
  //    const emp = await EmployeeRole.create({ name,status,departmentId});
  //    await emp.save
  // const emailText = `Hello ${user.name || "User"},\n\nThank you!`;
  // await sendEmail(email, "emplooye account created", emailText);
  //   res.status(200).json({success:true,message:"Employee Role Added Successfully"});
   if (!req.body || Object.keys(req.body).length === 0) {
    return res.status(200).json({ success: false, message: "Data is required" });
  }

  const { name, status, departmentId } = req.body;
  // Check if role already exists
  const existingRole = await EmployeeRole.findOne({ name });
  if (existingRole) {         
    return res.status(400).json({ success: false, errors: { name: "Role already exists" } });
  }

  const emp = new EmployeeRole({ name, status, departmentId });
  await emp.save(); // <-- .save() used here

  // Optional email logic
  // const emailText = `Hello ${user.name || "User"},\n\nThank you!`;
  // await sendEmail(email, "Employee account created", emailText);

  res.status(200).json({ success: true, message: "Employee Role Added Successfully" });

  }
  catch(error){
     if (error.name === "ValidationError") {
      const errors = {};
      for (let field in error.errors) {
        errors[field] = error.errors[field].message;
      }
      return res.status(400).json({ errors });
    } else {
      res.status(500).json({ success: false, error: "Internal Server Error" });
    }
    console.log("error",error);
    return res.status(500).json({success:false,message:"Internal Server Error"});
  }
 
};

const getEmployeesRole = async (req, res) => {
  const data = await EmployeeRole.find().populate("departmentId");
  res.status(200).json({success:true,data});
};

const editEmployeeRole = async (req, res) => {
  const { id } = req.params;
  // Check if the role exists
  const existingRole = await EmployeeRole.findOne({ _id: id });
  if (!existingRole) {
    return res.status(404).json({ success: false, message: "Role not found" });
  } 
  // Check if the new name already exists
  const { name } = req.body;  
  if (name) {
    const roleExists = await EmployeeRole.findOne({ name, _id: { $ne: id } });
    if (roleExists) {
      return res.status(400).json({ success: false, errors: { name: "Role name already exists" } });
    }
  }
  // Update the role
  const updated = await EmployeeRole.findByIdAndUpdate(id, req.body,{
    new: true,
  });
  res.status(200).json({success:true,message:"uploaded successfully employee role"});
};

const deleteEmployeeRole = async (req, res) => {
    
  await EmployeeRole.findByIdAndDelete(req.params.id);
  res.json({success:true, message: "Deleted" });
};

export  {
  addEmployeeRole,
  getEmployeesRole,
  editEmployeeRole,
  deleteEmployeeRole,
};