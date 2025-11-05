import DeclarationModel from "../models/declarationModel.js";
const createDeclaration = async (req, res) => {
    try{
        const {employeeName, designation ,empId, employeeId, certificateName, certificateNo} = req.body;

        const newDeclaration = new DeclarationModel({
            employeeName,
            designation,
            employeeId,
            empId,
            certificateName,
            certificateNo
        });

        const savedDeclaration = await newDeclaration.save();
        res.status(201).json(savedDeclaration);
    } catch (error) {
        console.error("Error creating declaration:", error);
        res.status(500).json({ message: "Server error" });
    }
}

const getDeclaration = async (req, res) => {
  try {
    const declarationDetails = await DeclarationModel.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: declarationDetails });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

const editDeclaration = async (req, res) => {
    try {
      const { id } = req.params;
      const updated = await DeclarationModel.findByIdAndUpdate(id, req.body, {
        new: true,
        runValidators: true,
      });
      if (!updated) {
        return res
          .status(404)
          .json({ success: false, message: "declaration not found" });
      }
      res
        .status(200)
        .json({ success: true, message: "declaration updated successfully" });
    } catch (error) {
      console.error("Error:", error);
      res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}

const deleteDeclaration = async (req, res) => {
  const { id } = req.params;
    try {
        const joiningDetails = await DeclarationModel.findByIdAndDelete(id);
        if (!joiningDetails) {
            return res.status(404).json({ success: false, message: "Declaration not found" });
        }
        res.status(200).json({ success: true, message: "Declaration deleted successfully" });
    } catch (err) {
        console.error("Error:", err);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

export { createDeclaration, getDeclaration, editDeclaration, deleteDeclaration };