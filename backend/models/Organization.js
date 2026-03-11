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
    street: String,
    city: String,
    province: String,
    postalCode: String,
    country: {
      type: String,
      default: "Canada"
    }
  },

  phone: {
    type: String
  },
   securityQuestion: {
    type: String,
    required: true
  },

  securityAnswer: {
    type: String,
    required: true
  },

  status: {
    type: String,
    enum: ["Active", "Deactivated"],
    default: "Active"
  },

  role: {
    type: String,
    enum: ["organization", "pending"],
    default: "pending"
  }

},
{ timestamps: true }
);

// Hash password
organizationSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 10);
});

// Compare password
organizationSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.model("Organization", organizationSchema);