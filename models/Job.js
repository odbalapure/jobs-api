const mongoose = require("mongoose");

const JobSchema = new mongoose.Schema(
  {
    company: {
      type: String,
      required: [true, "Please provide a company name"],
      maxLength: 50,
    },
    position: {
      type: String,
      required: [true, "Please provide a designation"],
      maxLength: 100,
    },
    status: {
      type: String,
      enum: ["interview", "declined", "pending"],
      default: "pending",
    },
    createdBy: {
      // Tie a job to the user who created it
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: [true, "Please provide a user"],
    },
  },
  // Will add createdAt and updatedAt fields
  { timestamps: true }
);

module.exports = mongoose.model("Job", JobSchema);
