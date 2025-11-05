import express from 'express';
import {
  applyLeave,
  getAllLeavesPending,
  particularLeavesWfh,
  getApproveAndRejectList,
  particularLeavesList,
  updateLeaveStatus,
  getAllWfhPending,
  getWfhApproveAndRejectList,
  leaveDelete,
  getLeaveReport,
  getAddLeaveByAdmin,
  getAdminByLeave
} from '../controllers/leaveController.js';

const router = express.Router();
router.post('/apply-leave', applyLeave);
router.get('/particular-leavelist',particularLeavesList);
// router.get('/particular-leavelist',particularLeavesList);
// router.get('/all-employee-leave-list', getAllLeaves);
router.put('/update-status/:id', updateLeaveStatus);
router.get('/all-leave-pending-list',getAllLeavesPending);
router.get("/all-approve-reject",getApproveAndRejectList);
// WFH
router.get('/leave-wfh-list/:id',particularLeavesWfh);
router.get('/all-wfh-pending-list',getAllWfhPending);
router.get("/all-wfh-approve-reject",getWfhApproveAndRejectList);
// report
router.get("/leave-report/:monthYear",getLeaveReport);

//delete
router.delete('/delete-leave/:id',leaveDelete);
router.post('/admin-add-leave',getAddLeaveByAdmin);
router.get('/admin-get-leave',getAdminByLeave);
export default router;
