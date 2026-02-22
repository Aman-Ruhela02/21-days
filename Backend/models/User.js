import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
     username:{
      type:String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,

     },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    passwordHash: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      enum: ["FREE", "PRO"],
      default: "FREE",
    },

    hasActiveChallenge: {
      type: Boolean,
      default: false,
    },

    reminderEnabled: {
  type: Boolean,
  default: true,
},

reminderTime: {
  type: String, // "08:00"
  default: "08:00",
},
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
