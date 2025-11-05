import Communication from "../models/communicationModel.js";
const createCommunication = async (req, res) => {
    try{
        const{date,notes,employeeId} = req.body;
        const communication = await Communication.create({date,notes,employeeId});
        res.status(200).json({success:true,data:communication});
    }catch (error) {
    if (error.name === "ValidationError") {
      const errors = {};
      for (let field in error.errors) {
        errors[field] = error.errors[field].message;
      }
      return res.status(400).json({ success: false, errors });
    }
    return res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
};

const getCommunication = async (req, res) => {
      const { id } = req.params;
    try{
        const communication = await Communication.find({employeeId:id}).populate("employeeId", "employeeName");
        res.status(200).json({success:true,data:communication});
    }catch (error) {
    if (error.name === "ValidationError") {
      const errors = {};
      for (let field in error.errors) {
        errors[field] = error.errors[field].message;
      }
      return res.status(400).json({ success: false, errors });
    }
    return res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
};

const editCommunication = async (req, res) => {
    try{
        const communication = await Communication.findByIdAndUpdate(req.params.id,req.body,{new:true});
        res.status(200).json({success:true,data:communication});
    }catch (error) {
    if (error.name === "ValidationError") {
      const errors = {};
      for (let field in error.errors) {
        errors[field] = error.errors[field].message;
      }
      return res.status(400).json({ success: false, errors });
    }
    return res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
};

const communicationDelete = async (req, res) => {
  const { id } = req.params;
  try {
    const communicationDelete = await Communication.findByIdAndDelete(id);
    if (!communicationDelete) {
      return res.status(404).json({ success: false, message: "Note not found" });
    }
    res.status(200).json({ success: true, message: "Note deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export{
    createCommunication,
    getCommunication,
    editCommunication,
    communicationDelete
}