import CategoryDetails from "../models/categoryModel.js";
const createCategory = async (req, res) => {
  try {
   
    const {
      title,
      status
    } = req.body;

    const newCategory = new CategoryDetails({
      title,
      status
    });

    const savedIncome = await newCategory.save();

    res.status(201).json({
      success: true,
      message: "Category created successfully",
      data: savedIncome,
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

const getCategoryDetails = async (req, res) => {
    try{
        const categoryDetails = await CategoryDetails.find();
        res.status(200).json({ success: true, data: categoryDetails });
        }catch(error){
            res.status(500).json({ success: false, message: "Internal Server Error" });
        }
    
};

const categoryDelete = async (req, res) => {
  const { id } = req.params;
  try {
    const categoryDetails = await CategoryDetails.findByIdAndDelete(id);
    if (!categoryDetails) {
      return res.status(404).json({ success: false, message: "CategoryDetails not found" });
    }
    res.status(200).json({ success: true, message: "CategoryDetails deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};


const editCategoryDetails = async (req, res) => {
  const { id } = req.params;
  try {
    const updated = await CategoryDetails.findByIdAndUpdate(id, req.body, {
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

const categoryStatusUpdate = async (req, res) => {
    const { id } = req.params;
    try {
        const updateStatus = await CategoryDetails.findByIdAndUpdate(id, {status:true}, { new: true });
        if (!updateStatus) {
            return res.status(404).json({ success: false, message: "Link not found" });
        }
        res.status(200).json({ success: true, message: "Link status updated successfully" });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

export{
    createCategory,
    getCategoryDetails,
    categoryDelete,
    editCategoryDetails,
    categoryStatusUpdate
}

