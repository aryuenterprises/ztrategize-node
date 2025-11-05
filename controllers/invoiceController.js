import Invoice from "../models/invoiceModel.js";
import ProjectModel from "../models/projectModel.js";
const createInvoice = async (req, res) => {
  try {
    const lastInvoice = await Invoice.findOne({}).sort({ createdAt: -1 });

    let nextNumber = 1;

    if (lastInvoice && lastInvoice.invoice_number) {
      const lastNumber = parseInt(lastInvoice.invoice_number.split("-")[1]);
      nextNumber = lastNumber + 1;
    }

    const invoice_number = `INV-${String(nextNumber).padStart(4, "0")}`;

    const {
      clientId,
      client,
      project,
      invoice_date,
      due_date,
      currency,
      items,
      sub_total,
      tax,
      total_amount,
      notes,
      status,
    } = req.body;

    const newInvoice = new Invoice({
      clientId,
      invoice_number,
      client,
      project,
      invoice_date,
      due_date,
      currency,
      items,
      sub_total,
      tax,
      total_amount,
      notes,
      status,
    });

    const savedInvoice = await newInvoice.save();

    res.status(201).json({
      success: true,
      message: "Invoice created successfully",
      data: savedInvoice,
    });
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
const getInvoiceDetails = async (req, res) => {
  try {
    const invoiceDetails = await Invoice.find({ is_deleted: false }).sort({
      is_deleted: -1,
    });
    res.status(200).json({ success: true, data: invoiceDetails });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

const editInvoiceDetails = async (req, res) => {
  const { id } = req.params;
  try {
    const updated = await Invoice.findByIdAndUpdate(id, req.body, {
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

const deleteInvoiceDetails = async (req, res) => {
  const { id } = req.params;
  try {
    const updated = await Invoice.findByIdAndUpdate(
      id,
      { is_deleted: true },
      { new: true }
    );

    res
      .status(200)
      .json({ success: true, message: "uploaded successfully client details" });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

const addNotesInvoice = async (req, res) => {
  const { id } = req.params;
  const { note } = req.body;
  const updated = await Invoice.findByIdAndUpdate(
    id,
    { $push: { notes: { note: note, time: new Date() } } },
    { new: true }
  );
  res.status(200).json({ success: true, data: updated });
};

//get the all name column from Project Model
const getProjectName = async (req, res) => {
  try {
    const projects = await ProjectModel.find({}).select("name clientName budget");
    res.status(200).json({ success: true, data: projects });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

const getProjectNameWithClient = async (req, res) => {
    const { project } = req.query;
  try {
    const projects = await ProjectModel.find({clientName: project}).select("name clientName budget gst gst_amount");
    res.status(200).json({ success: true, data: projects });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

const getProjectDetails = async (req, res) => {
  const type = req.params.type;
  console.log("type:", type);

  try {
    const project = await Invoice.findOne({ name: type });
    console.log("project:", project);

    if (!project) {
      return res
        .status(404)
        .json({ success: false, message: "Project not found" });
    }

    const invoiceDetails = await Invoice.find({ project: project.name });

    res.status(200).json({ success: true, data: invoiceDetails });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export {
  addNotesInvoice,
  createInvoice,
  getInvoiceDetails,
  editInvoiceDetails,
  deleteInvoiceDetails,
  getProjectName,
  getProjectDetails,
  getProjectNameWithClient
};
