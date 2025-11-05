import JoiningVerifyModel from "../models/joiningVerifyModel.js";
import joiningModel from "../models/joiningModel.js";
const createJoiningVerify = async (req, res) => {
  try {
    const { verify } = req.body;

    const newJoining = new JoiningVerifyModel({
     verify
    });

    const savedJoining = await newJoining.save();

    res.status(201).json({
      success: true,
      message: "Joining created successfully",
      data: savedJoining,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

const editJoiningVerify = async (req, res) => {
    try {
      const { id } = req.params;
      const updated = await JoiningVerifyModel.findByIdAndUpdate(id, req.body, {
        new: true,
        runValidators: true,
      });
      if (!updated) {
        return res
          .status(404)
          .json({ success: false, message: "Joining not found" });
      }
      res
        .status(200)
        .json({ success: true, message: "Joining updated successfully" });
    } catch (error) {
      console.error("Error:", error);
      res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}

const getJoiningVerifyList = async (req, res) => {
  try {
    const joiningDetails = await JoiningVerifyModel.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: joiningDetails });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

const deleteJoiningVerify = async (req, res) => {
  const { id } = req.params;
    try {
        const joiningDetails = await JoiningVerifyModel.findByIdAndDelete(id);
        if (!joiningDetails) {
            return res.status(404).json({ success: false, message: "Joining not found" });
        }
        res.status(200).json({ success: true, message: "Joining deleted successfully" });
    } catch (err) {
        console.error("Error:", err);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

const getTitleList = async (req, res) => {
try {
        const leaveTypes = await joiningModel.find().select("title input inputField").sort({ createdAt: -1 });
        if (!leaveTypes || leaveTypes.length === 0) {
        return res.status(404).json({ success: false, message: "No title found" });
        }
        res.status(200).json({ success: true, data: leaveTypes });
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
}

export { createJoiningVerify, getJoiningVerifyList, editJoiningVerify, deleteJoiningVerify,getTitleList };