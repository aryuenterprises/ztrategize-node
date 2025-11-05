import Revision from "../models/revisionModel.js";
const createRevision = async (req, res) => {
  try {
    const {
      employeeId,
      revision_date,
      percentage,
      current_salary,
      revised_salary,
      next_revision_date,
      revision_notes,
    } = req.body;

    const newRevision = new Revision({
      employeeId,
      revision_date,
      percentage,
      current_salary,
      revised_salary,
      next_revision_date,
      revision_notes,
    });

    const savedRevision = await newRevision.save();

    res.status(201).json({
      success: true,
      message: "Revision created successfully",
      data: savedRevision,
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

const getRevisionInformation = async (req, res) => {
  const { id } = req.params;
  try {
    const revisionDetails = await Revision.find({ employeeId: id }).populate("employeeId", "employeeName");
    if (!revisionDetails || revisionDetails.length === 0) {
      return res.status(404).json({ success: false, message: "No revision history found" });
    }
    res.status(200).json({ 
      success: true, 
      data: revisionDetails.map(revision => ({
        // employeeId: revision.employeeId,
        id: revision._id,
        employeeName: revision.employeeId.employeeName,
        revision_date: revision.revision_date,
        percentage: revision.percentage,
        current_salary: revision.current_salary,
        revised_salary: revision.revised_salary,
        next_revision_date: revision.next_revision_date,
        revision_notes: revision.revision_notes,
      }))
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

const editRevisionDetails =async (req, res) => {
    const{id} = req.params;
    try{
        const updated = await Revision.findByIdAndUpdate(id, req.body,{
            new:true,
            runValidators: true,
        });
        if(!updated){
            return res.status(404).json({ success: false, message: "Revision not found" });
        }
        res.status(200).json({ success: true, message: "Revision updated successfully", data: updated });
    }
    catch(error){
        console.error("Error:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

const revisionDelete = async (req, res) => {
  const { id } = req.params;
  try {
    const revisionDetails = await Revision.findByIdAndDelete(id);
    if (!revisionDetails) {
      return res.status(404).json({ success: false, message: "revisionDetails not found" });
    }
    res.status(200).json({ success: true, message: "revisionDetails deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export { createRevision, getRevisionInformation , editRevisionDetails, revisionDelete };