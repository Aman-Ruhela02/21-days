import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["PENDING", "COMPLETED", "MISSED"],
    default: "PENDING",
  },
});

const daySchema = new mongoose.Schema({
  date: {
    type: String,
    required: true
  },
  dayNumber: Number,
  completed: {
    type: Boolean,
    default: false
  },
  tasks: [
    {
      taskId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "UserTask",
        required: true
      },
      status: {
        type: String,
        enum: ["PENDING", "COMPLETED"],
        default: "PENDING"
      }
    }
  ]
});


const challengeSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    startDate: {
      type: String,
      required: true,
    },
    currentDay: {
      type: Number,
      default: 1,
    },
    status: {
      type: String,
      enum: ["ACTIVE", "FAILED", "COMPLETED"],
      default: "ACTIVE",
    },
    archived: {
  type: Boolean,
  default: false,
},
    days: [daySchema],
  },
  { timestamps: true }
);

export default mongoose.model("Challenge", challengeSchema);
