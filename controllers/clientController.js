import ClientDetails from "../models/clientModals.js";
import ProjectDetails from "../models/projectModel.js";
import Settings from "../models/settings.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { create } from "domain";

const loginClient = async (req, res) => {
  try {
    const { email, password } = req.body;

    let user = await ClientDetails.aggregate([
      {
        $match: { email: email },
      },
      // {
      //   $lookup: {
      //     from: "employeeroles",
      //     localField: "roleId",
      //     foreignField: "_id",
      //     as: "role",
      //   },
      // },
      // {
      //   $unwind: {
      //     path: "$role",
      //     preserveNullAndEmptyArrays: true,
      //   },
      // },
      // {
      //   $lookup: {
      //     from: "employeedepartments",
      //     localField: "role.departmentId",
      //     foreignField: "_id",
      //     as: "department",
      //   },
      // },
      // {
      //   $unwind: {
      //     path: "$department",
      //     preserveNullAndEmptyArrays: true,
      //   },
      // },
      // {
      //   $lookup: {
      //     from: "hrpermissionmodules",
      //     let: { empId: "$_id" },
      //     pipeline: [
      //       {
      //         $match: {
      //           $expr: {
      //             $eq: ["$employeeId", "$$empId"],
      //           },
      //         },
      //       },
      //     ],
      //     as: "hrpermission",
      //   },
      // },

      // {
      //   $project: {
      //     employeeName: 1,
      //     email: 1,
      //     employeeStatus: 1,
      //     password: 1,
      //     _id: 1,
      //     role: {
      //       name: "$role.name",
      //       status: "$role.status",
      //     },
      //     department: "$department",
      //     photo: 1,
      //     dutyStatus: 1,
      //     employeeId: 1,
      //     hrpermission: 1,
      //   },
      // },
    ]);

    if (!user || user.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const userData = user[0];

    // if (userData.employeeStatus !== "1") {
    //   return res.status(403).json({
    //     success: false,
    //     message: "Your account is inactive. Please contact HR.",
    //   });
    // }

    const isMatch = await bcrypt.compare(password, userData.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }

    const token = jwt.sign(
      { userId: userData._id, email: userData.email },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 24 * 60 * 60 * 1000,
    });

    // Extract hrpermission from userData if available
    // const hrpermission = userData.hrpermission || [];

    res.status(200).json({
      message: "Login successful",
      user: {
        _id: userData._id,
        name: userData.client_name,
        email: userData.email,
        companyName: userData.company_name,
      },
      token: token,
    });
  } catch (err) {
    console.error("Login Error:", err);

    res.status(500).json({ message: "Server error" });
  }
};

const addClientDetails = async (req, res) => {
  console.log("Incoming req.body:", req.body); // ← Add this for debugging

  try {
    console.log("req body", req.body);


    const {
      client_name,
      company_name,
      email,
      phone_number,
      address,
      country,
      contact_person,
      contact_person_role,
      website,
      status,
      notes,
      gst,
      password,
      
    } = req.body;

    const clientDetails = await ClientDetails.create({
      client_name,
      company_name,
      email,
      phone_number,
      address,
      country,
      contact_person,
      contact_person_role,
      website,
      status,
      notes,
      gst,
      password,
      is_deleted: false,
    });

    return res.status(201).json({ success: true, data: clientDetails });
  } catch (error) {
    console.error("Error:", error);

    if (error.name === "ValidationError") {
      const errors = {};
      for (let field in error.errors) {
        errors[field] = error.errors[field].message;
      }
      return res.status(400).json({ success: false, errors });
    }

    return res.status(500).json({ success: false, message: error });
  }
};


const getClientDetails = async (req, res) => {
  try {
    const clientDetails = await ClientDetails.find({ is_deleted: false }).sort({
      is_deleted: -1,
      createdAt: -1,
    });
    const setting = await Settings.find({});
    res.status(200).json({ success: true, data: clientDetails, setting:setting });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
const getClientDetailsById = async (req, res) => {
  const { id } = req.params;
  try {
    const clientDetails = await ClientDetails.findById(id);
    if (!clientDetails) {
      return res
        .status(404)
        .json({ success: false, message: "Client not found" });
    }
    res.status(200).json({ success: true, data: clientDetails });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}
const editClientDetails = async (req, res) => {
  const { id } = req.params;
  try {
    const updated = await ClientDetails.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updated) {
      return res
        .status(404)
        .json({ success: false, message: "Client not found" });
    }
    res
      .status(200)
      .json({ success: true, message: "uploaded successfully client details" });
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
const deleteClientDetails = async (req, res) => {
  const { id } = req.params;
  try {
    const updated = await ClientDetails.findByIdAndUpdate(
      id,
      { is_deleted: true },
      { new: true }
    );
    if (!updated)
      return res
        .status(404)
        .json({ success: false, message: "Client not found" });

    res
      .status(200)
      .json({
        success: true,
        message: "Client details deleted successfully",
        data: updated,
      });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
//add notes
const addNotes = async (req, res) => {
  const { id } = req.params;
  const { note } = req.body;
  const updated = await ClientDetails.findByIdAndUpdate(
    id,
    { $push: { notes: { note: note, time: new Date() } } },
    { new: true }
  );
  res.status(200).json({ success: true, data: updated });
};
export {
  addClientDetails,
  getClientDetails,
  editClientDetails,
  deleteClientDetails,
  addNotes,
  loginClient,
  getClientDetailsById
};
