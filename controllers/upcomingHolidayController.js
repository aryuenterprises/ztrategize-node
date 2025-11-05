import UpcomingHoliday from "../models/upcomingHolidayModal.js";
const createUpcomingHoliday = async (req, res) => {
  try {
    const upcomingHoliday = await UpcomingHoliday.create(req.body);
    res.status(200).json({ success: true, data: upcomingHoliday });
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
    console.error("Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const editUpcomingHoliday = async (req, res) => {
  const { id } = req.params;
  console.log(req.body);
  try {
    if(!req.body.reason.length>0)
    {
        return res.status(404).json({success:false,errors:{reason:"Reason is required"}});
    }
     if(!req.body.date)
    {
         return  res.status(404).json({success:false,errors:{date:"Date is required"}});
    }
    const updated = await UpcomingHoliday.findByIdAndUpdate(
      id,
      req.body,
      { new: true },
      {
        runValidators: true,
        context: "query", 
        // Required for `this` in custom validator
        //  overwrite: true,
      }
    );
    if (!updated) {
      return res
        .status(404)
        .json({ success: false, message: "Upcoming Holiday not found" });
    }
    res.status(200).json({ success: true, data: updated });
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
    console.error("Error:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
const getUpcomingHoliday = async (req, res) => {
  try {
    const upcomingHoliday = await UpcomingHoliday.find({})
      .sort({ date: 1 });

    res.status(200).json({ success: true, data: upcomingHoliday });
  } catch (error) {
    if (error.name === "ValidationError") {
      const errors = {};
      for (let field in error.errors) {
        errors[field] = error.errors[field].message;
      }
      return res.status(400).json({ errors });
    } else {
      console.error("Error:", error);
      res.status(500).json({ success: false, message: "Internal Server Error" });
    }
  }
};



const deleteUpcomingHoliday = async (req, res) => {
  const { id } = req.params;

  try {
    const holiday = await UpcomingHoliday.findById(id);

    if (!holiday) {
      return res.status(404).json({
        success: false,
        message: "Holiday not found",
      });
    }

    await UpcomingHoliday.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Holiday deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Something went wrong",
      error: error.message,
    });
  }
};



export {
  createUpcomingHoliday,
  editUpcomingHoliday,
  getUpcomingHoliday,
 deleteUpcomingHoliday
};
