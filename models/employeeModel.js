import mongoose from "mongoose";
import bcrypt from "bcrypt";
const employee = new mongoose.Schema(
  {
    photo: {
      type: String,
    },
    // Basic Information
    // fullname: { type: String, required: [true, 'Full Name is required'] },
    employeeName: {
      type: String,
      // trim: true,
      // required: [true, "Full Name is required"],
    },
    phoneNumber: {
      type: String,
      // required: [true, "Phone number is required"],
      // match: [/^[0-9]{5}-[0-9]{5}$/, "Phone must be in 00000-00000 format"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      // match: [/\S+@\S+\.\S+/, "Invalid email format"],
      // lowercase: true,
      // unique: true,
    },
    password: {
      type: String,
      // required: [true, "Password is required"],
      // minlength: [6, "Password must be at least 6 characters"],
    },

    employeeType: {
      type: String,
      // enum: ["Permanent", "Contract", "Intern"],
      // default: "Permanent",
    },
    internDuration: { type: String },
    // roles: {
    //   type: [String],
    //   default: [],
    //   // validate: [(array) => array.length > 0, "At least one role is required"],
    // },
    // roleId:{type:String},
    roleId: { type: mongoose.Schema.Types.ObjectId, ref: "EmployeeRole" },
    dateOfJoining: { type: Date },
    employeeId: {
      type: String,
    },

    personalEmail: {
      type: String,
    },

    // departmentTypeId:{type: mongoose.Schema.Types.ObjectId, ref: 'EmployeeDepartment'},
    passportNo: { type: String, default: "" },
    passportExpDate: { type: Date, default: "" },
    panNo: { type: String, default: "" },
    aadharNo: { type: String, default: "" },
    dateOfBirth: { type: Date },
    gender: { type: String },
    // maritalStatus: { type: String, enum: ["Single", "Married", "Divorced"] },
    maritalStatus: { type: String },
    spouseName: { type: String },
    fatherName: { type: String },
    motherName: { type: String },
    address1: { type: String },
    address2: { type: String },

    //reliving date
    relivingDate: { type: Date },
    expectedRelivingDate: { type: Date },
    relivingReason: { type: String },

    // PF Info
    uanNo: { type: String, default: "" },
    pfJoinDate: { type: Date },
    pfExpDate: { type: Date },
    // Insurance
    insuranceNo: { type: String, default: "" },
    insuranceDate: { type: Date },
    // Emergency Contact
    employeeStatus: { type: String, default: "1" },
    relivingDate: { type: Date },
    emergencyContact: {
      fullName: { type: String },
      contact: {
        type: String,
        // match: [/^[0-9]{10}$/, "Contact must be a valid 10-digit number"],
      },
      // relation: {
      //   type: String,
      //   enum: ["Father", "Mother", "Friend", "Sibling"],
      // },
      relation: {
        type: String,
      },
    },
    employeeType: { type: String },
    // Education Info
    education: [
      {
        schoolName: { type: String },
        departmentName: { type: String },
        endYear: { type: String },
        // endYear: {
        //   type: Number,
        //   min: [1950, "Invalid year"],
        //   max: [2100, "Invalid year"],
        // },
      },
    ],

    // Bank Info
    bank: {
      accountNo: {
        type: String,
        match: [/^\d{9,18}$/, "Invalid account number"],
      },
      bankName: { type: String },
      branch: { type: String },
      ifscCode: {
        type: String,
        // match: [/^[A-Z]{4}0[A-Z0-9]{6}$/, "Invalid IFSC Code"],
      },
      gpayNumber: { type: String },
    },

    // Salary Info
    salaryAmount: { type: Number, min: [0, "Salary must be positive"] },
    // paymentType: { type: String, enum: ["CASH", "BANK", "UPI"] },
    paymentType: { type: String },

    // Experience
    experience: [
      {
        jobTitle: { type: String },
        companyIndustry: { type: String },
        companyName: { type: String },
        previousSalary: { type: String },
        endWork: { type: String },
        startWork: { type: String },
        responsibilities: { type: String },
        // documents: [{ type: String, default: "" }],
        selectedDocs: [{ type: Object, default: {} }],
      },
    ],

    // Documents
    payslips: { type: [String], default: [] },
    appointmentLetter: { type: String },
    experienceLetter: { type: String },

    // Skills
    skills: { type: [String] },
    //  Document
    document: [
      {
        title: { type: String },
        // files: [ {type: String }], // array of files per document
        files: [{ type: Object }],
        //  uploadedAt: { type: Date, default: Date.now }
      },
    ],

    resignation_email_date: { type: String, required: false },
    notice_period: { type: String, required: false },
    last_working_date: { type: String, required: false },
    relieving_reason: { type: String, required: false },

    dutyStatus: { type: String, default: "1" },
    driveLink: { type: String },
    isVerify: {
      type: Number,
      default: 0, // 0 = not verified, 1 = verified
    },
    otp: {
      type: String,
      required: false,
    },
    otpExpiresAt: {
      type: Date,
      required: false,
    },
  },
  { timestamps: true }
);

// module.exports = mongoose.model("Employee", employee);

//  Hash password before saving
employee.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});
employee.index({ email: 1, phoneNumber: 1 }); // Compound index
employee.index({ employeeId: 1 });
const Employee = mongoose.model("Employee", employee);
export default Employee;
