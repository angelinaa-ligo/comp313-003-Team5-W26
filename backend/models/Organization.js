import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const organizationSchema = new mongoose.Schema(
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

    phone: {
      type: String
    },

    role: {
      type: String,
      default: "organization"
    }
  },
  { timestamps: true }
);
organizationSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

organizationSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.model("Organization", organizationSchema);
