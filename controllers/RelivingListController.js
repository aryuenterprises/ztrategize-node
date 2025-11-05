import RelivingList from "../models/relivingCheckListModel.js";
const createRelivingList = async (req, res) => {
  try {
    const { name, type, options } = req.body;

    const newJoining = new RelivingList({
      name, type, options
    });

    const savedJoining = await newJoining.save();

    res.status(201).json({
      success: true,
      message: "Reliving created successfully",
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

const editRelivingList = async (req, res) => {
    try {
      const { id } = req.params;
      const updated = await RelivingList.findByIdAndUpdate(id, req.body, {
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

const getRelivingList = async (req, res) => {
  try {
    const joiningDetails = await RelivingList.find().sort({ createdAt: -1 });

    const formattedData = joiningDetails.map(item => ({
      ...item._doc,
      options: item.options.map(field => field.option)
    }));
    console.log("formattedData", formattedData);

    res.status(200).json({ success: true, data: formattedData });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

const deleteRelivingList = async (req, res) => {
  const { id } = req.params;
    try {
        const joiningDetails = await RelivingList.findByIdAndDelete(id);
        if (!joiningDetails) {
            return res.status(404).json({ success: false, message: "Joining not found" });
        }
        res.status(200).json({ success: true, message: "Joining deleted successfully" });
    } catch (err) {
        console.error("Error:", err);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

export { createRelivingList, getRelivingList, editRelivingList, deleteRelivingList };