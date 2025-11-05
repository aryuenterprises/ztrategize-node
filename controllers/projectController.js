import ProjectModel from "../models/projectModel.js";

const createProject = async (req, res) => {
  const {
    name,
    projectDescription,
    projectManager,
    teamMembers,
    gst,
    gst_amount,
    createdByAdmin,
    clientName,
    startDate,
    endDate,
    status,
    budget,
    priority,
    paymentType,
    recurringDays
  } = req.body;
  console.log(req.body);
  try {
    const checkProjectName = await ProjectModel.findOne({ name: name });
    if (checkProjectName) {
      return res.status(400).json({
        success: false,
        // message: "Project name already exists",
        errors: { name: "Project name already exists" },
      });
    }

    // Parse employeeMembers (in case it's sent as a string from FormData)
    const parsedMembers =
      typeof teamMembers === "string" ? JSON.parse(teamMembers) : teamMembers;

    // Handle uploaded documents from fieldname: document[]
    const documentArray = [];
    // console.log(" Files received:", req.files);

    if (Array.isArray(req.files)) {
      req.files.forEach((file) => {
        if (file.fieldname === "document[]") {
          documentArray.push({
            filepath: file.filename,
            originalName: file.originalname,
          });
        }
      });
    }
    // console.log("Parsed documents:", documentArray);
    // Create and save the project
    const newProject = new ProjectModel({
      name,
      projectDescription: projectDescription,
      createdByAdmin,
      gst,
      gst_amount,
      // employeeMembers: parsedMembers,
      clientName,
      startDate,
      endDate,
      status,
      budget,
      priority,
      projectManager,
      paymentType,
      recurringDays,
      teamMembers: parsedMembers,
      document: documentArray,
    });
    const savedProject = await newProject.save();

    return res.status(201).json({
      success: true,
      message: "Project created successfully",
      project: savedProject,
    });
  } catch (error) {
    // console.error(" Error creating project:", error);

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

const getProjects = async (req, res) => {
  try {
    const projects = await ProjectModel.find()
      .populate([
        { path: "createdByAdmin", select: "name email" },
        { path: "clientName", select:"client_name" },
      ])
      .sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: projects });
  } catch (error) {
    // console.error("Error fetching projects:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
const getProjectsById = async (req, res) => {
  const { clientId } = req.query;
  try {
    const projects = await ProjectModel.find({ clientName: clientId })
      .populate([
        { path: "createdByAdmin", select: "name email" },
        { path: "clientName", select:"client_name" },
      ])
      .sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: projects });
  } catch (error) {
    // console.error("Error fetching projects:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getProjectById = async (req, res) => {
  try {
    const { id } = req.params;
    const project = await ProjectModel.findById(id).populate(
      "createdByAdmin",
      "name email"
    );
    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }
    res.status(200).json({ success: true, data: project });
  } catch (error) {
    console.error("Error fetching project:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const updateProject = async (req, res) => {
  console.log(req.body);
  const { id } = req.params;
  const {
    name,
    projectDescription,
    projectManager,
    teamMembers,
    createdByAdmin,
    clientName,
    startDate,
    endDate,
    status,
    budget,
    priority,
    recurringDays,
    paymentType,
    gst
  } = req.body;
  try {
    if (!id) {
      return res.status(400).json({ error: "Project ID is required" });
    }
    // Fetch existing project
    const existingProject = await ProjectModel.findById(id);
    if (!existingProject) {
      return res.status(404).json({ error: "Project not found" });
    }
    const checkProjectName = await ProjectModel.find();
    checkProjectName.map((project) => {
      if (project.name === name && project._id.toString() !== id) {
        return res.status(400).json({
          success: false,
          // message: "Project name already exists",
          errors: { name: "Project name already exists" },
        });
      }
    });
    // if(checkProjectName){
    //   return res.status(400).json({
    //     success: false,
    //     // message: "Project name already exists",
    //    errors:{name: "Project name already exists",
    //    }
    //   });
    // }
    // console.log("Updating project:", existingProject);
    // Parse employeeMembers (handle JSON from FormData)
    const parsedMembers =
      typeof teamMembers === "string" ? JSON.parse(teamMembers) : teamMembers;

    // Handle uploaded documents
    const newDocuments = [];
    if (req.files && req.files.length > 0) {
      req.files.forEach((file) => {
        if (file.fieldname === "document[]") {
          newDocuments.push({
            filepath: file.filename,
            originalName: file.originalname,
          });
        }
      });
    }

    // Update project fields
    existingProject.name = name;
    existingProject.projectDescription = projectDescription;
    existingProject.createdByAdmin =
      createdByAdmin || existingProject.createdByAdmin;
    existingProject.teamMembers = parsedMembers == null ? [] : parsedMembers;
    existingProject.status = status || existingProject.status;
    existingProject.projectManager = projectManager;
    existingProject.clientName = clientName;
    existingProject.recurringDays = recurringDays;
    existingProject.paymentType = paymentType;
    existingProject.gst = gst
    if (startDate !== "null") {
      existingProject.startDate = startDate;
    }
    if (endDate !== "null") {
      existingProject.endDate = endDate;
    }
    if (budget !== "null") {
      existingProject.budget = budget;
    }

    // existingProject.budget = budget;
    existingProject.Priority = priority;

    // Append new files to the existing documents
    existingProject.document = existingProject.document.concat(newDocuments);

    // Save updated project
    const updatedProject = await existingProject.save();

    res.status(200).json({
      success: true,
      message: "Project updated successfully",
      project: updatedProject,
    });
  } catch (error) {
    console.error("Error updating project:", error);

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

const deleteProject = async (req, res) => {
  const { id } = req.params;
  try {
    const project = await ProjectModel.findByIdAndDelete(id);
    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }
    res
      .status(200)
      .json({ success: true, message: "Project deleted successfully" });
  } catch (error) {
    console.error("Error deleting project:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const deleteProjectFileByIndex = async (req, res) => {
  const { id, index } = req.params;
  console.log("Deleting file from project:", id, "at index:", index);
  console.log("employeeId", id, "fileIndex", index);

  try {
    console.log("Fetching project with ID:", id);
    const project = await ProjectModel.findById({ _id: id });
    console.log("Fetching 222222222:", id);
    if (!project) {
      return res.status(404).json({ message: "ProjectModel not found" });
    }
    console.log("employee", project.document);

    // Search all documents to find the index
    if (Array.isArray(project.document) && project.document.length > index) {
      // Optional: Delete all files inside the document (from disk)
      //   const targetDoc = employee.document[index];

      //  if (targetDoc.files && Array.isArray(targetDoc.files)) {
      //   targetDoc.files.forEach(file => {
      //     const fs = require("fs");
      //     const path = require("path");
      //     const filePath = path.join("uploads", file.fileName); // adjust path if needed
      //     if (fs.existsSync(filePath)) {
      //       fs.unlinkSync(filePath); // delete file from disk
      //     }
      //   });
      // }

      //  Delete the document object at index
      project.document.splice(index, 1);

      // Save changes to DB
      await project.save();

      res.status(200).json({
        message: `Document at index ${index} deleted successfully.`,
        updatedDocuments: project.document,
      });
    } else {
      res.status(404).json({
        message: `Document not found at index ${index}.`,
      });
    }

    // return res.status(404).json({ message: "File index not found in any document" });
  } catch (error) {
    console.error("Delete error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
export {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
  deleteProjectFileByIndex,
  getProjectsById
};
