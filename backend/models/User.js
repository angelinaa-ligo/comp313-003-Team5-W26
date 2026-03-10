import mongoose from "mongoose";
import bcrypt from "bcryptjs";

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
    enum: ["user", "admin"],
    default: "user"
  }

},
{ timestamps: true }
);

// Hash password before saving
userSchema.pre("save", async function () {

  if (!this.isModified("password")) {
    return;
  }

  // evita hash duplo
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
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.model("User", userSchema);