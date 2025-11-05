import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const settingsSchema = new mongoose.Schema(
  {

    gst_percent: { type: Number, required: [false, "Please provide a gst"] },
    payroll_basic_percent: {
      type: Number,
      required: [false, "Please provide a payroll basic percent"],
    },
    payroll_hra_percent: {
      type: Number,
      required: [false, "Please provide a payroll hra"],
    },
    payroll_medicalAllowance: {
      type: Number,
      required: [false, "Please provide a payroll medical Allowance"],
    },
    payroll_conveyanceAllowance: {
      type: Number,
      required: [false, "Please provide a gst"],
    },
    payroll_eepf_percent: {
      type: Number,
      required: [false, "Please provide a  payroll eepf"],
    },
    payroll_erpf_percent: {
      type: Number,
      required: [false, "Please provide a payroll erpf"],
    },
    payroll_eeesi_percent: {
      type: Number,
      required: [false, "Please provide a payroll erpf"],
    },
    payroll_eresi_percent: {
      type: Number,
      required: [false, "Please provide a payroll erpf"],
    },

//     gst_percent: { type: Number },
//     payroll_basic_percent: { type: Number },
//     payroll_hra: { type: Number },
//     payroll_medicalAllowance: { type: Number },
//     payroll_conveyanceAllowance: { type: Number },
//     payroll_eepf_percent: { type: Number },
//     payroll_erpf_percent: { type: Number },
//     payroll_eeesi_percent:{type:Number},
//     payroll_eresi_percent:{type:Number},
    date_format:{type:String},
    password: { type: String },

    //leave settings
    unhappy_leave: { type: Number },
    unhappy_leave_option:{type:String},
    casual_leave: { type: Number },
    complementary_leave: { type: Number },
    wfh_leave: { type: Number },
    permission:{type:Number}

  },
  {
    timestamps: true,
  }
);

// Hash password before saving
settingsSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

// Compare passwords later (for login checks, optional)
settingsSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const Settings = mongoose.model("Settings", settingsSchema);
export default Settings;
