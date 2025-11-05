import dotenv from "dotenv";
import User from "../models/userModel.js";
import sendEmail from "../config/nodemailer.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import crypto from "crypto";
import ClientDetails from "../models/clientModals.js";

const createUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    // 1. Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // 2. Create user
    const user = new User({ name, email, password });
    await user.save();

    // 3. Generate JWT Token

    const token = jwt.sign(
      { userId: user._id, email: user.email, password: user.password },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );


    // 4. Set token in cookies
    res.cookie("token", token, {
      httpOnly: true, // cookie cannot be accessed by client-side JS
      secure: process.env.NODE_ENV === "development", // set true in production with HTTPS
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });

    await sendEmail(process.env.EMAIL_USER, "welcome", "register");
    // 5. Send response
    res.status(200).json({
      message: "User created successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
      },
      token, // optional, if you also want to send token in JSON
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// const loginUser = async (req, res) => {
//   try {
//     const { email, password } = req.body;
//     console.log(req.body);
//     // 1. Check if user exists
//     const user = await User.findOne({ email });
//     if (!user) {
//       return res.status(400).json({sucees:"false",email:'Invalid email'});
//     }

//     // 2. Compare password
//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) {
//       return res.status(400).json({sucees:"false", password: 'Invalid password' });
//     }
//     // 3. Generate JWT
//     const token = jwt.sign({ userId: user._id, email: user.email }, process.env.JWT_SECRET, {
//       expiresIn: '1d'
//     });
//     // 4. Set cookie
//     res.cookie('token', token, {
//       httpOnly: true,
//       secure: process.env.NODE_ENV === 'production',
//       maxAge: 24 * 60 * 60 * 1000
//     });
//     // 5. Return user info (no password)
//     res.status(200).json({
//       sucess:true,
//       message: 'Login successful',
//       user: {
//         _id: user._id,
//         // name: user.name,
//         email: user.email,
//         name:user.name,
//         // hrpermission:user.hrpermission
//       },
//       token:token,
//     });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: 'Server error' });
//   }
// };

const logoutUser = (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "development",
    sameSite: "strict",
  });
  res.status(200).json({ message: "Logged out successfully" });
};

// const loginUser = async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     // 1. Find user with aggregation + lookup

//     const userData = await User.aggregate([
//       { $match: { email: email } },
//       {
//         $lookup: {
//           from: "hrpermissionmodules",
//           let: { empId: "$employeeId" },
//           pipeline: [
//             {
//               $match: {
//                 $expr: {
//                   $eq: [{ $toString: "$employeeId" }, "$$empId"], // convert ObjectId → string
//                 },
//               },
//             },
//           ],
//           as: "hrpermission",
//         },
//       },
//     ]);

//     if (!userData || userData.length === 0) {
//       return res.status(400).json({ success: false, email: "Invalid email" });
//     }

//     const user = userData[0];

//     // 2. Compare password
//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) {
//       return res
//         .status(400)
//         .json({ success: false, password: "Invalid password" });
//     }

//     // 3. Generate JWT
//     const token = jwt.sign(
//       { userId: user._id, email: user.email },
//       process.env.JWT_SECRET,
//       { expiresIn: "1d" }
//     );

//     // 4. Set cookie
//     res.cookie("token", token, {
//       httpOnly: true,
//       secure: process.env.NODE_ENV === "production",
//       maxAge: 24 * 60 * 60 * 1000,
//     });

//     // 5. Return user info
//     res.status(200).json({
//       success: true,
//       message: "Login successful",
//       user: {
//         _id: user._id,
//         email: user.email,
//         name: user.name,
//         employeeId: user.employeeId,
//         hrpermission: user.hrpermission,
//         superUser : user.superUser || false,
//       },
//       token,
//     });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Server error" });
//   }
// };
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    let userData = null;
    let userType = "";

    const employee = await User.aggregate([
      { $match: { email: email } },
      {
        $lookup: {
          from: "hrpermissionmodules",
          let: { empId: "$employeeId" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: [{ $toString: "$employeeId" }, "$$empId"],
                },
              },
            },
          ],
          as: "hrpermission",
        },
      },
    ]);

    if (employee && employee.length > 0) {
      userData = employee[0];
      userType = "user";
    }

    if (!userData) {
      const client = await ClientDetails.aggregate([{ $match: { email: email } }]);
      if (client && client.length > 0) {
        userData = client[0];
        userType = "client";
      }
    }

    if (!userData) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, userData.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: "Invalid password" });
    }

    // 5️⃣ Generate JWT token
    const token = jwt.sign(
      { userId: userData._id, email: userData.email, type: userType },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    // 6️⃣ Set cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 24 * 60 * 60 * 1000,
    });

    if (userType === "user") {
      return res.status(200).json({
        success: true,
        message: "Employee login successful",
        redirect: "/dashboard",
        user: {
          _id: userData._id,
          name: userData.name,
          email: userData.email,
          employeeId: userData.employeeId,
          hrpermission: userData.hrpermission,
          superUser: userData.superUser || false,
        },
        token,
      });
    } else {
      return res.status(200).json({
        success: true,
        message: "Client login successful",
        redirect: "/client-dashboard",
        user: {
          _id: userData._id,
          name: userData.client_name,
          email: userData.email,
          companyName: userData.company_name,
          type: "client",
        },
        token,
      });
    }
  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
const sendVerifyOtp = async (req, res) => {
  try {
    const { email } = req.body;
    console.log("vvv", req.body);

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000);
    const expiresAt = Date.now() + 10 * 60 * 1000;

    // Update user with OTP
    user.verifyOtp = otp;
    user.verifyOtpExpireAt = expiresAt;

    // Send email
    const emailText = `Hello ${
      user.name || "User"
    },\n\nYour verification OTP is: ${otp}\nIt will expire in 10 minutes.\n\nThank you!`;

    await sendEmail(email, "Your Verification OTP", emailText);

    await user.save();

    res.status(200).json({
      message: "OTP sent successfully",
      otp: process.env.NODE_ENV === "development" ? otp : undefined,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    // Check if OTP is expired
    if (Date.now() > user.verifyOtpExpireAt) {
      return res.status(400).json({ message: "OTP expired" });
    }

    // Check if OTP matches
    if (user.verifyOtp !== parseInt(otp)) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    // Mark user as verified
    user.isAccountVerified = true;
    user.verifyOtp = "";
    user.verifyOtpExpireAt = 0;
    await user.save();

    res.status(200).json({ message: "Account verified successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

const sendResetOtp = async (req, res) => {
  try {
    const { email } = req.body;

    // 1. Check if user exists and verified
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });
    if (!user.isAccountVerified)
      return res.status(403).json({ message: "Account is not verified" });

    // 2. Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000);
    const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes

    // 3. Save to user
    user.resetOtp = otp;
    user.resetOtpExpireAt = expiresAt;
    await user.save();

    // 4. Send email
    const text = `Hello ${
      user.name || "User"
    },\n\nYour password reset OTP is: ${otp}\nIt will expire in 10 minutes.\n\nThank you.`;

    await sendEmail(email, "Password Reset OTP", text);

    res.status(200).json({
      message: "Reset OTP sent to your email",
      otp: process.env.NODE_ENV === "development" ? otp : undefined,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    // 1. Find user
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    // 2. Check if OTP is expired
    if (Date.now() > user.resetOtpExpireAt) {
      return res.status(400).json({ message: "OTP expired" });
    }

    // 3. Check if OTP matches
    if (user.resetOtp !== parseInt(otp)) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    // 4. Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // 5. Update password & clear OTP
    user.password = hashedPassword;
    user.resetOtp = "";
    user.resetOtpExpireAt = 0;
    await user.save();

    res.status(200).json({ message: "Password reset successful" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

const forgotPassword = async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ message: "User not found" });

  // Generate secure random token
  const resetToken = crypto.randomBytes(32).toString("hex");
  const hashedToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  user.resetToken = hashedToken;
  user.resetTokenExpireAt = Date.now() + 60 * 60 * 1000; // valid for 1 hour
  await user.save();

  const resetURL = `https://yourfrontend.com/reset-password?token=${resetToken}&email=${email}`;

  const message = `Hello ${
    user.name || "User"
  },\n\nYou requested to reset your password.\nPlease click the link below or paste it into your browser:\n\n${resetURL}\n\nThis link will expire in 1 hour.\n\nThank you!`;

  await sendEmail(email, "Password Reset Link", message);

  res.status(200).json({ message: "Password reset link sent to email" });
};

const resetPasswordWithToken = async (req, res) => {
  const { token, email, newPassword } = req.body;

  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  const user = await User.findOne({
    email,
    resetToken: hashedToken,
    resetTokenExpireAt: { $gt: Date.now() },
  });

  if (!user)
    return res.status(400).json({ message: "Invalid or expired reset link" });

  // Hash and update password
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(newPassword, salt);

  // Clear token fields
  user.resetToken = "";
  user.resetTokenExpireAt = 0;
  await user.save();

  res.status(200).json({ message: "Password reset successful" });
};
// change password functionality
const adminChangePassword = async (req, res) => {
  const { id, newPassword } = req.body;
  console.log(req.body);
  console;
  try {
    // 1. Find user
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: "User not found" });
    // 2. Hash new password
    user.password = newPassword;
    await user.save();
    res
      .status(200)
      .json({ success: true, message: "Password changed successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export {
  createUser,
  loginUser,
  logoutUser,
  sendVerifyOtp,
  verifyOtp,
  sendResetOtp,
  resetPassword,
  resetPasswordWithToken,
  forgotPassword,
  adminChangePassword,
};
