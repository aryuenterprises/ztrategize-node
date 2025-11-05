import JoiningModel from "../models/joiningModel.js";
const createJoining = async (req, res) => {
  try {
    const { title, input, inputField } = req.body;

    const newJoining = new JoiningModel({
      title,
      input,
      inputField
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

const editJoining = async (req, res) => {
    try {
      const { id } = req.params;
      const updated = await JoiningModel.findByIdAndUpdate(id, req.body, {
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

const getJoiningList = async (req, res) => {
  try {
    const joiningDetails = await JoiningModel.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: joiningDetails });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

const deleteJoining = async (req, res) => {
  const { id } = req.params;
    try {
        const joiningDetails = await JoiningModel.findByIdAndDelete(id);
        if (!joiningDetails) {
            return res.status(404).json({ success: false, message: "Joining not found" });
        }
        res.status(200).json({ success: true, message: "Joining deleted successfully" });
    } catch (err) {
        console.error("Error:", err);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

export { createJoining, getJoiningList, editJoining, deleteJoining };