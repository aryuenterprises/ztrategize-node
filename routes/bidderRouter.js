import express from "express";
import {
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
  getAllBidder
  // filterBidder,
} from "../controllers/bidderController.js";
const router = express.Router();

router.post("/create-account-bidder", createAccountBidder);
router.get("/view-account-bidder", getAccountBidder);
router.put("/edit-account-bidder/:id", editAccountBidder);
router.delete("/delete-account-bidder/:id", deleteAccountBidder);

//technology
router.post("/create-technology-bidder", createTechnologyBidder);
router.get("/view-technology-bidder", getTechnologyBidder);
router.put("/edit-technology-bidder/:id", editTechnologyBidder);
router.delete("/delete-technology-bidder/:id", deleteTechnologyBidder);

//account and technology
router.get("/view-account-technology-bidder", getAccountAndTechnologyBidder);

//employee
router.post("/create-employee-bidder", createEmployeeBidder);
router.put("/edit-employee-bidder/:id", editEmployeeBidder);
router.get("/view-employee-bidder", getEmployeeBidder);
router.get("/view-employee-bidder-id/:id", viewEmployeeBidderById);
router.delete("/delete-employee-bidder/:id", deleteEmployeeBidder);

//connect Purchased
router.post("/create-connect-purchased", createConnectPurchased);
router.get("/view-connect-purchased", getConnectPurchased);
router.put("/edit-connect-purchased/:id", editConnectPurchased);
router.delete("/delete-connect-purchased/:id", deleteConnectsPurchased);

//getaccountwise
router.get("/get-account-bidder-wise", getAccountWise);
router.get("/get-account-bidder-multiple-id", getBidderByMultipleIds);
// router.get("/filter-bidder", filterBidder);

//get all bidder
router.get("/get-all-bidder", getAllBidder);

export default router;
