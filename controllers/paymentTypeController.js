import PaymentType from "../models/paymentTypeModel.js";
import ClientDetails from "../models/clientModals.js";
import ProjectModel from "../models/projectModel.js";
const createPaymentType = async (req, res) => {
  try {
    const paymentType = new PaymentType(req.body);
    await paymentType.save();
    res
      .status(201)
      .json({ message: "Payment type created successfully", paymentType });
  } catch (error) {
    if (error.name === "ValidationError") {
      const errors = {};
      for (let field in error.errors) {
        errors[field] = error.errors[field].message;
      }
      return res.status(400).json({ errors });
    } else {
      res.status(500).json({ success: false, error: "Internal Server Error" });
    }
    res.status(400).json({ error: error.message });
  }
};

//filter the paymenttype

const getFilter= async(req, res) => {
  const {client} = req.query;
  const clientName = await ClientDetails.find({client_name: client});
  res.status(200).json(clientName);
}

const getPaymentType = async (req, res) => {
  try {
    const payments = await PaymentType.find({}).populate("project_name", "gst gst_amount name budget").lean();
    const clients = await ClientDetails.find({}, "client_name").lean();
    // const project = await ProjectModel.find({clients: project_name}).select("gst gst_amount ").lean();

    // Create a map of clientId -> client_name
    const clientMap = {};
    clients.forEach((c) => {
      clientMap[c._id.toString()] = c.client_name;
    });

    // Replace client_name ID with actual name
    const formatted = payments.map((p) => ({
      ...p,
      client_name: clientMap[p.client_name] || p.client_name,

    }));

    res.status(200).json({ success: true, data: formatted });
  } catch (error) {
    console.error("Error in getPaymentType:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

const editPaymentType = async (req, res) => {
  try {
    const { id } = req.params;
    const paymentType = await PaymentType.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!paymentType) {
      return res
        .status(404)
        .json({ success: false, message: "Payment type not found" });
    }
    res
      .status(200)
      .json({
        success: true,
        message: "Payment type updated successfully",
        paymentType,
      });
  } catch (error) {
    console.error("Update Error:", error);
    if (error.name === "ValidationError") {
      const errors = {};
      for (let field in error.errors) {
        errors[field] = error.errors[field].message;
      }
      return res.status(400).json({ success: false, errors });
    }
    res
      .status(500)
      .json({
        success: false,
        message: "Internal Server Error",
        error: error.message,
      });
  }
};
const deletePaymentType = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await PaymentType.findByIdAndDelete(id);
    if (!deleted) {
      return res
        .status(404)
        .json({ success: false, message: "Payment type not found" });
    }
    res
      .status(200)
      .json({ success: true, message: "Payment type deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export {
  createPaymentType,
  getPaymentType,
  editPaymentType,
  deletePaymentType,
  getFilter
};
