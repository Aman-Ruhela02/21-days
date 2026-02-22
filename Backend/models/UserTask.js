
import mongoose from "mongoose";

const userTaskSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  name: {
    type: String,
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
}, { timestamps: true });

export default mongoose.model("UserTask", userTaskSchema);
