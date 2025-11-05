// employee Create
// const createEmployee = async (req, res) => {

//   console.log("hello hey",req.body);

//   try {
//     console.log("hello hey 123",req.files);
//     const photo = req.files?.photo?.[0]?.filename || "";
//     const documentFiles = req.files?.document[0][files][0][selectedfile] || [];
//       console.log("documentFiles",documentFiles);

//     const titles = JSON.parse(req.body.document || "[]");
//     console.log("titles",titles);

//     console.log("hello hey 3");
//     const fileMap = {};
//     for (const file of req.files) {
//       if (file.fieldname.startsWith("files")) {
//         const titleKey = file.fieldname.replace("files", "");
//         if (!fileMap[titleKey]) fileMap[titleKey] = [];
//         fileMap[titleKey].push(file.filename);
//       }
//     }
//     console.log("hello hey 3",fileMap);
//     const documentArray = documentFiles.map(doc => ({
//       title: doc.title,
//       files: fileMap[doc.title] || []
//     }));
//     // Create Employee
//     const newEmp = new Employee({
//       ...req.body,
//       photo,
//       document: documentArray
//     });
//     //  const user=await Employee.find({email:req.email})
//     //  if(user)
//     //  {
//     //   res.status(404).json({success:false,message:"Email allready they"});
//     //  }
//     //  const userEmployeeId=await Employee.find({email:req.employeeId})
//     //  if(userEmployeeId)
//     //  {
//     //   res.status(404).json({success:false,message:"employeeId allready they"});
//     //  }
//     // const newEmp = new Employee({
//     //   ...req.body,
//     //   photo,
//     //   document: documentArray,
//     // });
//     // console.log("hello hey 3", newEmp);

//     await newEmp.save();
//     // console.log("hello hey 6", newEmp);

//     res.status(201).json({success:true, message: "Employee created", data: newEmp });
//   } catch (error) {
//     // console.error("Create Employee Error:", error);
//     // res.status(500).json({ error: error.message });
//     // if (error.name === 'ValidationError') {
//     //             const errors = {};
//     //             for (let field in error.errors) {
//     //                 errors[field] = error.errors[field].message;
//     //             }
//     //             return res.status(400).json({errors});
//     //         }
//     //         else{
//     //             res.status(500).json({ error: 'Internal Server Error' });
//     //         }
//       if (error instanceof multer.MulterError) {
//       return res.status(400).json({ success: false, error: error.message });
//     }
//     if (error.name === "ValidationError") {
//       const errors = {};
//       for (let field in error.errors) {
//         errors[field] = error.errors[field].message;
//       }
//       return res.status(400).json({ errors });
//     } else {
//       res.status(500).json({success:false, error: "Internal Server Error" });
//     }
//   }
// };



// const editEmployee = async (req, res) => {
//   try {
//     if (!req.body || Object.keys(req.body).length === 0) {
//       return res
//         .status(400)
//         .json({ error: "Please send all required details" });
//     }

//     // Parse arrays (if sent as JSON strings)
//     req.body.education = req.body.education
//       ? JSON.parse(req.body.education)
//       : [];
//     req.body.skills = req.body.skills ? JSON.parse(req.body.skills) : [];
//     req.body.experience = req.body.experience
//       ? JSON.parse(req.body.experience)
//       : [];
//     const updatedData = { ...req.body };

//     // ✅ Handle new photo upload
//     if (req.files?.photo?.[0]) {
//       updatedData.photo = req.files.photo[0].filename;
//     }

//     // ✅ Handle document uploads (structured like: document[0][files][0][selectedfile])
//   const documentArray = [];
// const titles = Array.isArray(req.body.document)
//   ? req.body.document.map(d => d.title || '')
//   : [];

// // Rebuild documentArray from files
// req.files.forEach(file => {
//   const match = file.fieldname.match(/^document\[(\d+)\]\[files\]\[(\d+)\]\[selectedfile\]$/);

//   if (match) {
//     const docIndex = parseInt(match[1]);
//     const fileIndex = parseInt(match[2]);

//     if (!documentArray[docIndex]) {
//       documentArray[docIndex] = {
//         title: titles[docIndex] || '',
//         files: [],
//         uploadedAt: new Date()
//       };
//     }

//     documentArray[docIndex].files[fileIndex] = file.filename;
//   }
// });
// await Employee.findByIdAndUpdate(
//   req.params.id, // or wherever the ID is coming from
//   {
//     $set: {
//       'document': documentArray
//     }
//   },
//   { new: true }
// );



//     // ✅ Update the employee
//     // const updated = await Employee.findByIdAndUpdate(
//     //   req.params.id,
//     //   updatedData,
//     //   {
//     //     new: true,
//     //   }
//     // );

//     if (!updated) {
//       return res.status(404).json({ message: "Employee not found" });
//     }

//     res
//       .status(200)
//       .json({ message: "Employee updated successfully", data: updated });
//   } catch (err) {
//     console.error("Update Error:", err);
//     res.status(500).json({ message: "Update failed", error: err.message });
//   }
// };


 const calculatePayroll = (payrollPercentValue,ctc, workingDays, totalDays, employeeType) => {
        const taxYearStart = ctc * 12 - 75000; // April 1st
        let dayRatio = workingDays / totalDays;
        let perDaySalary = ctc / totalDays;
        let grossSalary = 0,
          basic = 0,
          hra = 0,
          medicalAllowance = 0,
          conveyanceAllowance = 0,
          employeePF = 0,
          employerPF = 0,
          otherAllowance = 0,
          netSalary = 0,
          professionalTax = 0,
          actualNetSalary = ctc - perDaySalary * (totalDays - workingDays);
        if (employeeType === "Full Time") {
          grossSalary = ctc <= 31800 ? ctc / 1.06 : ctc - 1800;
          basic = grossSalary * 0.5 * dayRatio;
          hra = basic * 0.4;
          medicalAllowance = 1250 * dayRatio;
          conveyanceAllowance = 1600 * dayRatio;
          employeePF = Math.min(basic * 0.12, 1800);
          employerPF = Math.min(basic * 0.12, 1800);
          otherAllowance =
            grossSalary -
            (basic + hra + medicalAllowance + conveyanceAllowance);
          netSalary = grossSalary - employeePF;
          const getPT = (salary6Months) => {
            if (salary6Months <= 21000) return 0;
            if (salary6Months <= 30000) return 180;
            if (salary6Months <= 45000) return 425;
            if (salary6Months <= 60000) return 930;
            if (salary6Months <= 75000) return 1025;
            return 1250;
          };
          professionalTax = getPT(grossSalary * 6) / 6;
          actualNetSalary =
            netSalary -
            professionalTax -
            perDaySalary * (totalDays - workingDays);
        }
        const f = (n) => (isNaN(n) ? 0 : Math.round(Number(n)).toFixed(2));
        function calculateIncomeTax(income) {
          const slabs = [
            { limit: 400000, rate: 0 },
            { limit: 800000, rate: 0.05 },
            { limit: 1200000, rate: 0.1 },
            { limit: 1600000, rate: 0.15 },
            { limit: 2000000, rate: 0.2 },
            { limit: 2400000, rate: 0.25 },
            { limit: Infinity, rate: 0.3 },
          ];

          let tax = 0;
          let previousLimit = 0;

          for (const slab of slabs) {
            if (income > slab.limit) {
              tax += (slab.limit - previousLimit) * slab.rate;
              previousLimit = slab.limit;
            } else {
              tax += (income - previousLimit) * slab.rate;
              break;
            }
            console.log(tax, income);
          }

          return Math.round(tax); // Rounded to nearest rupee
        }
        let annualTax = 0;
        let monthlyTax = 0;
        let healthandEducationCess = 0;
        let monthlyTaxAndHealthTax = 0;
        if (taxYearStart >= 120_0000) {
          annualTax = calculateIncomeTax(taxYearStart);
          monthlyTax = Math.round(annualTax / 12);
          healthandEducationCess = Math.round(monthlyTax * 0.04);
          monthlyTaxAndHealthTax = monthlyTax + healthandEducationCess;
          actualNetSalary = actualNetSalary - monthlyTax;
        }
        return {
          workingDays,
          totalDays,
          basic: f(basic),
          hra: f(hra),
          medicalAllowance: f(medicalAllowance),
          conveyanceAllowance: f(conveyanceAllowance),
          employeePF: f(employeePF),
          employerPF: f(employerPF),
          otherAllowance: f(otherAllowance),
          grossSalary: f(grossSalary),
          professionalTax: f(professionalTax),
          netSalary: f(actualNetSalary),
          totalCTC: f(ctc),
          annualTax: f(annualTax),
          monthlyTax: f(monthlyTax),
          healthandEducationCess: f(healthandEducationCess),
          monthlyTaxAndHealthTax: f(monthlyTaxAndHealthTax),
        };
      };
//       const particularTask = async (req, res) => {
//         try {
//           const { employeeId, projectId, day } = req.query;
//           // console.log("Query:", employeeId, projectId, day);
      
//           const baseFilter = {};
      
//           // Date filter
//           if (day) {
//             const [year, month, date] = day.split("-");
//             const startOfDay = new Date(Date.UTC(year, month - 1, date, 0, 0, 0, 0));
//             const endOfDay = new Date(
//               Date.UTC(year, month - 1, date, 23, 59, 59, 999)
//             );
//             baseFilter.createdAt = { $gte: startOfDay, $lte: endOfDay };
//           }
      
//           // Project filter
//           if (projectId) {
//             baseFilter.projectId = new mongoose.Types.ObjectId(projectId);
//           }
      
//           // Prepare todo filter with new logic
//           const todoFilter = { ...baseFilter, status: "todo" };
      
//           // If employeeId is provided, apply custom visibility logic
//           if (employeeId) {
//             const employeeObjectId = new mongoose.Types.ObjectId(employeeId);
      
//             // Step 1: Get all projects where the employee is team member or manager
//             const employeeProjects = await ProjectModel.find({
//               $or: [
//                 { projectManager: employeeId },
//                 { teamMembers: { $in: [employeeId] } },
//               ],
//             }).select("_id teamMembers");
      
//             const projectIds = employeeProjects.map((p) => p._id);
      
//             // Step 2: Filter tasks that are either:
//             // - Directly assigned to employee
//             // - OR unassigned but belong to a project where employee is a team member
//             todoFilter.$or = [
//               { assignedTo: employeeObjectId },
//               {
//                 assignedTo: { $exists: false }, // unassigned tasks
//                 projectId: { $in: projectIds },
//               },
//               {
//                 assignedTo: null, // also check explicitly null
//                 projectId: { $in: projectIds },
//               },
//             ];
//           }
      
//           // Fetch only "todo" tasks with updated logic
//           // console.log("object", todoFilter);
//           const taskToDo = await Task.find(todoFilter).populate([
//             { path: "assignedTo", select: "employeeName" },
//             { path: "projectId", select: "name" },
//           ]);
//           console.log("todo", taskToDo);
      
//           // ===============================
//           // Other tasks (unchanged logic)
//           // ===============================
      
//           const otherBaseFilter = { ...baseFilter };
      
//           if (employeeId) {
//             otherBaseFilter.$or = [
//               { assignedTo: new mongoose.Types.ObjectId(employeeId) },
//               { projectManagerId: new mongoose.Types.ObjectId(employeeId) },
//             ];
//           }
      
//           const [taskInProcess, taskInReview, taskDone, taskBlock, taskCompleted] =
//             await Promise.all([
//               Task.find({ ...otherBaseFilter, status: "in-progress" }).populate([
//                 { path: "assignedTo", select: "employeeName" },
//                 { path: "projectId", select: "name" },
                
//               ]),
//               Task.find({ ...otherBaseFilter, status: "in-review" }).populate([
//                 { path: "assignedTo", select: "employeeName" },
//                 { path: "projectId", select: "name" },
//               ]),
//               Task.find({ ...otherBaseFilter, status: "done" }).populate([
//                 { path: "assignedTo", select: "employeeName" },
//                 { path: "projectId", select: "name" },
//               ]),
//               Task.find({ ...otherBaseFilter, status: "block" }).populate([
//                 { path: "assignedTo", select: "employeeName" },
//                 { path: "projectId", select: "name" },
//               ]),
//               Task.find({ ...otherBaseFilter, status: "completed" }).populate([
//                 { path: "assignedTo", select: "employeeName" },
//                 { path: "projectId", select: "name" },
//               ]),
//             ]);
      
//           // Count total projects where user is involved
//           const totalProjectCount = employeeId
//             ? await ProjectModel.countDocuments({
//                 $or: [
//                   { projectManager: employeeId },
//                   { teamMembers: { $in: [employeeId] } },
//                 ],
//               })
//             : await ProjectModel.countDocuments();
      
//           // Count total tasks for employee
//           const totalUserTasks = await Task.countDocuments(otherBaseFilter);
      
//           // Today's tasks
//           const startOfToday = new Date();
//           startOfToday.setHours(0, 0, 0, 0);
//           const endOfToday = new Date();
//           endOfToday.setHours(23, 59, 59, 999);
      
//           const todayTasks = await Task.find({
//             ...otherBaseFilter,
//             createdAt: { $gte: startOfToday, $lte: endOfToday },
//           });
      
//           // Response
//           res.status(200).json({
//             success: true,
//             message: "Tasks fetched successfully",
//             counts: {
//               totalProjectCount,
//               totalUserTasks,
//               todayTasks: todayTasks.length,
//             },
//             data: {
//               taskToDo,
//               taskInProcess,
//               taskInReview,
//               taskDone,
//               taskBlock,
//               taskCompleted,
//               todayTasks,
//             },
//           });
//         } catch (error) {
//           console.error("Fetch error:", error);
//           res.status(500).json({
//             success: false,
//             message: "Error fetching tasks",
//             error: error.message,
//           });
//         }
//       };
//       //new task
//       let totalDuration = 0;
// let previousTime = null;

// // Optional: Sort logs to ensure chronological order
// developerFlow.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

// developerFlow.forEach((log) => {
//   const { status, createdAt } = log;

//   if (status === "hold") {
//     previousTime = null; // Reset timer during hold
//     return;
//   }

//   if (previousTime) {
//     totalDuration += new Date(createdAt) - new Date(previousTime);
//   }

//   previousTime = createdAt;
// });

// // Convert milliseconds to readable time
// const totalSeconds = Math.floor(totalDuration / 1000);
// const minutes = Math.floor(totalSeconds / 60);
// const seconds = totalSeconds % 60;

// console.log(`⏱️ Total active time (excluding hold): ${minutes} minutes, ${seconds} seconds`);
// 🧠 Example Scenario:
// For this developerFlow:

// js
// Copy code
// [
//   { status: "in-progress", createdAt: "2025-10-03T12:00:00Z" },
//   { status: "hold", createdAt: "2025-10-03T12:02:00Z" },
//   { status: "restart", createdAt: "2025-10-03T12:05:00Z" },
//   { status: "in-review", createdAt: "2025-10-03T12:10:00Z" }
// ]
// You’ll get:

// in-progress → hold: 2 minutes

// restart → in-review: 5 minutes

// ✅ Total = 7 minutes

// 🔁 Optional: Convert to a function
// Let me know if you want this turned into a reusable function or enhanced to:

// Exclude any status

// Track per status duration

// Work inside MongoDB pipeline

// Let me know how you'd like to evolve it!



// You said:
// if hold is come then when will start restate in betwwen time not calculate

// ChatGPT said:
// Ah, got it! You want to exclude any duration between:

// a hold status

// and the next non-hold status (like restart, in-progress, or in-review)

// In other words:

// Pause time tracking when status === "hold"

// Resume time tracking only from the next log after the hold

// So: time from hold → restart (or next state) is not counted

// ✅ Improved Code (with comments):
// javascript
// Copy code
// let totalDuration = 0;
// let previousTime = null;
// let isOnHold = false;

// // Optional: sort by createdAt to ensure order
// developerFlow.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

// developerFlow.forEach((log) => {
//   const { status, createdAt } = log;
//   const currentTime = new Date(createdAt);

//   if (status === "hold") {
//     // Pause tracking on hold
//     previousTime = null;
//     isOnHold = true;
//     return;
//   }

//   if (isOnHold) {
//     // Coming out of hold — don't track time until this point
//     previousTime = currentTime;
//     isOnHold = false;
//     return;
//   }

//   if (previousTime) {
//     totalDuration += currentTime - new Date(previousTime);
//   }

//   previousTime = currentTime;
// });

// // Convert ms → readable
// const totalSeconds = Math.floor(totalDuration / 1000);
// const minutes = Math.floor(totalSeconds / 60);
// const seconds = totalSeconds % 60;

// console.log(`⏱️ Total active time (excluding hold duration): ${minutes} minutes, ${seconds} seconds`);
// ✅ Example Flow:
// js
// Copy code
// const developerFlow = [
//   { status: "in-progress", createdAt: "2025-10-03T12:00:00Z" },
//   { status: "hold", createdAt: "2025-10-03T12:02:00Z" },
//   { status: "restart", createdAt: "2025-10-03T12:05:00Z" },
//   { status: "in-review", createdAt: "2025-10-03T12:10:00Z" }
// ];
// Result:

// in-progress → hold: 2 min ✅

// hold → restart: ❌ skipped

// restart → in-review: 5 min ✅
// ➡️ Total: 7 minutes (correct)

// Let me know if you want:

// To track multiple hold intervals

// Count per status

// Or handle nested holds or invalid data

// Happy to extend it!



// You said:
//    testerFlow.forEach((log) => {
//           if (log.status === "hold") {
//             previousTimeTester = null; // reset timer on hold
//             return;
//           }
//           if (previousTimeTester) {
//             totalDurationTester +=
//               new Date(log.createdAt) - new Date(previousTimeTester);
//           }
//           previousTimeTester = log.createdAt;
//         }); testerFlow [
//   {
//     _id: new ObjectId('68dfbcba010c50ae8aeab262'),
//     taskId: 'AY3531',
//     startTime: 2025-10-03T12:08:26.618Z,
//     note: '',
//     status: 'start',
//     updatedBy: new ObjectId('6879d92b1bfdcca09d698ac9'),
//     createdAt: 2025-10-03T12:08:26.618Z,
//     updatedAt: 2025-10-03T12:08:26.618Z,
//     __v: 0
//   },
//   {
//     _id: new ObjectId('68dfbd1a010c50ae8aeab542'),
//     taskId: 'AY3531',
//     startTime: 2025-10-03T12:10:02.294Z,
//     note: 'in',
//     status: 'hold',
//     updatedBy: new ObjectId('6879d92b1bfdcca09d698ac9'),
//     createdAt: 2025-10-03T12:10:02.294Z,
//     updatedAt: 2025-10-03T12:10:02.294Z,
//     __v: 0
//   },
//   {
//     _id: new ObjectId('68dfbd7e010c50ae8aeab99e'),
//     taskId: 'AY3531',
//     startTime: 2025-10-03T12:11:42.135Z,
//     note: 'in',
//     status: 'restart',
//     updatedBy: new ObjectId('6879d92b1bfdcca09d698ac9'),
//     createdAt: 2025-10-03T12:11:42.135Z,
//     updatedAt: 2025-10-03T12:11:42.135Z,
//     __v: 0
//   },
//   {
//     _id: new ObjectId('68dfbdb8010c50ae8aeab9b7'),
//     taskId: 'AY3531',
//     startTime: 2025-10-03T12:12:40.797Z,
//     note: '',
//     status: 'done',
//     updatedBy: new ObjectId('6879d92b1bfdcca09d698ac9'),
//     createdAt: 2025-10-03T12:12:40.797Z,
//     updatedAt: 2025-10-03T12:12:40.797Z,
//     __v: 0
//   }
// ]

// ChatGPT said:
// Thanks for sharing the full testerFlow data and your loop logic. You're very close — your goal is to calculate the total time spent on the task, excluding the time spent while on "hold" — from hold to the next action like restart, done, etc.

// 🔧 Problem in Your Current Code:
// In your forEach():

// js
// Copy code
// if (log.status === "hold") {
//   previousTimeTester = null; // reset timer on hold
//   return;
// }
// This resets the timer, which is good — but then on the next log (restart), the time difference from the previous state before hold is not calculated, which is correct. However, you need to make sure:

// You skip time between "hold" and next status.

// You don't accidentally add "restart" - "hold" time.

// ✅ Corrected Version of the Code:
// javascript
// Copy code
// let totalDurationTester = 0;
// let previousTimeTester = null;
// let isOnHold = false;

// // Ensure the flow is sorted by time
// testerFlow.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

// testerFlow.forEach((log) => {
//   const { status, createdAt } = log;
//   const currentTime = new Date(createdAt);

//   if (status === "hold") {
//     // Entering hold, stop time tracking
//     previousTimeTester = null;
//     isOnHold = true;
//     return;
//   }

//   if (isOnHold) {
//     // Coming out of hold — don't count hold-to-restart time
//     previousTimeTester = currentTime;
//     isOnHold = false;
//     return;
//   }

//   if (previousTimeTester) {
//     totalDurationTester += currentTime - new Date(previousTimeTester);
//   }

//   previousTimeTester = currentTime;
// });

// // Convert ms → readable
// const totalSeconds = Math.floor(totalDurationTester / 1000);
// const minutes = Math.floor(totalSeconds / 60);
// const seconds = totalSeconds % 60;

// console.log(`⏱️ Tester Active Time (excluding hold): ${minutes} minutes, ${seconds} seconds`);
// 🧪 Applied to Your Data:
// Your log flow:

// Status	Time
// start	12:08:26.618
// hold	12:10:02.294 ❌
// restart	12:11:42.135 ✅
// done	12:12:40.797 ✅

// start → hold = 1 min 35 sec ✅

// hold → restart = skipped ❌

// restart → done = 58.662 sec ✅
// → Total: ~2 minutes 33 seconds

// ✅ Console Output:
// sql
// Copy code
// ⏱️ Tester Active Time (excluding hold): 2 minutes, 33 seconds
// Let me know if you’d like to:

// Track time per status

// Handle multiple hold–restart cycles

// Convert this into a function or use it in an API

// I'm here to help!



// You said:
//  //new code 
//         let totalDuration = 0;
// let previousTime = null;
// let isOnHold = false;

// // Optional: sort by createdAt to ensure order
// developerFlow.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

// developerFlow.forEach((log) => {
//   const { status, createdAt } = log;
//   const currentTime = new Date(createdAt);

//   if (status === "hold") {
//     // Pause tracking on hold
//     previousTime = null;
//     isOnHold = true;
//     return;
//   }

//   if (isOnHold) {
//     // Coming out of hold — don't track time until this point
//     previousTime = currentTime;
//     isOnHold = false;
//     return;
//   }

//   if (previousTime) {
//     totalDuration += currentTime - new Date(previousTime);
//   }

//   previousTime = currentTime;
// });

// // Convert ms → readable
// const totalSeconds = Math.floor(totalDuration / 1000);
// const minutes = Math.floor(totalSeconds / 60);
// const seconds = totalSeconds % 60;

// console.log(⏱️ Total active time (excluding hold duration): ${minutes} minutes, ${seconds} seconds);
// let totalDurationTester = 0;
// let previousTimeTester = null;
// let isOnHold = false;

// // Ensure the flow is sorted by time
// testerFlow.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

// testerFlow.forEach((log) => {
//   const { status, createdAt } = log;
//   const currentTime = new Date(createdAt);

//   if (status === "hold") {
//     // Entering hold, stop time tracking
//     previousTimeTester = null;
//     isOnHold = true;
//     return;
//   }

//   if (isOnHold) {
//     // Coming out of hold — don't count hold-to-restart time
//     previousTimeTester = currentTime;
//     isOnHold = false;
//     return;
//   }

//   if (previousTimeTester) {
//     totalDurationTester += currentTime - new Date(previousTimeTester);
//   }

//   previousTimeTester = currentTime;
// });

// // Convert ms → readable
// const totalSeconds = Math.floor(totalDurationTester / 1000);
// const minutes = Math.floor(totalSeconds / 60);
// const seconds = totalSeconds % 60;

// console.log(⏱️ Tester Active Time (excluding hold): ${minutes} minutes, ${seconds} seconds);


//         taskWithLogs.push({
//           taskAssignedName,
//           ...task.toObject(),
//           logs: Alllogs,

//           totalDuration: {
//             hours: hours,
//             minutes: minutes,
//             seconds: seconds,
//           },

//           totalDurationTester: {
//             hours: hoursTester,
//             minutes: minutesTester,
//             seconds: secondsTester,
//           },
//           // dayDifference,
//           // time: ${hours}h ${minutes}m ${seconds}s,
//         });
//       }

// ChatGPT said:
// Your updated code is mostly well-structured and clean, but there are a few critical issues and suggestions to fix and improve your logic:

// 🧨 Issues in Your Code:
// 1. Variable Clashing / Overwriting
// You're reusing the same minutes, seconds, etc., for both developer and tester, like:

// js
// Copy code
// const totalSeconds = Math.floor(totalDuration / 1000);
// const minutes = Math.floor(totalSeconds / 60);
// const seconds = totalSeconds % 60;

// ...

// const totalSeconds = Math.floor(totalDurationTester / 1000);
// const minutes = Math.floor(totalSeconds / 60); // ⚠️ This overwrites previous minutes
// const seconds = totalSeconds % 60;
// ✅ Fix: Use distinct variables for developer and tester sections like this:

// js
// Copy code
// const totalSecondsDev = Math.floor(totalDuration / 1000);
// const minutesDev = Math.floor(totalSecondsDev / 60);
// const secondsDev = totalSecondsDev % 60;

// const totalSecondsTester = Math.floor(totalDurationTester / 1000);
// const minutesTester = Math.floor(totalSecondsTester / 60);
// const secondsTester = totalSecondsTester % 60;
// 2. Missing hours and hoursTester
// You reference hours and hoursTester in:

// js
// Copy code
// totalDuration: {
//   hours: hours,
//   minutes: minutes,
//   seconds: seconds,
// }
// But you never define them, so it will crash or return undefined.

//  Fix: Add this in both sections:

// js
// Copy code
// const hoursDev = Math.floor(totalSecondsDev / 3600);
// const hoursTester = Math.floor(totalSecondsTester / 3600);
// 3. Minor Optimization: Remove unnecessary new Date()
// You’re doing this repeatedly:

// js
// Copy code
// currentTime - new Date(previousTime);
// But both are already Date objects, so currentTime - previousTime is enough.

// Final Refactored Version
// js
// Copy code
// // Developer Time Tracking
// let totalDuration = 0;
// let previousTime = null;
// let isOnHold = false;

// developerFlow.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

// developerFlow.forEach((log) => {
//   const { status, createdAt } = log;
//   const currentTime = new Date(createdAt);

//   if (status === "hold") {
//     previousTime = null;
//     isOnHold = true;
//     return;
//   }

//   if (isOnHold) {
//     previousTime = currentTime;
//     isOnHold = false;
//     return;
//   }

//   if (previousTime) {
//     totalDuration += currentTime - previousTime;
//   }

//   previousTime = currentTime;
// });

// // Developer time breakdown
// const totalSecondsDev = Math.floor(totalDuration / 1000);
// const hoursDev = Math.floor(totalSecondsDev / 3600);
// const minutesDev = Math.floor((totalSecondsDev % 3600) / 60);
// const secondsDev = totalSecondsDev % 60;

// console.log(`⏱️ Developer Active Time: ${hoursDev}h ${minutesDev}m ${secondsDev}s`);


// // Tester Time Tracking
// let totalDurationTester = 0;
// let previousTimeTester = null;
// let isOnHoldTester = false;

// testerFlow.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

// testerFlow.forEach((log) => {
//   const { status, createdAt } = log;
//   const currentTime = new Date(createdAt);

//   if (status === "hold") {
//     previousTimeTester = null;
//     isOnHoldTester = true;
//     return;
//   }

//   if (isOnHoldTester) {
//     previousTimeTester = currentTime;
//     isOnHoldTester = false;
//     return;
//   }

//   if (previousTimeTester) {
//     totalDurationTester += currentTime - previousTimeTester;
//   }

//   previousTimeTester = currentTime;
// });

// // Tester time breakdown
// const totalSecondsTester = Math.floor(totalDurationTester / 1000);
// const hoursTester = Math.floor(totalSecondsTester / 3600);
// const minutesTester = Math.floor((totalSecondsTester % 3600) / 60);
// const secondsTester = totalSecondsTester % 60;

// console.log(`⏱️ Tester Active Time: ${hoursTester}h ${minutesTester}m ${secondsTester}s`);


// // Final result packaging
// taskWithLogs.push({
//   taskAssignedName,
//   ...task.toObject(),
//   logs: Alllogs,

//   totalDuration: {
//     hours: hoursDev,
//     minutes: minutesDev,
//     seconds: secondsDev,
//   },

//   totalDurationTester: {
//     hours: hoursTester,
//     minutes: minutesTester,
//     seconds: secondsTester,
//   },

//   // Optional
//   // time: `${hoursDev}h ${minutesDev}m ${secondsDev}s`,
// });
// // 🧪 Output Example