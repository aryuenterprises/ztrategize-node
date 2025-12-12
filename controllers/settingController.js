import Settings from "../models/settings.js";

const createSetting = async (req, res) => {
  try {
    const {
      gst_percent,
      payroll_basic_percent,
      payroll_hra_percent,
      payroll_conveyanceAllowance,
      payroll_medicalAllowance,
      payroll_eepf_percent,
      payroll_erpf_percent,
      password,
      unhappy_leave,
      casual_leave,
      complementary_leave,
      wfh_leave,
      permission,
      payroll_eeesi_percent,
      payroll_eresi_percent,
      date_format,
      unhappy_leave_option
    } = req.body;

    console.log("Incoming data:", req.body);

    // Check if settings already exist
    let settings = await Settings.findOne();

    if (settings) {
      // Update existing settings
      settings.gst_percent = gst_percent;
      settings.payroll_basic_percent = payroll_basic_percent;
      settings.payroll_hra_percent = payroll_hra_percent;
      settings.payroll_medicalAllowance = payroll_medicalAllowance;
      settings.payroll_conveyanceAllowance = payroll_conveyanceAllowance;
      settings.payroll_eepf_percent = payroll_eepf_percent;
      settings.payroll_erpf_percent = payroll_erpf_percent;
      settings.unhappy_leave = unhappy_leave;
      settings.casual_leave = casual_leave;
      settings.complementary_leave = complementary_leave;
      settings.wfh_leave = wfh_leave;
      settings.permission = permission;
      settings.payroll_eeesi_percent = payroll_eeesi_percent;
      settings.payroll_eresi_percent = payroll_eresi_percent;
      settings.date_format = date_format;
      settings.unhappy_leave_option = unhappy_leave_option;
      // only update password if provided
      if (password) {
        settings.password = password;
      }

      await settings.save();

      return res.status(200).json({
        message: "Settings updated successfully",
        settings,
      });
    } else {
      // Create new settings
      
      settings = new Settings({
        gst_percent,
        payroll_basic_percent,
        payroll_hra_percent,
        payroll_conveyanceAllowance,
        payroll_medicalAllowance,
        payroll_eepf_percent,
        payroll_erpf_percent,
        // password,
        unhappy_leave,
        // sick_leave,
        casual_leave,
        complementary_leave,
        wfh_leave,
        permission,
        payroll_eeesi_percent,
        payroll_eresi_percent,
        date_format,
        unhappy_leave_option
      });
       if (password) {
        settings.password = password;
      }

      await settings.save();

      return res.status(201).json({
        message: "Settings created successfully",
        settings,
      });
    }
  } catch (error) {
    console.error(error);
    if (error.name === "ValidationError") {
      const errors = {};
      for (let field in error.errors) {
        errors[field] = error.errors[field].message;
      }
      return res.status(400).json({ errors });
    } else {
      return res
        .status(500)
        .json({ success: false, error: "Internal Server Error" });
    }
  }
};

// const editSettingsDetails = async (req, res) => {
//   // const { id } = req.params;
//   try {
//     const { id } = req.params;
//     const updated = await Settings.findByIdAndUpdate(id, req.body, {
//       new: true,
//       runValidators: true,
//     });
//     if (!updated) {
//       return res
//         .status(404)
//         .json({ success: false, message: "Settings not found" });
//     }
//     res
//       .status(200)
//       .json({ success: true, message: "uploaded successfully  details" });
//   } catch (error) {
//     if (error.name === "ValidationError") {
//       const errors = {};
//       for (let field in error.errors) {
//         errors[field] = error.errors[field].message;
//       }
//       return res.status(400).json({ success: false, errors });
//     }
//     console.error("Error:", error);
//     res.status(500).json({ success: false, message: "Internal Server Error" });
//   }
// };

const getSettingDetails = async (req, res) => {
  try {
    const settingDetails = await Settings.find();
    res.status(200).json({ success: true, data: settingDetails });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export { createSetting, getSettingDetails };
