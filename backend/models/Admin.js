import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const adminSchema = new mongoose.Schema(
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

  mfaSecret: {
    type: String
  },

  role: {
    type: String,
    default: "admin"
  }

},
{ timestamps: true }
);

// Hash password safely
adminSchema.pre("save", async function () {

  if (!this.isModified("password")) {
    return;
  }

  if (
    this.password.startsWith("$2a$") ||
    this.password.startsWith("$2b$") ||
    this.password.startsWith("$2y$")
  ) {
    return;
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);

});

// Compare password
adminSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.model("Admin", adminSchema);