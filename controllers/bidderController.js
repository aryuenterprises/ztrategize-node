import Bidder from "../models/accountBidderModel.js";
import mongoose from "mongoose";
import TechnologyBidder from "../models/technologyBidderModel.js";
import bidderEmployeeModelSchema from "../models/bidderEmployeeModel.js";
import ConnectsPurchased from "../models/connectsPurchasedModel.js";
import { isModuleNamespaceObject } from "util/types";
const createAccountBidder = async (req, res) => {
  try {
    const { name, status } = req.body;

    const newBidder = new Bidder({
      name,
      status,
    });
    const savedBidder = await newBidder.save();
    res.status(200).json({
      success: true,
      message: "Bidder created successfully",
      data: savedBidder,
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

const getAccountBidder = async (req, res) => {
  try {
    const bidder = await Bidder.find();
    res.status(200).json({
      success: true,
      data: bidder,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
};

const editAccountBidder = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await Bidder.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updatedBidder) {
      return res
        .status(404)
        .json({ success: false, error: "Bidder not found" });
    }

    res.status(200).json({ success: true, data: updated });
  } catch (error) {
    res.status(500).json({ success: false, error: "Internal server error" });
  }
};

const deleteAccountBidder = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Bidder.findByIdAndDelete(id);

    if (!deleted) {
      return res
        .status(404)
        .json({ success: false, error: "Bidder not found" });
    }

    res.status(200).json({ success: true, data: deleted });
  } catch (error) {
    res.status(500).json({ success: false, error: "Internal server error" });
  }
};

//technology
const createTechnologyBidder = async (req, res) => {
  try {
    const { name, status } = req.body;

    const newBidder = new TechnologyBidder({
      name,
      status,
    });
    const savedBidder = await newBidder.save();
    res.status(200).json({
      success: true,
      message: "Bidder created successfully",
      data: savedBidder,
    });
  } catch (error) {
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

const getTechnologyBidder = async (req, res) => {
  try {
    const bidder = await TechnologyBidder.find();
    res.status(200).json({
      success: true,
      data: bidder,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
};

const editTechnologyBidder = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await TechnologyBidder.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updatedBidder) {
      return res
        .status(404)
        .json({ success: false, error: "Bidder not found" });
    }

    res.status(200).json({ success: true, data: updated });
  } catch (error) {
    res.status(500).json({ success: false, error: "Internal server error" });
  }
};

const deleteTechnologyBidder = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await TechnologyBidder.findByIdAndDelete(id);

    if (!deleted) {
      return res
        .status(404)
        .json({ success: false, error: "Bidder not found" });
    }

    res.status(200).json({ success: true, data: deleted });
  } catch (error) {
    res.status(500).json({ success: false, error: "Internal server error" });
  }
};

const getAccountAndTechnologyBidder = async (req, res) => {
  try {
    const accountBidder = await Bidder.find().select("name");
    const technologyBidder = await TechnologyBidder.find().select("name");
    res.status(200).json({
      success: true,
      data: { accountBidder, technologyBidder },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
};

//for employee Bidder
const createEmployeeBidder = async (req, res) => {
  try {
    const {
      employeeId,
      date,
      account,
      noOfConnections,
      createdBy,
      client,
      technology,
      reply,
      link,
      noOfBoost,
    } = req.body;

    const newBidder = new bidderEmployeeModelSchema({
      employeeId,
      date,
      account,
      client,
      technology,
      noOfConnections,
      createdBy,
      reply,
      link,
      noOfBoost,
    });
    const savedBidder = await newBidder.save();
    res.status(200).json({
      success: true,
      message: "Bidder created successfully",
      data: savedBidder,
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

const editEmployeeBidder = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await bidderEmployeeModelSchema.findByIdAndUpdate(
      id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updated) {
      return res
        .status(404)
        .json({ success: false, error: "Bidder not found" });
    }

    res.status(200).json({ success: true, data: updated });
  } catch (error) {
    if (error.name === "ValidationError") {
      const errors = {};
      for (let field in error.errors) {
        errors[field] = error.errors[field].message;
      }
      return res.status(400).json({ success: false, errors });
    }
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

const getEmployeeBidder = async (req, res) => {
  const { ids, bidder } = req.query;
  if (bidder === "bidder") {
    try {
      if (!ids) {
        return res
          .status(400)
          .json({ success: false, message: "No IDs provided" });
      }

      // Split, trim spaces, and filter out invalid IDs
      const idsArray = ids
        .split(",")
        .map((id) => id.trim()) // remove spaces
        .filter((id) => mongoose.Types.ObjectId.isValid(id)) // keep only valid ObjectIds
        .map((id) => new mongoose.Types.ObjectId(id)); // safely convert to ObjectId

      if (idsArray.length === 0) {
        return res
          .status(400)
          .json({ success: false, message: "No valid IDs provided" });
      }

      const records = await bidderEmployeeModelSchema
        .find({ _id: { $in: idsArray } })
        .populate("account", "name")
        .populate("technology", "name")
        .populate("employeeId", "employeeName")
        .populate("createdBy", "employeeName");

      res.status(200).json({
        success: true,
        data: records,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: "Server Error" });
    }
  }
  try {
    const totalConnections = await bidderEmployeeModelSchema.aggregate([
      {
        $group: {
          _id: null,
          noOfConnects: { $sum: { $toInt: "$noOfConnections" } },
          noOfBoosts: { $sum: { $toInt: "$noOfBoost" } },
        },
      },
    ]);
    const reply = await bidderEmployeeModelSchema
      .find({
        reply: "yes",
      })
      .countDocuments();

    const bidder = await bidderEmployeeModelSchema
      .find()
      .populate("account", "name")
      .populate("technology", "name")
      .populate("createdBy", "employeeName")
      .sort({ createdAt: -1 });

    //no.of connect using the account
    const accountCount = await bidderEmployeeModelSchema.aggregate([
      {
        $group: {
          _id: "$account", // group by account ObjectId
          count: { $sum: 1 }, // number of bidders per account
        },
      },
      {
        $lookup: {
          from: "accountbidders", // collection name in MongoDB
          localField: "_id", // account ObjectId from group
          foreignField: "_id", // _id in accounts collection
          as: "account",
        },
      },
      {
        $unwind: "$account", // convert account array → object
      },
      {
        $project: {
          _id: 0, // hide raw _id
          accountId: "$account._id",
          accountName: "$account.name",
          count: 1,
        },
      },
    ]);

    res.status(200).json({
      success: true,
      data: bidder,
      accountCount,
      noOfConnects: totalConnections[0]?.noOfConnects || 0,
      noOfBoosts: totalConnections[0]?.noOfBoosts || 0,
      reply: reply,
    });
  } catch (error) {
    console.error("Error in getEmployeeBidder:", error);
    res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
};

//get by id
const viewEmployeeBidderById = async (req, res) => {
  try {
    const { id } = req.params;
    const bidder = await bidderEmployeeModelSchema
      .find({ employeeId: id })
      .populate("account", "name")
      .populate("technology", "name");
    if (!bidder) {
      return res
        .status(404)
        .json({ success: false, error: "Bidder not found" });
    }
    res.status(200).json({ success: true, data: bidder });
  } catch (error) {
    console.error("Error in viewEmployeeBidderById:", error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
};
//   const getEmployeeBidder = async (req, res) => {
//     try {
//         const bidder = await bidderEmployeeModelSchema.find().lean();
//         const accountBidder = await Bidder.find().select("name");
//         const technologyBidder = await TechnologyBidder.find().select("name");
//         const dataMap ={};
//         accountBidder.forEach((bidder) => {
//           dataMap[bidder._id] = bidder.name;
//         });
//         const dataMap2 ={};
//         technologyBidder.forEach((bidder) => {
//           dataMap2[bidder._id] = bidder.name;
//         })
//         const formattedData = bidder.map((bidder) => ({
//           ...bidder,
//           account: dataMap[bidder.account],
//           technology: dataMap2[bidder.technology],
//         }));
//         res.status(200).json({
//             success: true,
//             data: formattedData,
//         });
//     } catch (error) {
//         res.status(500).json({
//             success: false,
//             error: "Internal server error",
//         });
//     }
// };

const deleteEmployeeBidder = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await bidderEmployeeModelSchema.findByIdAndDelete(id);

    if (!deleted) {
      return res
        .status(404)
        .json({ success: false, error: "Bidder not found" });
    }

    res
      .status(200)
      .json({ success: true, message: "Bidder deleted successfully" });
  } catch (error) {
    console.error("Error in deleteEmployeeBidder:", error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
};

const createConnectPurchased = async (req, res) => {
  try {
    const { date, account, noOfConnections, amount } = req.body;
    const connectPurchased = await ConnectsPurchased.create({
      date,
      account,
      noOfConnections,
      amount,
    });
    res.status(200).json({
      success: true,
      message: "Connects Purchased created successfully",
      data: connectPurchased,
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
const getConnectPurchased = async (req, res) => {
  try {
    const getConnectPurchased = await ConnectsPurchased.find({}).populate(
      "account",
      "name"
    );
    res.status(200).json({
      success: true,
      data: getConnectPurchased,
    });
  } catch (error) {
    console.error("Error in getConnectPurchased:", error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
};
const editConnectPurchased = async (req, res) => {
  const { id } = req.params;
  try {
    const editConnectPurchased = await ConnectsPurchased.findByIdAndUpdate(
      id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );
    if (!editConnectPurchased) {
      return res
        .status(404)
        .json({ success: false, error: "Connects not found" });
    }
    res.status(200).json({
      success: true,
      data: editConnectPurchased,
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

const deleteConnectsPurchased = async (req, res) => {
  const { id } = req.params;
  try {
    const deleteConnects = await ConnectsPurchased.findByIdAndDelete(id);
    if (!deleteConnects) {
      return res
        .status(404)
        .json({ success: false, error: "Connects not found" });
    }
    res.status(200).json({
      success: true,
      data: deleteConnects,
    });
  } catch (error) {
    console.error("Error in deleteConnectsPurchased:", error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
};

//  const getAccountWise = async (req, res) => {
//   try {
//     // Example: fetched from DB
//       const records = await bidderEmployeeModelSchema.find({reply: 'yes'}).populate("account", "name")
//       .populate("employeeId", "employeeName");

//     // Group by account -> date
//     const grouped = records.reduce((acc, item) => {
//       const accountName = item.account.name || "Unknown";
//       const date = item.date;
//       const name = item.employeeId.employeeName;

//       if (!acc[accountName]) {
//         acc[accountName] = {};
//       }

//       if (!acc[accountName][name]) {
//         acc[accountName][name] = {};
//       }

//       if (!acc[accountName][name][date]) {
//         acc[accountName][name][date] = [];
//       }

//       acc[accountName][name][date].push({
//         employeeId: item.employeeId,
//         client: item.client,
//         technology: item.technology,
//         status: item.status,
//         link: item.link,
//         reply: item.reply
//       });
//       return acc;
//     }, {});

//     const result = Object.entries(grouped).map(([account, data]) => ({
//       account,
//       data
//     }));

//     res.status(200).json({
//       success: true,
//       data: result
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ success: false, message: "Server Error" });
//   }
// };
const getAccountWise = async (req, res) => {
  try {
    const records = await bidderEmployeeModelSchema
      .find({})
      .populate("account", "name")
      .populate("technology", "name")
      .populate("employeeId", "employeeName");

    const grouped = records.reduce((acc, item) => {
      const accountName = item.account?.name || "Unknown";
      const employeeName = item.employeeId?.employeeName || "Unknown";
      const employeeId = item.employeeId?._id?.toString();
      const date = item.date;

      if (!acc[accountName]) acc[accountName] = {};
      if (!acc[accountName][employeeName]) acc[accountName][employeeName] = {};

      if (!acc[accountName][employeeName][date]) {
        acc[accountName][employeeName][date] = {
          connects: { count: 0, ids: [] },
          employeeId,
          employeeName,
          client: item.client,
          technology: item.technology,
          status: item.status,
          reply: item.reply,
          date,
        };
      }

      // Track connects always
      acc[accountName][employeeName][date].connects.count++;
      acc[accountName][employeeName][date].connects.ids.push(item._id);

      return acc;
    }, {});

    // Format into array (final structure)
    const result = Object.entries(grouped).map(([account, employees]) => ({
      account,
      data: Object.entries(employees).map(([employeeName, dates]) => ({
        name: employeeName,
        data: Object.values(dates),
      })),
    }));

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

const getBidderByMultipleIds = async (req, res) => {
  const { ids } = req.query;

  try {
    if (!ids) {
      return res
        .status(400)
        .json({ success: false, message: "No IDs provided" });
    }

    // Split, trim spaces, and filter out invalid IDs
    const idsArray = ids
      .split(",")
      .map((id) => id.trim()) // remove spaces
      .filter((id) => mongoose.Types.ObjectId.isValid(id)) // keep only valid ObjectIds
      .map((id) => new mongoose.Types.ObjectId(id)); // safely convert to ObjectId

    if (idsArray.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "No valid IDs provided" });
    }

    const records = await bidderEmployeeModelSchema
      .find({ _id: { $in: idsArray } })
      .populate("account", "name")
      .populate("technology", "name")
      .populate("employeeId", "employeeName");

    res.status(200).json({
      success: true,
      data: records,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// const filterBidder = async (req, res) => {
//   try {
//     const totalConnections = await bidderEmployeeModelSchema.aggregate([
//       {
//         $group: {
//           _id: null,
//           noOfConnects: { $sum: { $toInt: "$noOfConnections" } },
//           noOfBoosts: { $sum: { $toInt: "$noOfBoost" } },
//         },
//       },
//     ]);
//     const reply = await bidderEmployeeModelSchema
//       .find({
//         reply: "yes",
//       })
//       .countDocuments();

//     const response = {
//       success: true,
//       data: {
//         noOfConnects: totalConnections[0]?.noOfConnects || 0,
//         noOfBoosts: totalConnections[0]?.noOfBoosts || 0,
//         reply: reply,
//       },
//     };

//     res.status(200).json(response);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ success: false, message: "Server Error" });
//   }
// };
export {
  createAccountBidder,
  getAccountBidder,
  editAccountBidder,
  deleteAccountBidder,
  createTechnologyBidder,
  getTechnologyBidder,
  editTechnologyBidder,
  deleteTechnologyBidder,
  getAccountAndTechnologyBidder,
  createEmployeeBidder,
  editEmployeeBidder,
  getEmployeeBidder,
  deleteEmployeeBidder,
  viewEmployeeBidderById,
  createConnectPurchased,
  getConnectPurchased,
  editConnectPurchased,
  deleteConnectsPurchased,
  getAccountWise,
  getBidderByMultipleIds,
  // filterBidder,
};
