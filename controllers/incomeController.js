import IncomeDetails from "../models/incomeModel.js";
import ExpenseDetails from "../models/expenseModel.js";
import FinanceCompany from "../models/financeCompanyModel.js";

const createFinanceCompany = async (req, res) => {
  try {
    const { name } = req.body;
    const newFinanceCompany = new FinanceCompany({ name });
    const savedFinanceCompany = await newFinanceCompany.save();
    res.status(201).json({ success: true, data: savedFinanceCompany });
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

const getFinanceCompany= async (req, res) => {
  try {
    const financeCompanies = await FinanceCompany.find();
    res.status(200).json({ success: true, data: financeCompanies });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const editFinanceCompany = async (req, res) => {
  try {
    const { id } = req.params;
     const updated = await FinanceCompany.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updated) {
      return res.status(404).json({ success: false, message: "Finance Company not found" });
    }
    res.status(200).json({ success: true, data: updated });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const deleteFinanceCompany = async (req, res) => {
  const {id} = req.params;
  try {
    const deleted = await FinanceCompany.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: "Finance Company not found" });
    }
    res.status(200).json({ success: true, message: "Finance Company deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
}
const createIncome = async (req, res) => {
  try {
   
    const {
      date,
      financeName,
      credit_amount,
      source,
      notes,
    } = req.body;

    const newIncome = new IncomeDetails({
      date,
      financeName,
      credit_amount,
      source,
      notes,
    });

    const savedIncome = await newIncome.save();

    res.status(201).json({
      success: true,
      message: "Income created successfully",
      data: savedIncome,
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

const getincomeDetails = async (req, res) => {
    try{
        const invoiceDetails = await IncomeDetails.find().populate("financeName", "name");
        res.status(200).json({ success: true, data: invoiceDetails });
        }catch(error){
            res.status(500).json({ success: false, message: "Internal Server Error" });
        }
    
};

//getting the monthy total credit_amount using date
const getMonthlyTotalCredit = async (req, res) => {
  try {
    const date = new Date();
    const year = date.getFullYear();

    // Step 1: Aggregate existing data
    const totalCreditData = await IncomeDetails.aggregate([
      {
        $match: {
          date: { $gte: new Date(year, 0, 1), $lte: new Date(year, 11, 31) },
        },
      },
      {
        $group: {
          _id: { $month: "$date" },
          totalCredit: {
            $sum: { $convert: { input: "$credit_amount", to: "double" } },
          },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Step 2: Define month names
    const months = [
      "jan", "feb", "mar", "apr", "may", "jun",
      "jul", "aug", "sep", "oct", "nov", "dec"
    ];

    // Step 3: Map results to include all months
    const finalResult = months.map((month, index) => {
      const found = totalCreditData.find(item => item._id === index + 1);
      return {
        _id: index + 1,
        month,
        totalCredit: found ? found.totalCredit : 0,
      };
    });

    res.status(200).json({ success: true, data: finalResult });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};


const getYearlyTotalCredit = async (req, res) => {
  try {
    const totalCredit = await IncomeDetails.aggregate([
      {
        $group: {
          _id: { $year: "$date" },
          totalCredit: {
            $sum: { $convert: { input: "$credit_amount", to: "double" } },
          },
        },
      },
      {
        $project: {
          _id: 0,             
          year: "$_id",      
          totalCredit: 1,
        },
      },
    ]);

    res.status(200).json({ success: true, data: totalCredit });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};


const editIncomeDetails = async (req, res) => {
  const { id } = req.params;
  try {
    const updated = await IncomeDetails.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updated) {
      return res.status(404).json({ success: false, message: "Income not found" });
    }
    res.status(200).json({ success: true, message: "Income updated successfully", data: updated });
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

const IncomeDelete = async (req, res) => {
  const { id } = req.params;
  try {
    const incomeDetails = await IncomeDetails.findByIdAndDelete(id);
    if (!IncomeDetails) {
      return res.status(404).json({ success: false, message: "IncomeDetails not found" });
    }
    res.status(200).json({ success: true, message: "IncomeDetails deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};


const createExpenses = async (req, res) => {
  try {
   
    const {
      date,
      financeName,
      debit_amount,
      source,
      notes,
    } = req.body;

    const newIncome = new ExpenseDetails({
      date,
      financeName,
      debit_amount,
      source,
      notes,
    });

    const savedIncome = await newIncome.save();

    res.status(201).json({
      success: true,
      message: "Income created successfully",
      data: savedIncome,
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

const editExpenseDetails = async (req, res) => {
  const { id } = req.params;
  try {
    const updated = await ExpenseDetails.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updated) {
      return res.status(404).json({ success: false, message: "Income not found" });
    }
    res.status(200).json({ success: true, message: "Income updated successfully", data: updated });
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
const getExpensesDetails = async (req, res) => {
    try{
        const invoiceDetails = await ExpenseDetails.find().populate("financeName", "name");
        res.status(200).json({ success: true, data: invoiceDetails });
        }catch(error){
            res.status(500).json({ success: false, message: "Internal Server Error" });
        }
    
};

const ExpenseDelete = async (req, res) => {
  const { id } = req.params;
  try {
    const incomeDetails = await ExpenseDetails.findByIdAndDelete(id);
    if (!incomeDetails) {
      return res.status(404).json({ success: false, message: "IncomeDetails not found" });
    }
    res.status(200).json({ success: true, message: "IncomeDetails deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};


const getMonthlyTotalExpenses = async (req, res) => {
  try {
    const date = new Date();
    const year = date.getFullYear();

    // Step 1: Aggregate existing data
    const totalCreditData = await ExpenseDetails.aggregate([
      {
        $match: {
          date: { $gte: new Date(year, 0, 1), $lte: new Date(year, 11, 31) },
        },
      },
      {
        $group: {
          _id: { $month: "$date" },
          totalCredit: {
            $sum: { $convert: { input: "$debit_amount", to: "double" } },
          },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Step 2: Define month names
    const months = [
      "jan", "feb", "mar", "apr", "may", "jun",
      "jul", "aug", "sep", "oct", "nov", "dec"
    ];

    // Step 3: Map results to include all months
    const finalResult = months.map((month, index) => {
      const found = totalCreditData.find(item => item._id === index + 1);
      return {
        _id: index + 1,
        month,
        totalCredit: found ? found.totalCredit : 0,
      };
    });

    res.status(200).json({ success: true, data: finalResult });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
const getYearlyTotalExpenses = async (req, res) => {
  try {
    const totalCredit = await ExpenseDetails.aggregate([
      {
        $group: {
          _id: { $year: "$date" },
          totalCredit: {
            $sum: { $convert: { input: "$debit_amount", to: "double" } },
          },
        },
      },
      {
        $project: {
          _id: 0,             
          year: "$_id",      
          totalCredit: 1,
        },
      },
    ]);

    res.status(200).json({ success: true, data: totalCredit });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

const getFinanceName = async (req, res)=>{
  const getFinanceName = await FinanceCompany.find({status: "1"}).select("name");
  if (!getFinanceName) {
    return res.status(404).json({ message: "Finance Company not found" });
  }
  res.status(200).json({ message: "Finance Company fetched successfully", getFinanceName });
}

export{
    getFinanceName,
    createIncome,
    getincomeDetails,
    editIncomeDetails,
    IncomeDelete,
    getMonthlyTotalCredit,
    getYearlyTotalCredit,

    createExpenses,
    editExpenseDetails,
    getExpensesDetails,
    ExpenseDelete,
    getMonthlyTotalExpenses,
    getYearlyTotalExpenses,

    //finance Company

    createFinanceCompany,
    getFinanceCompany,
    editFinanceCompany,
    deleteFinanceCompany
}

