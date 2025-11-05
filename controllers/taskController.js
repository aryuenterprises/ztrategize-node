import mongoose from "mongoose";
import Counter from "../models/counterModel.js";
import Employee from "../models/employeeModel.js";
import NotificationSchema from "../models/notificationModel.js";
import ProjectModel from "../models/projectModel.js";
import TaskComments from "../models/taskComment.js";
import TaskLogsModel from "../models/taskLogsModel.js";
import Task from "../models/taskModal.js";
import userModel from "../models/userModel.js";
import User from "../models/userModel.js";
import SubTask from "../models/subTaskModel.js";

const generateTaskId = async () => {
  const counter = await Counter.findOneAndUpdate(
    { id: "taskId" },
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );

  const paddedSeq = counter.seq.toString().padStart(3, "0"); // AY001, AY002
  return `AY${paddedSeq}`;
};

// const createTask = async (req, res) => {
//   try {
//     // console.log("Incoming body:", req.body);
//     const {
//       projectName,
//       title,
//       description,
//       assignedTo,
//       priority,
//       status,
//       startDate,
//       dueDate,
//       projectId,
//       projectManagerId,

//       createdById,
//     } = req.body;

//     // Optional: Enable this block for validation

//     const errors = {};

//     if (!projectName) errors.projectName = "Project name is required.";
//     if (!title) errors.title = "Title is required.";
//     if (!description) errors.description = "Description is required.";
//     // if (!assignedTo) errors.assignedTo = "Assigned user is required.";
//     if (!priority) errors.priority = "Priority is required.";
//     if (!status) errors.status = "Status is required.";
//     // if (!dueDate) errors.dueDate = "Due date is required.";
//     if (!projectId) errors.projectId = "Project ID is required.";
//     if (!createdById) errors.createdById = "CreatedBy ID is required.";
//     if (!projectManagerId)
//       errors.projectManagerId = "Project Manager ID is required.";
//     if (!startDate) errors.startDate = "Start date is required.";

//     if (Object.keys(errors).length > 0) {
//       return res.status(404).json({
//         success: false,
//         errors: errors,
//       });
//     }

//     // Handle uploaded documents
//     const documentArray = [];
//     if (Array.isArray(req.files)) {
//       req.files.forEach((file) => {
//         if (file.fieldname === "document[]") {
//           documentArray.push({
//             filepath: file.filename,
//             originalName: file.originalname,
//           });
//         }
//       });
//     }
//     // const getEmployee = await Employee.findOne({
//     //   _id: assignedTo,
//     // });
//     const reporter = await Employee.findOne({
//       _id: projectManagerId,
//     });
//     //match the email get the employeeName
//     // console.log(getEmployee, reporter);
//     // const getEmployeeName = getEmployee?.employeeName;
//     // const getEmployeeId = getEmployee?._id;
//     // console.log("reporter", reporter);
//     // const getReporterName = reporter?.employeeName;
//     // const getReporterId = reporter?._id;

//     const taskId = await generateTaskId();

//     const newTask = new Task({
//       taskId,
//       projectName,
//       title,
//       description,
//       assignedTo: assignedTo || null,
//       // employeeName: getEmployeeName,
//       // employeeId: getEmployeeId,
//       priority,
//       status,
//       startDate,
//       dueDate,
//       projectId,
//       document: documentArray,
//       // createdBy,
//       // projectManager,
//       // projectmanagerName: getReporterName,
//       projectManagerId,
//       // createdByName,
//       createdById,
//     });

//     const savedTask = await newTask.save();

//     //  Define taskLog outside the if block
//     const taskLog = {
//       taskId: savedTask.taskId,
//       startTime: new Date(),
//       status: "todo",
//       updatedBy: createdById,
//     };
//     const projectNameemail = await ProjectModel.findById(projectId);
//     console.log("projectNameemail", projectNameemail.name);
//     // Save task log
//     const taskLogEntry = new TaskLogsModel(taskLog);
//     await taskLogEntry.save();

//     // const notification = new NotificationSchema({
//     //   to: getEmployee.email,
//     //   subject: "New Task Created",
//     //   message: `Task "${projectNameemail.name}" assigned to ${getEmployeeName}`,
//     //   name: getEmployeeName,
//     //   template: "taskCreated",
//     // });
//     // console.log("notification", notification);
//     // await notification.save();

//     res.status(201).json({
//       success: true,
//       message: "Task created successfully",
//       task: savedTask,
//     });
//   } catch (error) {
//     console.error("Error creating task:", error);

//     if (error.name === "ValidationError") {
//       const errors = {};
//       for (let field in error.errors) {
//         errors[field] = error.errors[field].message;
//       }
//       return res.status(400).json({ success: false, errors });
//     }

//     return res.status(500).json({
//       success: false,
//       message: "Internal server error",
//     });
//   }
// };

// export default createTask;

const createTask = async (req, res) => {
  try {
    const {
      projectName,
      title,
      description,
      assignedTo,
      priority,
      status,
      startDate,
      dueDate,
      projectId,
      projectManagerId,
      createdById,
    } = req.body;

    // Validation
    const errors = {};
    if (!projectName) errors.projectName = "Project name is required.";
    if (!title) errors.title = "Title is required.";
    if (!description) errors.description = "Description is required.";
    // assignedTo and dueDate are optional as per your original code comments
    if (!priority) errors.priority = "Priority is required.";
    if (!status) errors.status = "Status is required.";
    if (!projectId) errors.projectId = "Project ID is required.";
    if (!createdById) errors.createdById = "CreatedBy ID is required.";
    if (!projectManagerId)
      errors.projectManagerId = "Project Manager ID is required.";
    if (!startDate) errors.startDate = "Start date is required.";

    if (Object.keys(errors).length > 0) {
      return res.status(400).json({
        success: false,
        errors,
      });
    }

    // Handle uploaded documents
    const documentArray = [];
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

    // Fetch reporter (project manager)
    const reporter = await Employee.findById(projectManagerId);
    if (!reporter) {
      return res.status(404).json({
        success: false,
        message: "Project manager not found.",
      });
    }

    // Generate taskId
    const taskId = await generateTaskId();

    // Create new task object
    const newTask = new Task({
      taskId,
      projectName,
      title,
      description,
      assignedTo: assignedTo || null,
      priority,
      status,
      startDate,
      dueDate,
      projectId,
      document: documentArray,
      projectManagerId,
      createdById,
    });

    const savedTask = await newTask.save();

    // Create and save task log
    const taskLog = {
      taskId: savedTask.taskId,
      startTime: new Date(),
      status: "todo",
      updatedBy: createdById,
    };
    const taskLogEntry = new TaskLogsModel(taskLog);
    await taskLogEntry.save();

    // Fetch project details including team members
    const projectDetails = await ProjectModel.findById(projectId);
    if (!projectDetails) {
      return res.status(404).json({
        success: false,
        message: "Project not found.",
      });
    }

    // Prepare notification variables
    let getEmployeeName = null;
    let getEmployeeEmail = null;

    if (assignedTo) {
      // Fetch assigned employee details
      const assignedEmployee = await Employee.findById(assignedTo);
      if (assignedEmployee) {
        getEmployeeName = assignedEmployee.employeeName;
        getEmployeeEmail = assignedEmployee.email;
      }
    }

    // Function to send notification
    const sendNotification = async (toEmail, subject, message, name) => {
      if (!toEmail) return; // Skip if no email

      const notification = new NotificationSchema({
        to: toEmail,
        subject,
        message,
        name,
        template: "taskCreated",
      });
      await notification.save();
    };

    if (assignedTo && getEmployeeEmail) {
      // Notify assigned employee
      await sendNotification(
        getEmployeeEmail,
        "New Task Created",
        `Task "${projectDetails.name}" assigned to ${getEmployeeName}`,
        getEmployeeName
      );
    } else {
      // Notify all team members if no assigned employee
      const teamMemberIds = projectDetails.teamMembers || [];
      const teamMembers = await Employee.find({ _id: { $in: teamMemberIds } });

      for (const member of teamMembers) {
        await sendNotification(
          member.email,
          "New Task Created",
          `Task "${projectDetails.name}" has been created.`,
          member.employeeName
        );
      }
    }

    return res.status(201).json({
      success: true,
      message: "Task created successfully",
      task: savedTask,
    });
  } catch (error) {
    console.error("Error creating task:", error);

    if (error.name === "ValidationError") {
      const errors = {};
      for (const field in error.errors) {
        errors[field] = error.errors[field].message;
      }
      return res.status(400).json({ success: false, errors });
    }

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// const allTaskList = async (req, res) => {
//   const type = req.query.type;
//   try {
//     let taskList;

//     if (type === "completed") {
//       taskList = await Task.find({ status: "completed" })
//         .populate([
//           { path: "projectId", select: "name" },
//           { path: "assignedTo", select: "employeeName" },
//         ])
//         .sort({
//           createdAt: -1,
//         });
//     } else {
//       taskList = await Task.find({ status: { $ne: "completed" } })
//         .populate([
//           { path: "projectId", select: "name" },
//           { path: "assignedTo", select: "employeeName" },
//         ])
//         .sort({
//           createdAt: -1,
//         });
//     }
//     if (!taskList || taskList.length === 0) {
//       return res
//         .status(200)
//         .json({ success: false, message: "No tasks found" });
//     }
//     // const addEmployeeDetails = await Promise.all(
//     //   taskList.map(async (taskDoc) => {
//     //     // Convert Mongoose document to plain JS object
//     //     const task = taskDoc.toObject();
//     //     const employeeDetails = await Employee.findOne({
//     //       email: task.assignedTo,
//     //     });
//     //     if (employeeDetails) {
//     //       task.name = employeeDetails.employeeName;
//     //       task.Email = employeeDetails.email;
//     //       task.Id = employeeDetails._id;
//     //       task.photo = employeeDetails.photo;
//     //     } else {
//     //       task.name = "Unknown";
//     //       task.Email = "";
//     //       task.Id = null;
//     //       task.photo = null;
//     //     }
//     //     return task;
//     //   })
//     // );
//     return res.status(200).json({
//       success: true,
//       message: "Task list retrieved",
//       data: taskList,
//     });
//   } catch (error) {
//     // console.error("Error in AllTaskList:", error);
//     return res.status(500).json({
//       success: false,
//       message: "Internal server error",
//       error: error.message,
//     });
//   }
// };
const allTaskList = async (req, res) => {
  const type = req.query.type;
  const page = parseInt(req.query.page) || 1; // default: page 1
  const limit = parseInt(req.query.limit) || 10; // default: 10 tasks per page

  try {
    let filter = {};

    // Apply filter based on type
    if (type === "completed") {
      filter.status = "completed";
    } else {
      filter.status = { $ne: "completed" };
    }

    // Count total documents
    const totalTasks = await Task.countDocuments(filter);

    // Fetch paginated tasks
    const taskList = await Task.find(filter)
      .populate([
        { path: "projectId", select: "name" },
        { path: "assignedTo", select: "employeeName" },
      ])
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit) // skip previous pages
      .limit(limit); // limit per page

    if (!taskList || taskList.length === 0) {
      return res
        .status(200)
        .json({ success: false, message: "No tasks found" });
    }

    //  Pagination metadata
    const totalPages = Math.ceil(totalTasks / limit);

    return res.status(200).json({
      success: true,
      message: "Task list retrieved",
      data: taskList,
      pagination: {
        totalTasks,
        totalPages,
        currentPage: page,
        limit,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

const allTaskListById = async (req, res) => {
  try {
    const { type, clientId } = req.query;

    if (!mongoose.Types.ObjectId.isValid(clientId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid clientId format",
      });
    }
    let projectDetails = await ProjectModel.find({
      clientName: clientId,
    }).select("_id name");

    let projectIds = projectDetails.map((p) => p._id);
    console.log("projectIds", projectIds);
    // if (clientId) {
    //   console.log("projectId", clientId);
    //   const projectObjectId = new mongoose.Types.ObjectId(clientId);
    //   const filteredProjectIds = projectIds.filter((p) =>
    //     p.equals(projectObjectId)
    //   );
    // projectIds = filteredProjectIds;
    console.log("projectIds after filter", projectIds);
    // }
    const filter = {
      projectId: { $in: projectIds },
    };
    console.log("filter before type", filter);

    if (type === "completed") {
      filter.status = "completed";
    } else {
      filter.status = { $ne: "completed" };
    }

    const taskList = await Task.find(filter)
      .sort({ createdAt: -1 })
      .populate([
        { path: "projectId", select: "name" },
        { path: "assignedTo", select: "employeeName" },
      ])
      .sort({ createdAt: -1 });

    if (!taskList || taskList.length === 0) {
      return res.status(200).json({
        success: false,
        message: "No tasks found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Task list retrieved successfully",
      data: taskList,
    });
  } catch (error) {
    console.error("Error in allTaskListById:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

const allTaskCompletedList = async (req, res) => {
  try {
    const taskList = await Task.find({ status: "completed" })
      .populate([
        { path: "projectId", select: "name" },
        { path: "assignedTo", select: "employeeName" },
      ])
      .sort({
        createdAt: -1,
      });
    if (!taskList || taskList.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "No tasks found" });
    }
    // const addEmployeeDetails = await Promise.all(
    //   taskList.map(async (taskDoc) => {
    //     // Convert Mongoose document to plain JS object
    //     const task = taskDoc.toObject();
    //     const employeeDetails = await Employee.findOne({
    //       email: task.assignedTo,
    //     });
    //     if (employeeDetails) {
    //       task.name = employeeDetails.employeeName;
    //       task.Email = employeeDetails.email;
    //       task.Id = employeeDetails._id;
    //       task.photo = employeeDetails.photo;
    //     } else {
    //       task.name = "Unknown";
    //       task.Email = "";
    //       task.Id = null;
    //       task.photo = null;
    //     }
    //     return task;
    //   })
    // );
    return res.status(200).json({
      success: true,
      message: "Task list retrieved",
      data: taskList,
    });
  } catch (error) {
    // console.error("Error in AllTaskList:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// //  GET ALL TASKS with Pagination
const getAllTasks = async (req, res) => {
  try {
    const { projectId, assignedTo } = req.query;
    // console.log("req.query", req.query);
    // Build dynamic filter
    const baseFilter = {};
    if (projectId) baseFilter.projectId = projectId;
    if (assignedTo) baseFilter.assignedTo = assignedTo;
    // find project id and get teamMembers one for todo

    // Fetch all task status groups with filter
    const [taskToDo, taskInProcess, taskInReview, taskDone] = await Promise.all(
      [
        Task.find({ ...baseFilter, status: "todo" }).populate([
          { path: "assignedTo", select: "employeeName" },
          { path: "createdById", select: "employeeName" },
          { path: "projectManagerId", select: "employeeName" },
          { path: "projectId", select: "name" },
        ]),
        Task.find({ ...baseFilter, status: "in-progress" }).populate([
          { path: "assignedTo", select: "employeeName " },
          { path: "createdById", select: "employeeName " },
          { path: "projectManagerId", select: "employeeName" },
          { path: "projectId", select: "name" },
        ]),
        Task.find({ ...baseFilter, status: "in-review" }).populate([
          { path: "assignedTo", select: "employeeName " },
          { path: "createdById", select: "employeeName " },
          { path: "projectManagerId", select: "employeeName" },
          { path: "projectId", select: "name" },
        ]),
        Task.find({ ...baseFilter, status: "done" }).populate([
          { path: "assignedTo", select: "employeeName " },
          { path: "createdById", select: "employeeName " },
          { path: "projectManagerId", select: "employeeName" },
          { path: "projectId", select: "name" },
        ]),
      ]
    );

    res.status(200).json({
      success: true,
      message: "Filtered tasks fetched successfully",
      counts: {
        taskToDo: taskToDo.length,
        taskInProcess: taskInProcess.length,
        taskInReview: taskInReview.length,
        taskDone: taskDone.length,
      },
      data: {
        taskToDo,
        taskInProcess,
        taskInReview,
        taskDone,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching tasks",
      error: error.message,
    });
  }
};

//  GET TASK BY ID
// const getTaskById = async (req, res) => {
//   console.log("id task");
//   const { taskId } = req.params;
//   // console.log("id task", taskId, req.params);
//   try {
//     const task = await Task.find({ taskId: taskId }).populate([
//       { path: "assignedTo", select: "employeeName " },
//       { path: "createdById", select: "employeeName " },
//       { path: "projectManagerId", select: "employeeName" },
//       { path: "projectId", select: "name" },
//     ]);
//     if (!task || !task.length > 0) {
//       return res
//         .status(400)
//         .json({ success: false, message: "project not found" });
//     }
//     res.status(200).json({ success: true, data: task });
//   } catch (error) {
//     res
//       .status(500)
//       .json({ message: "Error fetching task", error: error.message });
//   }
// };
const getTaskById = async (req, res) => {
  const { taskId } = req.params;

  try {
    const task = await Task.findOne({ taskId }).lean(); // use findOne and lean()

    if (!task) {
      return res
        .status(404)
        .json({ success: false, message: "Task not found" });
    }

    // Helper function to fetch user name from Employee or Admin
    const getUserName = async (userId) => {
      if (!userId) return null;
      const [employee, admin] = await Promise.all([
        Employee.findById(userId).select("employeeName").lean(),
        User.findById(userId).select("name").lean(),
      ]);
      return employee?.employeeName || admin?.name || null;
    };

    const [assignedToName, createdByName, projectManagerName, project] =
      await Promise.all([
        getUserName(task.assignedTo),
        getUserName(task.createdById),
        getUserName(task.projectManagerId),
        ProjectModel.findById(task.projectId).select("name ").lean(),
      ]);

    const subtasks = await SubTask.find({ taskId: task._id }).populate([
      { path: "assignedTo", select: "employeeName " },
    ]);

    const taskWithNames = {
      ...task,
      subtasks,
      assignedTo: { employeeName: assignedToName },
      projectId: { name: project?.name || null },
      createdById: { employeeName: createdByName },
      projectManagerId: { _id: task.projectManagerId, projectManagerName },
      // assignedToName:{},
      // createdByName,
      // projectManagerName,
    };

    console.log("taskWithNames", taskWithNames);
    res.status(200).json({ success: true, data: taskWithNames });
  } catch (error) {
    console.error("Fetch error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching task",
      error: error.message,
    });
  }
};

//  Fix missing assignedTo manually
const fixAssignedTo = async (tasks) => {
  for (const task of tasks) {
    const assignedToId = task.assignedTo?._id || task._doc?.assignedTo;
    if (!assignedToId) continue;

    if (!task.assignedTo || Object.keys(task.assignedTo).length === 0) {
      // If Employee not found, try Admin
      const admin = await User.findById(assignedToId).select("name");
      if (admin) {
        task.assignedTo = {
          _id: admin._id,
          employeeName: admin.name,
          type: "Admin",
        };
      }
    } else if (task.assignedTo.employeeName) {
      task.assignedTo = {
        _id: task.assignedTo._id,
        employeeName: task.assignedTo.employeeName,
        type: "Employee",
      };
    }
  }
};

const particularTask = async (req, res) => {
  try {
    //  Extract query parameters
    const {
      employeeId,
      projectId,
      day,
      searchTerm,
      page = 1,
      limit = 10,
    } = req.query;
    const pageInt = parseInt(page);
    const limitInt = parseInt(limit);
    console.log(employeeId, projectId, day);

    //  Base filter
    const baseFilter = {};

    // Date filter
    if (day) {
      const [year, month, date] = day.split("-");
      const startOfDay = new Date(Date.UTC(year, month - 1, date, 0, 0, 0));
      const endOfDay = new Date(
        Date.UTC(year, month - 1, date, 23, 59, 59, 999)
      );
      baseFilter.createdAt = { $gte: startOfDay, $lte: endOfDay };
    }

    // Project filter
    if (projectId) {
      baseFilter.projectId = new mongoose.Types.ObjectId(projectId);
    }

    // Employee filter for assigned tasks
    const todoFilter = { ...baseFilter, status: "todo" };
    const otherBaseFilter = { ...baseFilter };

    if (employeeId) {
      const employeeObjectId = new mongoose.Types.ObjectId(employeeId);

      const employeeProjects = await ProjectModel.find({
        $or: [
          { projectManagerId: employeeId },
          { teamMembers: { $in: [employeeId] } },
        ],
      }).select("_id");

      const projectIds = employeeProjects.map((p) => p._id);

      todoFilter.$or = [
        { assignedTo: employeeObjectId },
        { assignedTo: { $exists: false }, projectId: { $in: projectIds } },
        { assignedTo: null, projectId: { $in: projectIds } },
        { projectManagerId: employeeObjectId },
      ];

      otherBaseFilter.$or = [
        { assignedTo: employeeObjectId },
        { projectManagerId: employeeObjectId },
      ];
    }
    //  Fetch tasks with pagination
    const taskToDo = await Task.find(todoFilter)
      .populate([
        { path: "assignedTo", select: "employeeName" },
        { path: "projectId", select: "name" },
      ])
      .sort({ createdAt: -1 })
      .skip((pageInt - 1) * limitInt)
      .limit(limitInt);

    console.log("taskToDo", taskToDo);
    const taskByStatus = {};
    const todoCount = await Task.countDocuments(todoFilter);

    taskByStatus["todo"] = { taskToDo, todoCount };

    const statusList = [
      "in-progress",
      "in-review",
      "done",
      "block",
      "completed",
    ];

    await Promise.all(
      statusList.map(async (status) => {
        const tasks = await Task.find({ ...otherBaseFilter, status })
          .populate([
            { path: "assignedTo", select: "employeeName" },
            { path: "projectId", select: "name" },
          ])
          .sort({ createdAt: -1 })
          .skip((pageInt - 1) * limitInt)
          .limit(limitInt);

        const count = await Task.countDocuments({ ...otherBaseFilter, status });

        taskByStatus[status] = { tasks, count };
      })
    );

    //  Today tasks
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    const todayTasks = await Task.find({
      ...otherBaseFilter,
      createdAt: { $gte: todayStart, $lte: todayEnd },
    }).populate([
      { path: "assignedTo", select: "employeeName" },
      { path: "projectId", select: "name" },
    ]);

    //  Fix missing assignedTo manually
    await Promise.all([
      fixAssignedTo(taskToDo),
      ...statusList.map((s) => fixAssignedTo(taskByStatus[s].tasks)),
      fixAssignedTo(todayTasks),
    ]);

    //  Total projects and user tasks
    const totalProjectCount = employeeId
      ? await ProjectModel.countDocuments({
          $or: [
            { projectManager: employeeId },
            { teamMembers: { $in: [employeeId] } },
          ],
        })
      : await ProjectModel.countDocuments();

    const totalUserTasks = await Task.countDocuments(otherBaseFilter);

    const statusCounts = {
      todo: todoCount,
      ...Object.fromEntries(statusList.map((s) => [s, taskByStatus[s].count])),
    };
    const findMaxValue = Math.max(...Object.values(statusCounts));
    //  Response
    res.status(200).json({
      success: true,
      message: "Tasks fetched successfully",
      pagination: {
        currentPage: pageInt,
        limit: limitInt,
        totalTodoTasks: findMaxValue,
        totalPages: Math.ceil(findMaxValue / limitInt),
      },
      counts: {
        totalProjectCount,
        totalUserTasks,
        todayTasks: todayTasks.length,
      },
      data: {
        taskToDo,
        taskInProcess: taskByStatus["in-progress"].tasks,
        taskInReview: taskByStatus["in-review"].tasks,
        taskDone: taskByStatus["done"].tasks,
        taskBlock: taskByStatus["block"].tasks,
        taskCompleted: taskByStatus["completed"].tasks,
        todayTasks,
        statusCounts,
      },
    });
  } catch (error) {
    // console.error("Fetch error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching tasks",
      error: error.message,
    });
  }
};
const particularTaskById = async (req, res) => {
  try {
    const { employeeId, projectId, day, page = 1, limit = 10 } = req.query;
    const pageInt = parseInt(page);
    const limitInt = parseInt(limit);
    console.log(employeeId, projectId, day);
    // 🟢 1. Fetch all project details by default
    let projectDetails = await ProjectModel.find({
      clientName: employeeId,
    }).select("_id name");

    // 🟢 2. Collect all project IDs
    let projectIds = projectDetails.map((p) => p._id);
    console.log("projectIds", projectIds);
    // 🟢 3. Filter by projectId if provided

    // 🟢 4. Filter by employeeId if provided (optional)
    // if (employeeId && employeeId !== "all") {
    //   projectDetails = projectDetails.filter(p => p.clientName === employeeId);
    //   projectIds = projectDetails.map(p => p._id);
    // }

    //     console.log("employeeId:", employeeId, "projectId:", projectId, "day:", day);

    //     //  Build project filter
    //     let projectIds = [];

    // =======
    //     // 🟢 5. Handle case: no projects found
    //     // if (projectIds.length === 0) {
    //     //   return res.status(200).json({
    //     //     success: true,
    //     //     message: "No projects found",
    //     //     projectDetails,
    //     //     data: {
    //     //       taskToDo: [],
    //     //       taskInProcess: [],
    //     //       taskInReview: [],
    //     //       taskDone: [],
    //     //       taskBlock: [],
    //     //       taskCompleted: [],
    //     //     },
    //     //   });
    //     // }
    //     let baseFilter = {};

    if (projectId) {
      console.log("projectId", projectId);
      const projectObjectId = new mongoose.Types.ObjectId(projectId);
      const filteredProjectIds = projectIds.filter((p) =>
        p.equals(projectObjectId)
      );
      projectIds = filteredProjectIds;
    }
    console.log("projectIds after filter", projectIds);
    if (projectId) {
      baseFilter = { projectId: { $in: projectIds } };
    } else {
      baseFilter = { projectId: { $in: projectIds } };
    }
    console.log("baseFilter", baseFilter);
    //  6. Base filter for tasks

    // console.log("baseFilter", baseFilter);
    // 🗓️ Apply day filter if provided
    if (day) {
      const [year, month, date] = day.split("-");
      baseFilter.createdAt = {
        $gte: new Date(Date.UTC(year, month - 1, date, 0, 0, 0)),
        $lte: new Date(Date.UTC(year, month - 1, date, 23, 59, 59, 999)),
      };
    }

    // 🟢 7. Fetch tasks by status
    const todoFilter = { ...baseFilter, status: "todo" };

    // // Employee-based filters for TODO
    // if (employeeId && employeeId !== "all") {
    //   todoFilter.$or = [
    //     { assignedTo: { $exists: false } },
    //     { assignedTo: null },
    //   ];
    // }

    // ✅ Fetch TODO tasks
    const taskToDo = await Task.find(todoFilter)
      .populate([
        { path: "assignedTo", select: "employeeName" },
        { path: "projectId", select: "name" },
      ])
      .sort({ createdAt: -1 })
      .skip((pageInt - 1) * limitInt)
      .limit(limitInt);
    // console.log("taskToDo", taskToDo);
    const todoCount = await Task.countDocuments(todoFilter);

    // ✅ Fetch other statuses
    const statusList = [
      "in-progress",
      "in-review",
      "done",
      "block",
      "completed",
    ];
    const taskByStatus = {};

    await Promise.all(
      statusList.map(async (status) => {
        const statusFilter = { ...baseFilter, status };
        const tasks = await Task.find(statusFilter)
          .populate([
            { path: "assignedTo", select: "employeeName" },
            { path: "projectId", select: "name" },
          ])
          .sort({ createdAt: -1 })
          .skip((pageInt - 1) * limitInt)
          .limit(limitInt);

        const count = await Task.countDocuments(statusFilter);
        taskByStatus[status] = { tasks, count };
      })
    );

    // 🧮 8. Count totals
    const totalProjectCount = projectIds.length;
    const totalUserTasks = await Task.countDocuments(baseFilter);
    const statusCounts = {
      todo: todoCount,
      ...Object.fromEntries(statusList.map((s) => [s, taskByStatus[s].count])),
    };

    // 🟢 9. Final response
    res.status(200).json({
      success: true,
      message: "Tasks fetched successfully",
      projectDetails,
      pagination: {
        currentPage: pageInt,
        limit: limitInt,
        totalTodoTasks: todoCount,
        totalPages: Math.ceil(todoCount / limitInt),
      },
      counts: {
        totalProjectCount,
        totalUserTasks,
      },
      data: {
        taskToDo,
        taskInProcess: taskByStatus["in-progress"].tasks,
        taskInReview: taskByStatus["in-review"].tasks,
        taskDone: taskByStatus["done"].tasks,
        taskBlock: taskByStatus["block"].tasks,
        taskCompleted: taskByStatus["completed"].tasks,
        statusCounts,
      },
    });
  } catch (error) {
    console.error("Fetch error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching tasks",
      error: error.message,
    });
  }
};

const updateTask = async (req, res) => {
  // console.log("Update task request body:", req.params.id, req.body);

  try {
    const { id } = req.params;

    // Find the task first
    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    // Destructure fields from body
    const {
      projectName,
      title,
      description,
      assignedTo,
      priority,
      dueDate,
      startDate,
      projectId,
      createdById,
      status,
      projectManagerId,
    } = req.body;

    // Update only if values are provided
    if (projectName) task.projectName = projectName;
    if (title) task.title = title;
    if (description) task.description = description;
    if (assignedTo) task.assignedTo = assignedTo;
    if (priority) task.priority = priority;
    if (dueDate != "undefined") task.dueDate = dueDate;
    if (startDate) task.startDate = startDate;
    if (projectId) task.projectId = projectId || task.projectId;
    // if (createdById) task.createdById = createdById || task.createdById;
    // if(projectManagerId) task.projectManagerId=projectManagerId || task.projectManagerId;
    //  if (status) task.status = status || task.status;

    // Handle file upload (if any)
    // if (Array.isArray(req.files) && req.files.length > 0) {
    //   const documentArray = req.files
    //     .filter((file) => file.fieldname === "document[]")
    //     .map((file) => ({
    //       filepath: file.filename,
    //       originalName: file.originalname,
    //     }));
    //   task.document = documentArray;
    // }
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
    task.document = task.document.concat(newDocuments);
    // Save updated task
    const updatedTask = await task.save();

    const notification = new NotificationSchema({
      to: assignedTo,
      subject: "New Task Created",
      message: `Task "${projectName}" assigned to ${assignedTo}`,
      name: assignedTo,
      template: "taskCreated",
    });

    await notification.save();

    res.status(200).json({
      message: "Task updated successfully",
      task: updatedTask,
    });
  } catch (error) {
    // console.error("Error updating task:", error);
    res.status(500).json({
      message: "Error updating task",
      error: error.message,
    });
  }
};

// PATCH /api/tasks/:id/status
// const updateTaskStatus = async (req, res) => {
//   try {
//     const { status, startTime, endTime, updatedBy } = req.body;
//     console.log(req.params.id);
//     // Validate status input
//     const allowedStatuses = ["todo", "in-progress", "in-review", "done"];
//     if (!allowedStatuses.includes(status)) {
//       return res.status(400).json({ message: "Invalid status value" });
//     }
//     const findTask = await Task.findOne({ taskId: req.params.id });
//     if (!findTask) {
//       res.status(404).json({ success: false, message: "data not found" });
//     }
//     if (
//       status === "done" &&
//       (findTask.projectManager !== updatedBy ||
//         updatedBy !== "hrmsaryutechnologies@gmail.com")
//     ) {
//       res
//         .status(403)
//         .json({
//           sucess: false,
//           message: "Only Admin and ProjectManger move to done",
//         });
//     }

//     const updatedTask = await Task.findOneAndUpdate(
//       { taskId: req.params.id },
//       { $set: { status: status, startTime: startTime, endTime: endTime } },
//       { new: true, runValidators: true } // ensures only updating fields are validated,
//     );

//     if (!updatedTask) {
//       return res.status(404).json({ message: "Task not found" });
//     }
//     // update task logs
//     const taskLog = {
//       taskId: updatedTask.taskId,
//       startTime: new Date(),
//       // endTime: endTime || new Date(),
//       status: status,
//       updatedBy: updatedBy , // Assuming updatedBy is passed in the request body
//     };
//     // Save task log
//     const taskLogEntry = new TaskLogsModel(taskLog);
//     await taskLogEntry.save();
//     res.status(200).json({
//       success: true,
//       message: "Task status updated",
//       task: updatedTask,
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: "Error updating task status",
//       error: error.message,
//     });
//   }
// };
// const updateTaskStatus = async (req, res) => {
//   try {
//     const { status, startTime, endTime, updatedBy } = req.body;
//     console.log("1", req.body);
//     const { id } = req.params;

//     const allowedStatuses = [
//       "todo",
//       "in-progress",
//       "in-review",
//       "done",
//       "block",
//       "completed",
//     ];
//     if (!allowedStatuses.includes(status)) {
//       return res.status(400).json({ message: "Invalid status value" });
//     }

//     const findTask = await Task.findOne({ taskId: id });
//     if (!findTask) {
//       return res
//         .status(404)
//         .json({ success: false, message: "Task not found" });
//     }

//     const lastStatusLog = await TaskLogsModel.findOne({ taskId: id }).sort({
//       createdAt: -1,
//     }); // Sort by latest

//     if (lastStatusLog && lastStatusLog.status === "hold") {
//       return res
//         .status(404)
//         .json({ success: false, message: "Restart the Task" });
//     }

//     if (
//       (status === "done" || status === "completed") &&
//       updatedBy !== String(findTask.projectManager) && // ensure string comparison
//       updatedBy !== "hrmsaryutechnologies@gmail.com"
//     ) {
//       return res.status(403).json({
//         success: false,
//         message: "Only Admin and Project Manager can move task to 'done'",
//       });
//     }

//     const findByAssignnedTo = await Task.findOne({
//       taskId: id,
//     });
//     let updatedTask;
//     if (findByAssignnedTo.assignedTo) {
//       updatedTask = await Task.findOneAndUpdate(
//         { taskId: id },
//         {
//           $set: {
//             status,
//             startTime,
//             endTime,
//           },
//         },
//         { new: true, runValidators: true }
//       );
//     } else {
//       updatedTask = await Task.findOneAndUpdate(
//         { taskId: id },
//         {
//           $set: {
//             status,
//             startTime,
//             endTime,
//             assignedTo: updatedBy,
//           },
//         },
//         { new: true, runValidators: true }
//       );
//     }

//     if (!updatedTask) {
//       return res
//         .status(404)
//         .json({ success: false, message: "Task not found during update" });
//     }
//     // Save task log
//     console.log("2", updatedBy);
//     const taskLogEntry = new TaskLogsModel({
//       taskId: updatedTask.taskId,
//       status,
//       updatedBy,
//       startTime: new Date(),
//     });
//     await taskLogEntry.save();
//     res.status(200).json({
//       success: true,
//       message: "Task status updated",
//       task: updatedTask,
//     });
//   } catch (error) {
//     if (error.name === "ValidationError") {
//       const errors = {};
//       for (let field in error.errors) {
//         errors[field] = error.errors[field].message;
//       }
//       return res.status(400).json({ errors });
//     } else {
//       res.status(500).json({ success: false, error: "Internal Server Error" });
//     }
//     res.status(500).json({
//       success: false,
//       message: "Error updating task status",
//       error: error.message,
//     });
//   }
// };
const updateTaskStatus = async (req, res) => {
  try {
    const { status, startTime, endTime, updatedBy } = req.body;
    const { id } = req.params;

    console.log("Request Body:", req.body);

    // Step 1: Validate status
    const allowedStatuses = [
      "todo",
      "in-progress",
      "in-review",
      "done",
      "block",
      "completed",
    ];
    //check already tast is in-progress
    const findInprocessTask = await Task.find({
      status: "in-progress",
      assignedTo: new mongoose.Types.ObjectId(updatedBy),
    });

    // console.log("findInprocessTask", findInprocessTask);
    if (status === "in-progress") {
      for (let task of findInprocessTask) {
        if (
          status == "in-progress" &&
          task &&
          task.pauseComments &&
          task.pauseComments.length == 0
        ) {
          return res.status(404).json({
            success: false,
            message:
              "Please hold or complete the previous task before starting a new one.",
          });
        }
        if (task && task.pauseComments && task.pauseComments.length > 0) {
          const latestPause = [...task.pauseComments].reverse()[0];
          // console.log("latestPause", latestPause.pauseCondition);
          if (latestPause.pauseCondition !== "hold") {
            return res.status(404).json({
              success: false,
              message:
                "Please hold or complete the previous task before starting a new one.",
            });
          }
        }
      }
    }

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    // Step 2: Find the task
    const findTask = await Task.findOne({ taskId: id });

    if (!findTask) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    if (findTask && findTask.status === "todo" && status !== "in-progress") {
      return res.status(403).json({
        success: false,
        message: "Task is on todo,Please  move on Inprogress.",
      });
    }
    console.log("findTask", findTask);
    const findSubTask = await SubTask.find({ taskId: findTask._id });
    console.log("findSubTask", findSubTask);
    // if (status !== "todo" && status !== "in-progress") {
    // if (findSubTask && findSubTask.length > 0) {
    //   findSubTask.forEach((subtask) => {
    //     if (subtask.status !== "done") {
    //       return res.status(403).json({
    //         success: false,
    //         message:
    //           "Please complete all subtasks before moving the main task to done.",
    //       });
    //     }
    //   });
    // }
    // }
    if (status !== "todo" && status !== "in-progress") {
      if (findSubTask.length > 0) {
        for (let subtask of findSubTask) {
          if (subtask.status !== "done") {
            return res.status(403).json({
              success: false,
              message:
                "Please complete all subtasks before moving the main task to done.",
            });
          }
        }
      }
    }

    // Step 3: Check if task is on hold
    const lastStatusLog = await TaskLogsModel.findOne({ taskId: id }).sort({
      createdAt: -1,
    });

    if (lastStatusLog && lastStatusLog.status === "hold") {
      return res.status(403).json({
        success: false,
        message: "Task is on hold. Please restart the task first.",
      });
    }
    // check tester start the task befour moving down,
    const findtesterStartTheTask = await TaskLogsModel.find({
      taskId: id,
      status: "start",
      updatedBy: new mongoose.Types.ObjectId(updatedBy),
    });

    if (status === "done" && findtesterStartTheTask.length == 0) {
      return res.status(403).json({
        success: false,
        message: "Task has not been started. Please start the task first.",
      });
    }

    // Step 4: Authorization - Only PM or admin can mark "done"/"completed"
    // console.log(
    //   updatedBy == findTask.projectManagerId,
    //   updatedBy == superAdmin._id,
    //   superAdmin._id,
    //   updatedBy,
    //   findTask.projectManagerId
    // );

    const superAdmin = await User.findOne({ superUser: true });
    // console.log(
    //   updatedBy,
    //   superAdmin._id,
    //   findTask.projectManagerId,
    //   findTask.projectManagerId.toString(),
    //   updatedBy == superAdmin._id.toString()
    // );

    if (
      (status === "done" || status === "completed") &&
      updatedBy !== findTask.projectManagerId.toString() &&
      updatedBy !== superAdmin._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message:
          "Only Project Manager or Admin can mark task as done/completed",
      });
    }

    // Step 5: Prepare update fields
    const updateFields = {
      status,
      startTime,
      endTime,
    };

    // If task not assigned yet, assign it to updatedBy

    if (!findTask.assignedTo && status == "in-progress") {
      updateFields.assignedTo = updatedBy;
    }

    // Step 6: Update the task
    const updatedTask = await Task.findOneAndUpdate(
      { taskId: id },
      { $set: updateFields },
      { new: true, runValidators: true }
    );

    if (!updatedTask) {
      return res.status(404).json({
        success: false,
        message: "Task not found during update",
      });
    }

    // Step 7: Save task log
    const taskLogEntry = new TaskLogsModel({
      taskId: updatedTask.taskId,
      status,
      updatedBy,
      startTime: new Date(), // You could also use startTime from req.body
    });

    await taskLogEntry.save();

    return res.status(200).json({
      success: true,
      message: "Task status updated successfully",
      task: updatedTask,
    });
  } catch (error) {
    console.error("Error updating task:", error);

    if (error.name === "ValidationError") {
      const errors = {};
      for (let field in error.errors) {
        errors[field] = error.errors[field].message;
      }
      return res.status(400).json({ errors });
    }

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

// const tasklogsList = async (req, res) => {
//   try {
//     const { taskId } = req.params;
//     const tasklogList = await TaskLogsModel.find({ taskId: taskId }).populate(
//       "updatedBy",
//       "employeeName"
//     );
//     if (!tasklogList) {
//       return res.status(404).json({ message: "Data is not found" });
//     }
//     res.status(200).json({ success: true, data: tasklogList });
//   } catch (error) {
//     return res
//       .status(500)
//       .json({ success: false, message: "Internal server eroor" });
//   }
// };
const tasklogsList = async (req, res) => {
  try {
    const { taskId } = req.params;

    const tasklogList = await TaskLogsModel.find({ taskId }).lean(); // Use lean()

    if (!tasklogList || tasklogList.length === 0) {
      return res.status(404).json({ success: false, message: "No logs found" });
    }

    // Helper to get user name from either collection
    const getUserName = async (userId) => {
      if (!userId) return null;

      const [employee, admin] = await Promise.all([
        Employee.findById(userId).select("employeeName").lean(),
        User.findById(userId).select("name").lean(),
      ]);

      return employee?.employeeName || admin?.name || "Unknown User";
    };

    // Map logs and add updatedByName
    const enrichedLogs = await Promise.all(
      tasklogList.map(async (log) => {
        const updatedByName = await getUserName(log.updatedBy);
        return {
          ...log,
          updatedBy: { employeeName: updatedByName },
        };
      })
    );

    return res.status(200).json({
      success: true,
      data: enrichedLogs,
    });
  } catch (error) {
    // console.error("Error fetching task logs:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

//  DELETE TASK
const deleteTask = async (req, res) => {
  try {
    // console.log("Delete task request body:", req.params.id);
    const deleted = await Task.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Task not found" });

    res.status(200).json({ success: true, message: "Task deleted" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting task", error: error.message });
  }
};

// task comments
const particularTaskComments = async (req, res) => {
  const { comment, document, taskId, createdBy } = req.body;
  // console.log("hello", req.body);
  try {
    if (!comment || !taskId || !createdBy) {
      return res
        .status(400)
        .json({ success: true, message: "Require all details" });
    }
    const documentArray = [];
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
    const userCommments = new TaskComments({
      comment,
      document: documentArray,
      taskId,
      createdBy,
    });

    // console.log("dddddd gggggg", req.body);
    await userCommments.save();
    res.status(200).json({
      success: true,
      message: "Successfully Created",
      data: userCommments,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "internal server error" });
  }
};

// get particular comment

const getParticularTaskComments = async (req, res) => {
  const { id } = req.params;

  try {
    const comments = await TaskComments.find({ taskId: id });
    console.log("comments", comments);
    if (!comments || comments.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "No comments found for this task" });
    }

    const addEmployeeDetails = await Promise.all(
      comments.map(async (commentDoc) => {
        // Convert Mongoose document to plain JS object
        const comment = commentDoc.toObject();

        const employeeDetails = await Employee.findOne({
          _id: new mongoose.Types.ObjectId(comment.createdBy),
        });

        const AdminDetails = await User.findOne({
          _id: new mongoose.Types.ObjectId(comment.createdBy),
        });

        // const HrDetails = await userModel.findOne({
        //   name: "HR",
        // });
        if (employeeDetails) {
          comment.name = employeeDetails.employeeName;
          comment.Email = employeeDetails.email;
          comment.Id = employeeDetails._id;
          comment.photo = employeeDetails.photo;
        } else if (!employeeDetails) {
          comment.name = AdminDetails?.name;
          comment.Email = AdminDetails.email;
          comment.Id = AdminDetails._id;
          comment.photo = null;
        } else {
          comment.name = "Unknown";
          comment.Email = "";
          comment.Id = null;
          comment.photo = null;
        }

        return comment;
      })
    );

    return res.status(200).json({
      success: true,
      message: "User comments list retrieved",
      data: addEmployeeDetails,
    });
  } catch (error) {
    // console.error("Error in getParticularTaskComments:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
// const taskHold = async (req, res) => {
//   const { id } = req.params;
//   const { pauseProject, note,updatedBy } = req.body;

//   try {

//     if (!pauseProject || !note?.trim()) {
//       return res.status(400).json({
//         success: false,
//         message: "Both 'pauseProject' and 'note' are required",
//       });
//     }

//     const pauseEntry = {
//       note: note.trim(),
//       pauseCondition: pauseProject,
//       time: new Date(),
//       updatedBy:updatedBy
//     };

//     const updatedTask = await Task.findOneAndUpdate(
//       { taskId: id },
//       {
//         // $set: { pauseProject: pauseProject.trim() },
//         $push: { pauseComments: pauseEntry },
//       },
//       { new: true } // return the updated document
//     );

//     if (!updatedTask) {
//       return res
//         .status(404)
//         .json({ success: false, message: "Task not found" });
//     }
//     const taskHoldLogs=await new TaskLogsModel(pauseEntry
//     );
//     await taskHoldLogs.save();

//     res.status(200).json({
//       success: true,
//       message: `Task ${
//         pauseProject === "hold" ? "paused" : "resumed"
//       } successfully`,
//       data: updatedTask,
//     });
//   } catch (error) {
//     console.error("Error updating task hold status:", error);
//     res.status(500).json({
//       success: false,
//       message: "Internal server error",
//       error: error.message,
//     });
//   }
// };

// const taskHold = async (req, res) => {
//   const { id } = req.params;
//   const { pauseProject, note, updatedBy } = req.body;

//   try {
//     if (!pauseProject?.trim() || !note?.trim()) {
//       return res.status(400).json({
//         success: false,
//         message: "Both 'pauseProject' and 'note' are required",
//       });
//     }

//     // If resuming, make sure no other task is already active

//     // Find all in-progress tasks for the user
//     const inProgressTasks = await Task.find({
//       status: "in-progress",
//       assignedTo: new mongoose.Types.ObjectId(updatedBy),
//     });

//     let activeTaskCount = 0;
//     let otherActiveTaskExists = false;

//     if (pauseProject === "restart") {
//       for (const task of inProgressTasks) {
//         if (task.pauseComments?.length > 0) {
//           const lastComment = task.pauseComments[task.pauseComments.length - 1];

//           // Count task as active if it's NOT on hold
//           if (lastComment.pauseCondition !== "hold") {
//             activeTaskCount++;

//             // Check if this is a different task from the current one being restarted
//             if (task.taskId !== id) {
//               otherActiveTaskExists = true;
//             }
//           }
//         }
//       }

//       //  Case: One task in progress, but it's not the current task
//       if (activeTaskCount === 1 && otherActiveTaskExists) {
//         return res.status(400).json({
//           success: false,
//           message:
//             "Another task is already in progress. Please hold it before resuming this task.",
//         });
//       }

//       //  Case: Two or more tasks active (shouldn't happen)
//       if (activeTaskCount > 1) {
//         return res.status(400).json({
//           success: false,
//           message:
//             "Multiple tasks are already in progress. Please hold all other tasks before resuming this one.",
//         });
//       }

//     }
//      //  Case: No task in progress, or only this task is active — allow restart
//     const pauseEntry = {
//       note: note.trim(),
//       pauseCondition: pauseProject.trim(),
//       time: new Date().toISOString(),
//       updatedBy,
//     };

//     const updatedTask = await Task.findOneAndUpdate(
//       { taskId: id },
//       {
//         $push: { pauseComments: pauseEntry },
//       },
//       { new: true }
//     );

//     if (!updatedTask) {
//       return res.status(404).json({
//         success: false,
//         message: "Task not found",
//       });
//     }

//     const taskHoldLogs = new TaskLogsModel({
//       taskId: id,
//       startTime: new Date().toISOString(),
//       status: pauseProject,
//       note: note.trim(),
//       updatedBy,
//     });

//     await taskHoldLogs.save();

//     res.status(200).json({
//       success: true,
//       message: `Task ${
//         pauseProject === "hold" ? "paused" : "resumed"
//       } successfully`,
//       data: updatedTask,
//     });
//   } catch (error) {
//     console.error("Error updating task hold status:", error);
//     res.status(500).json({
//       success: false,
//       message: "Internal server error",
//       error: error.message,
//     });
//   }
// };
const taskHold = async (req, res) => {
  const { id } = req.params;
  const { pauseProject, note, updatedBy } = req.body;

  try {
    // Validate input
    if (!pauseProject?.trim() || !note?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Both 'pauseProject' and 'note' are required",
      });
    }

    // Check for conflicting active tasks when restarting
    if (pauseProject === "restart") {
      const inProgressTasks = await Task.find({
        status: "in-progress",
        assignedTo: new mongoose.Types.ObjectId(updatedBy),
      });

      let activeTasks = [];

      for (const task of inProgressTasks) {
        const lastComment = task.pauseComments?.[task.pauseComments.length - 1];

        if (lastComment && lastComment.pauseCondition !== "hold") {
          activeTasks.push(task);
        }
      }

      // Block if another task (not the current one) is already active
      if (
        activeTasks.length === 1 &&
        String(activeTasks[0].taskId) !== String(id)
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Another task is already in progress. Please hold it before resuming this task.",
        });
      }

      if (activeTasks.length > 1) {
        return res.status(400).json({
          success: false,
          message:
            "Multiple tasks are already in progress. Please hold all other tasks before resuming this one.",
        });
      }
    }

    // Proceed to pause or resume the task
    const pauseEntry = {
      note: note.trim(),
      pauseCondition: pauseProject.trim(),
      time: new Date().toISOString(),
      updatedBy,
    };

    const updatedTask = await Task.findOneAndUpdate(
      { taskId: id },
      {
        $push: { pauseComments: pauseEntry },
      },
      { new: true }
    );

    if (!updatedTask) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    // Save log
    const taskHoldLogs = new TaskLogsModel({
      taskId: id,
      startTime: new Date().toISOString(),
      status: pauseProject,
      note: note.trim(),
      updatedBy,
    });

    await taskHoldLogs.save();

    return res.status(200).json({
      success: true,
      message: `Task ${
        pauseProject === "hold" ? "paused" : "resumed"
      } successfully`,
      data: updatedTask,
    });
  } catch (error) {
    console.error("Error updating task hold status:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

const testerStatus = async (req, res) => {
  try {
    const { taskId, testerStatus, updatedBy } = req.body;
    console.log("req.body", req.body);

    if (!taskId || !testerStatus || !updatedBy) {
      return res.status(400).json({
        success: false,
        message: "taskId, tasterStatus, and updatedBy are required",
      });
    }

    const updatedTask = await Task.findOneAndUpdate(
      { taskId: taskId },
      { $set: { testerStatus: testerStatus } },
      { new: true }
    );
    // console.log("update", updatedTask);

    if (!updatedTask) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    const taskLogEntry = new TaskLogsModel({
      taskId: taskId,
      status: testerStatus !== "1" ? "yet to start" : "start",
      updatedBy,
      startTime: new Date(),
    });

    await taskLogEntry.save();

    res.status(200).json({
      success: true,
      message: "Tester status updated successfully",
      data: updatedTask,
    });
  } catch (error) {
    console.error("Error updating tester status:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// const particularMonthlyReport = async (req, res) => {
//   const { employeeEmail, month } = req.query;

//   try {
//     const [monthNum, year] = month.toString().split("-").map(Number);
//     const daysInMonth = new Date(year, monthNum, 0).getDate();
//     const results = [];

//     for (let day = 1; day <= daysInMonth; day++) {
//       const currentDate = new Date(Date.UTC(year, monthNum - 1, day));
//       const dayStart = new Date(currentDate);
//       const dayEnd = new Date(currentDate);
//       dayEnd.setUTCHours(23, 59, 59, 999);

//       const taskLogsList = await TaskLogsModel.find({
//         status: "in-review",
//         updatedAt: { $gte: dayStart, $lte: dayEnd },
//       });

//       const taskIds = taskLogsList.map((log) => log.taskId);

//       const tasks = await Task.find({
//         taskId: { $in: taskIds },
//         assignedTo: employeeEmail,
//         endTime: { $gte: dayStart, $lte: dayEnd },
//       });

//       const logsMap = await TaskLogsModel.find({ taskId: { $in: taskIds } });

//       const taskWithLogs = tasks.map((task) => ({
//         ...task.toObject(),
//         logs: logsMap.filter((log) => log.taskId === task.taskId),
//       }));

//       results.push({
//         date: dayStart.toISOString().split("T")[0],
//         tasks: taskWithLogs,
//       });
//     }

//     return res.status(200).json({ success: true, data: results });
//   } catch (error) {
//     console.error("Error in particularMonthlyReport:", error);
//     return res.status(500).json({ success: false, message: "Internal server error" });
//   }
// };
const particularMonthlyReport = async (req, res) => {
  const { employeeId, month } = req.query;
  // console.log(employeeId,month)

  try {
    const [monthNum, year] = month.toString().split("-").map(Number);
    const daysInMonth = new Date(year, monthNum, 0).getDate();
    const results = [];
    const today = new Date();
    const todaydate = today.getDate();

    for (let day = 1; day <= daysInMonth; day++) {
      const currentDate = new Date(Date.UTC(year, monthNum - 1, day));
      const dayStart = new Date(currentDate);
      const dayEnd = new Date(currentDate);
      dayEnd.setUTCHours(23, 59, 59, 999);

      // Step 1: Get all logs where a task was moved to 'in-review' today
      const taskLogsList = await TaskLogsModel.find({
        status: "in-review",
        updatedAt: { $gte: dayStart, $lte: dayEnd },
      });

      const taskIds = taskLogsList.map((log) => log.taskId);

      // Step 2: Get tasks assigned to this employee & ended today
      const tasks = await Task.find({
        taskId: { $in: taskIds },
        $or: [
          { assignedTo: new mongoose.Types.ObjectId(employeeId) },
          { projectManagerId: new mongoose.Types.ObjectId(employeeId) },
        ],
        endTime: { $gte: dayStart, $lte: dayEnd },
      }).populate({ path: "projectId", select: "name" });

      const taskWithLogs = [];

      for (const task of tasks) {
        const Alllogs = await TaskLogsModel.find({ taskId: task.taskId }).sort({
          startTime: 1,
        });

        // const logs = await TaskLogsModel.find({
        //   taskId: task.taskId,
        //   updatedBy: new mongoose.Types.ObjectId(employeeId),
        // }).sort({
        //   startTime: 1,
        // });

        const logsWithUpdatedBy = [];
        for (const log of Alllogs) {
          let updatedByName = "";

          // Try finding in Employee
          let emp = await Employee.findOne({
            _id: new mongoose.Types.ObjectId(log.updatedBy),
          }).select("employeeName");

          if (emp) {
            updatedByName = emp.employeeName;
          } else {
            // If not in Employee, try User model
            let user = await userModel
              .findOne({ _id: log.updatedBy })
              .select("name");
            updatedByName = user ? user.name : "Unknown";
          }

          logsWithUpdatedBy.push({
            ...log.toObject(),
            updatedByName,
          });
        }

        let findEmployeeName = await Employee.find({
          _id: new mongoose.Types.ObjectId(task.assignedTo),
        }).select("employeeName");

        let taskAssignedName =
          findEmployeeName.length > 0 ? findEmployeeName[0].employeeName : "";
        if (!(findEmployeeName.length > 0)) {
          findEmployeeName = await userModel
            .find({ _id: task.assignedTo })
            .select("name");
          taskAssignedName =
            findEmployeeName.length > 0 ? findEmployeeName[0].name : "";
        }
        // console.log(taskAssignedName);

        // const matchStatus = [
        //   "in-progress",
        //   "hold",
        //   "restart",
        //   "in-review",
        //   "start",
        //   "done",
        // ];

        // new code

        // const allLogs = await TaskLogsModel.find({ taskId: task.taskId }).sort({
        //   createdAt: 1,
        // });
        // console.log("Alllogs", Alllogs);

        // const developerFlow = allLogs.filter((log) =>
        //   devStatuses.includes(log.status)
        // );
        // const testerFlow = allLogs.filter((log) =>
        //   testerStatuses.includes(log.status)
        // );
        // console.log("developerFlow", developerFlow, "testerFlow", testerFlow);

        function splitFlows(logs) {
          const developerFlow = [];
          const testerFlow = [];

          let devStarted = false;
          let testerStarted = false;

          for (const log of logs) {
            // Developer flow: from first "todo" to first "in-review"
            if (!devStarted && log.status === "in-progress") {
              devStarted = true;
            }

            if (devStarted && !testerStarted) {
              developerFlow.push(log);
              if (log.status === "in-review") devStarted = false;
              continue;
            }

            // Tester flow: from first "start" to first "done"
            if (!testerStarted && log.status === "start") {
              testerStarted = true;
            }
            if (testerStarted) {
              testerFlow.push(log);
              if (log.status === "done") testerStarted = false;
            }
          }

          return { developerFlow, testerFlow };
        }

        const { developerFlow, testerFlow } = splitFlows(Alllogs);
        console.log("developerFlow", developerFlow, "testerFlow", testerFlow);
        // Duration calc (developer flow only)
        let totalDuration = 0;
        let previousTime = null;

        developerFlow.forEach((log) => {
          if (previousTime) {
            // add duration to total BEFORE checking hold
            totalDuration += new Date(log.createdAt) - new Date(previousTime);
          }

          // reset timer if hold → restart
          if (log.status === "hold") {
            previousTime = null;
          } else {
            previousTime = log.createdAt;
          }
        });

        // Convert milliseconds to hours, minutes, seconds
        const totalMinutes = Math.floor(totalDuration / 60000);
        const hours = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60;
        const seconds = Math.floor(totalDuration / 1000) % 60;

        console.log({ hours, minutes, seconds });

        // console.log(`Total Duration: ${hours} hours and ${minutes} minutes`);
        //  tester calculation
        let totalDurationTester = 0;
        let previousTimeTester = null;

        testerFlow.forEach((log) => {
          if (previousTimeTester) {
            totalDurationTester +=
              new Date(log.createdAt) - new Date(previousTimeTester);
          }

          // reset timer on hold
          if (log.status === "hold") {
            previousTimeTester = null;
          } else {
            previousTimeTester = log.createdAt;
          }
        });

        // Convert milliseconds to hours, minutes, seconds
        const totalMinutesTester = Math.floor(totalDurationTester / 60000);
        const hoursTester = Math.floor(totalMinutesTester / 60);
        const minutesTester = totalMinutesTester % 60;
        const secondsTester = Math.floor(totalDurationTester / 1000) % 60;

        console.log("🧪 Tester Time:", {
          hours: hoursTester,
          minutes: minutesTester,
          seconds: secondsTester,
        });

        // console.log(
        //   `Total Duration: ${hoursTester} hours and ${minutesTester} minutes`
        // );

        taskWithLogs.push({
          taskAssignedName,
          ...task.toObject(),
          logs: logsWithUpdatedBy,

          totalDuration: {
            hours: hours,
            minutes: minutes,
            seconds: seconds,
          },

          totalDurationTester: {
            hours: hoursTester,
            minutes: minutesTester,
            seconds: secondsTester,
          },
          // dayDifference,
          // time: `${hours}h ${minutes}m ${seconds}s`,
        });
      }
      // const date = new Date(); // or use your own date like: new Date("2025-08-07")

      // Convert to Indian time (IST = UTC+5:30)
      const options = { weekday: "long", timeZone: "Asia/Kolkata" };
      const dayName = dayStart.toLocaleDateString("en-IN", options);
      results.push({
        dayName: dayName,
        date: dayStart.toISOString().split("T")[0],
        tasks: taskWithLogs,
      });
    }

    return res.status(200).json({ success: true, data: results });
  } catch (error) {
    // console.error("Error in particularMonthlyReport:", error);
    // console.error("Error creating task:", error);

    if (error.name === "ValidationError") {
      const errors = {};
      for (let field in error.errors) {
        errors[field] = error.errors[field].message;
      }
      return res.status(400).json({ success: false, errors });
    }

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const deleteTaskFileByIndex = async (req, res) => {
  const { id, index } = req.params;
  // console.log("Deleting file from project:", id, "at index:", index);
  // console.log("employeeId", id, "fileIndex", index);
  try {
    // console.log("Fetching project with ID:", id);
    const task = await Task.findById({ _id: id });

    if (!task) {
      return res.status(404).json({ message: "TaskModel not found" });
    }
    // console.log("employee", task.document);

    // Search all documents to find the index
    if (Array.isArray(task.document) && task.document.length > index) {
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
      task.document.splice(index, 1);

      // Save changes to DB
      await task.save();

      res.status(200).json({
        message: `Document at index ${index} deleted successfully.`,
        updatedDocuments: task.document,
      });
    } else {
      res.status(404).json({
        message: `Document not found at index ${index}.`,
      });
    }

    // return res.status(404).json({ message: "File index not found in any document" });
  } catch (error) {
    // console.error("Delete error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
export {
  createTask,
  getAllTasks,
  getTaskById,
  updateTask,
  deleteTask,
  updateTaskStatus,
  particularTask,
  particularTaskComments,
  getParticularTaskComments,
  taskHold,
  allTaskList,
  tasklogsList,
  testerStatus,
  particularMonthlyReport,
  deleteTaskFileByIndex,
  allTaskCompletedList,
  allTaskListById,
  particularTaskById,
};
