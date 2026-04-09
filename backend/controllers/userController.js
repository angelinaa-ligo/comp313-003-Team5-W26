import User from "../models/User.js";
import Organization from "../models/Organization.js";
import Admin from "../models/Admin.js";
import jwt from "jsonwebtoken";
import nodemailer from 'nodemailer';

const otpStore = {};
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});
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

    if (account.role === 'admin') {
      return res.json({ mfaRequired: true });
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
export const sendMfa = async (req, res) => {
    try {
        const { email, mfaEmail } = req.body;

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        otpStore[email] = { code: otp, expiresAt: Date.now() + 10 * 60 * 1000 };

        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: mfaEmail,
            subject: 'Admin verification code',
            html: `<p>Your access code:</p><h2 style="letter-spacing:8px">${otp}</h2><p>Expires in 10 minutes.</p>`,
        });

        res.json({ message: 'Code sent' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};
export const verifyMfa = async (req, res) => {
  try {
    const { email, code } = req.body;
    const stored = otpStore[email];

    if (!stored)
      return res.status(401).json({ message: 'No pending code for this email' });
    if (Date.now() > stored.expiresAt) {
      delete otpStore[email];
      return res.status(401).json({ message: 'Code expired, please login again' });
    }
    if (stored.code !== code)
      return res.status(401).json({ message: 'Incorrect code' });

    delete otpStore[email];

    const account = await Admin.findOne({ email });
    res.json({
      _id: account._id,
      name: account.name,
      email: account.email,
      role: account.role,
      token: generateToken(account._id, account.role),
    });

  } catch (error) {
    console.error('VERIFY MFA ERROR:', error);
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

/* =========================
   UPDATE PROFILE
========================= */
export const updateProfile = async (req, res) => {
  try {
    const account =
      (await User.findById(req.user._id)) ||
      (await Organization.findById(req.user._id));

    if (!account) {
      return res.status(404).json({ message: "Account not found" });
    }

    // Verify security answer before allowing any changes
    const { securityAnswer, name, email, password } = req.body;

    if (!securityAnswer || securityAnswer.toLowerCase() !== account.securityAnswer) {
      return res.status(401).json({ message: "Your security answer does not match" });
    }

    // Only update fields that were actually sent
    if (name) account.name = name;
    if (email) account.email = email;
    if (password) account.password = password; // the pre-save hook hashes this automatically

    await account.save();

    res.json({
      _id: account._id,
      name: account.name,
      email: account.email,
      role: account.role,
    });

  } catch (error) {
    console.error("UPDATE PROFILE ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};