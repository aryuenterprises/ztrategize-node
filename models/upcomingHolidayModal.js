import mongoose from "mongoose";

const upcomingHolidaySchema = new mongoose.Schema(
  {
    reason: {
      type: String,
      required: [true, "Please provide a holiday name"],
      trim: true, // Trim whitespace from string input
      validate: {
        validator: function (value) {
          return value && value.trim().length > 0;
        },
        message: "Holiday reason cannot be empty",
      },
    },

    date: {
      type: Date,
      required: [true, "Please provide a holiday date"],
      unique: true, // Creates a unique index (note: not a validator)
      validate: [
        {
          validator: async function (value) {
            const id = this.getQuery?._id;

            const existing = await mongoose.models.UpcomingHoliday.findOne({
              date: value,
              _id: { $ne: id },
            });

            return !existing;
          },
          message: "Holiday date already exists",
        },
        // {
        //   validator: function (value) {
        //     return value instanceof Date && !isNaN(value);
        //   },
        //   message: "Invalid date format",
        // },
      ],
    },
  },
  { timestamps: true }
);

const UpcomingHoliday = mongoose.model(
  "UpcomingHoliday",
  upcomingHolidaySchema
);

export default UpcomingHoliday;
