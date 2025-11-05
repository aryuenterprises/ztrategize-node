import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema(
  {
    name: { type: String },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    employeeId: { type: String, required: false },
    verifyOtp: { type: Number, default: "" },
    verifyOtpExpireAt: { type: Number, default: 0 },
    isAccountVerified: { type: Boolean, default: false },
    resetOtp: { type: Number, default: "" },
    resetOtpExpireAt: { type: Number, default: 0 },
    resetToken: { type: String, default: "" },
    resetTokenExpireAt: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// Password encryption

// userSchema.pre('save', async function (next) {
//   if (!this.isModified('password')) return next();
//   const salt = await bcrypt.genSalt(10);
//   this.password = await bcrypt.hash(this.password, salt);
//   next();
// });

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  // If already hashed (bcrypt hashes always start with $2b$ or $2a$)
  if (this.password.startsWith("$2b$") || this.password.startsWith("$2a$")) {
    return next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// // Compare password
// userSchema.methods.matchPassword = async function (enteredPassword) {
//   return await bcrypt.compare(enteredPassword, this.password);
// };
//  Hash password before saving
// employee.pre("save", async function (next) {
//   if (!this.isModified("password")) return next();
//   const salt = await bcrypt.genSalt(10);
//   this.password = await bcrypt.hash(this.password, salt);
//   next();
// });
userSchema.index({ email: 1 });
const User = mongoose.model("AdminUser", userSchema);
export default User;
