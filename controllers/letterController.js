import mongoose from "mongoose";
import Employee from "../models/employeeModel.js";
import LetterSchema from "../models/letterModel.js";
import LetterDetails from "../models/letterModel.js";
const createLetter = async (req, res) => {
    try{
        const {title,subject,content,status}= req.body;
        const letterDetails = new LetterDetails({
            title,subject,content,status
        });
        const saveLetter = await letterDetails.save();
        res.status(201).json({
      success: true,
      message: "Link created successfully",
      data: saveLetter,
    });
    }catch (error) {
    if (error.name === "ValidationError") {
      const errors = {};
      for (let field in error.errors) {
        errors[field] = error.errors[field].message;
      }
      return res.status(400).json({ success: false, errors });
    }
    console.error("Error:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

const getLetterDetails = async (req, res) => {
    try{
      const letterDetails = await LetterDetails.find({});
      res.status(200).json({ success: true, data: letterDetails });
    }
    catch(error){
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

const editLetterDetails = async (req, res) => {
  const { id } = req.params;
  try {
    const updated = await LetterDetails.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updated) {
      return res
        .status(404)
        .json({ success: false, message: "Details not found" });
    }
    res
      .status(200)
      .json({ success: true, message: "uploaded successfully  details" });
  } catch (error) {
    if (error.name === "ValidationError") {
      const errors = {};
      for (let field in error.errors) {
        errors[field] = error.errors[field].message;
      }
      return res.status(400).json({ success: false, errors });
    }
    console.error("Error:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

const letterDelete = async (req, res) => {
  const { id } = req.params;
  try {
    const letterDetails = await LetterDetails.findByIdAndDelete(id);
    if (!letterDetails) {
      return res.status(404).json({ success: false, message: "letterDetails not found" });
    }
    res.status(200).json({ success: true, message: "letterDetails deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// 🔹 Utility function: Convert number to words
function numberToWords(num) {
  const a = [
    "", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten",
    "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen",
    "Eighteen", "Nineteen"
  ];
  const b = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];

  function inWords(n) {
    if (n < 20) return a[n];
    if (n < 100) return b[Math.floor(n / 10)] + (n % 10 ? " " + a[n % 10] : "");
    if (n < 1000) return a[Math.floor(n / 100)] + " Hundred" + (n % 100 ? " " + inWords(n % 100) : "");
    if (n < 100000) return inWords(Math.floor(n / 1000)) + " Thousand" + (n % 1000 ? " " + inWords(n % 1000) : "");
    if (n < 10000000) return inWords(Math.floor(n / 100000)) + " Lakh" + (n % 100000 ? " " + inWords(n % 100000) : "");
    return inWords(Math.floor(n / 10000000)) + " Crore" + (n % 10000000 ? " " + inWords(n % 10000000) : "");
  }

  // Handle decimals (paise)
  const [rupees, paise] = num.toString().split(".");
  let words = inWords(parseInt(rupees)) + " Rupees";

  if (paise && parseInt(paise) > 0) {
    words += " and " + inWords(parseInt(paise)) + " Paise";
  }

  return words.trim() + " Only";
}

// 🔹 Controller
// const letterTemplate = async (req, res) => {
//   console.log("Request Params:", req.params.id);

//   try {
//     // Fetch template
//     const template = await LetterSchema.findOne({ title: "INTERNSHIP OFFER  LETTER" });

//     if (!template || template.status === "0") {
//       return res.status(404).json({
//         success: false,
//         message: "Template not found or inactive",
//       });
//     }

//     // Placeholder replacement
//     function fillTemplate(content, values) {
//       return content.replace(/\[([^\]]+)]/g, (match, key) => {
//         return values[key] || match; // Keep placeholder if value not found
//       });
//     }

//     // Fetch employee with role & department populated
//     const employee = await Employee.findById(req.params.id)
//       .populate({
//         path: "roleId",
//         model: "EmployeeRole",
//         populate: {
//           path: "departmentId",
//           model: "EmployeeDepartment",
//         },
//       });

//     if (!employee) {
//       return res.status(404).json({
//         success: false,
//         message: "Employee not found",
//       });
//     }

//     // Replace placeholders with actual values
//     const values = {
//       EMP_NAME: employee.employeeName,
//       EMP_ADDRESS: employee.address1,
//       DEPARTMENT: employee.roleId?.departmentId?.name || "N/A",
//       ROLE: employee.roleId?.name || "N/A",
//       JOINING_DATE: employee.dateOfJoining?.toISOString().split("T")[0] || "N/A",
//       SALARY: employee.salaryAmount,
//       SALARY_IN_WORDS: numberToWords(employee.salaryAmount),
//     };

//     // Fill template
//     const filledLetter = fillTemplate(template.content, values);

//     res.status(200).json({
//       success: true,
//       data: filledLetter,
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({
//       success: false,
//       message: "Internal Server Error",
//     });
//   }
// };
const letterTemplate = async (req, res) => {
  console.log("Request Params:", req.params.id);
const {id} = req.query;
  try {
    // Fetch template
    const template = await LetterSchema.findById(id);

    if (!template || template.status === "0") {
      return res.status(404).json({
        success: false,
        message: "Template not found or inactive",
      });
    }
    console.log(template);
    function fillTemplate(content, values) {
      return content.replace(/\[([^\]]+)]/g, (match, key) => {
        return values[key] || match;
      });
    }
    const employee = await Employee.findById(req.params.id)
      .populate({
        path: "roleId",
        model: "EmployeeRole",
        populate: {
          path: "departmentId",
          model: "EmployeeDepartment",
        },
      });
      console.log(employee);
    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found",
      });
    }
    const values = {
      EMP_NAME: employee.employeeName,
      EMP_ID: employee.employeeId,
      EMP_ADDRESS: employee.address1,
      DEPARTMENT: employee.roleId?.departmentId?.name || "N/A",
      EMP_POSITION: employee.roleId?.name || "N/A",
      EMP_JOINING_DATE: employee.dateOfJoining?.toISOString().split("T")[0] || "N/A",
      SALARY: employee.salaryAmount,
      SALARY_IN_WORDS: numberToWords(employee.salaryAmount),

      // EMP_POSITION:
      // GENDER:employee.employee.gender

      EMP_RELEAVING_DATE: employee.relivingDate?.toISOString().split("T")[0] || "N/A",
      GENDER: employee.gender === "male" ? "his" : (employee.gender === "female" ? "her" : "") || "N/A",

    };
    // Fill template
    const filledLetter = fillTemplate(template.content, values);
    res.status(200).json({
      success: true,
      employee: values,
      title: template.title,
      data: filledLetter,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};







export { createLetter, getLetterDetails, editLetterDetails, letterDelete ,letterTemplate};