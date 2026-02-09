import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true,
      unique: true
    },
    password: {
      type: String,
      required: true
    },

    address: {
      street: {
        type: String
      },
      city: {
        type: String
      },
      province: {
        type: String
      },
      postalCode: {
        type: String
      },
      country: {
        type: String,
        default: "Canada"
      }
    },

    role: {
      type: String,
      enum: ["user", "organization", "admin"],
      default: "user"
    }
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
