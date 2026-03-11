import User from "../models/User.js";
import Organization from "../models/Organization.js";
import Admin from "../models/Admin.js";
import jwt from "jsonwebtoken";

const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

/* =========================
   REGISTER
========================= */
export const registerUser = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      securityQuestion,
      securityAnswer,
      role,
      address,
      phone,
    } = req.body;

    /* ===== ORGANIZATION ===== */
    if (role === "organization") {
      const orgExists = await Organization.findOne({ email });
      if (orgExists) {
        return res.status(400).json({ message: "Organization already exists" });
      }

      const organization = await Organization.create({
        name,
        email,
        password,
        securityQuestion,
        securityAnswer: securityAnswer.toLowerCase(),
        address,
        phone,
        role: "pending",
      });

      return res.status(201).json({
        _id: organization._id,
        name: organization.name,
        email: organization.email,
        role: organization.role,
        token: generateToken(organization._id, organization.role),
      });
    }

    /* ===== USER ===== */
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const user = await User.create({
      name,
      email,
      password,
      securityQuestion,
      securityAnswer: securityAnswer.toLowerCase(),
      role: "user",
    });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id, user.role),
    });

  } catch (error) {
    console.error("REGISTER ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

/* =========================
   LOGIN
========================= */
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    let account =
      (await User.findOne({ email })) ||
      (await Organization.findOne({ email })) ||
      (await Admin.findOne({ email }));

    if (!account) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    if (account.role === "pending") {
      return res.status(403).json({
        message: "Your organization request is waiting for admin approval.",
      });
    }

    if (account.status === "Deactivated") {
      return res.status(403).json({
        message: "Your account has been suspended. Please contact support.",
      });
    }

    const isMatch = await account.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    res.json({
      _id: account._id,
      name: account.name,
      email: account.email,
      role: account.role,
      token: generateToken(account._id, account.role),
    });

  } catch (error) {
    console.error("LOGIN ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

/* =========================
   FORGOT PASSWORD
========================= */
export const forgotPassword = async (req, res) => {
  try {
    const { email, securityAnswer } = req.body;

    const account =
  (await User.findOne({ email })) ||
  (await Organization.findOne({ email })) ||
  (await Admin.findOne({ email }));

    if (!account) {
      return res.status(404).json({ message: "Account not found" });
    }

    if (account.securityAnswer !== securityAnswer.toLowerCase()) {
      return res.status(401).json({ message: "Incorrect security answer" });
    }

    const newPassword = Math.random().toString(36).slice(-8);
    account.password = newPassword;
    await account.save();

    res.json({
      message: "Password reset successfully",
      newPassword,
    });

  } catch (error) {
    console.error("FORGOT PASSWORD ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

/* =========================
   RESET PASSWORD (LOGGED IN)
========================= */
export const resetPassword = async (req, res) => {
  try {
    const account =
      (await User.findById(req.user._id)) ||
      (await Organization.findById(req.user._id));

    if (!account) {
      return res.status(404).json({ message: "Account not found" });
    }

    const newPassword = Math.random().toString(36).slice(-8);
    account.password = newPassword;
    await account.save();

    res.json({
      message: "Password reset successfully",
      newPassword,
    });

  } catch (error) {
    console.error("RESET PASSWORD ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};