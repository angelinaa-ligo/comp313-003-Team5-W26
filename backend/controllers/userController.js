import User from "../models/User.js";
import jwt from "jsonwebtoken";
import Admin from "../models/Admin.js";
import Organization from "../models/Organization.js";


const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: "30d"
  });
};


export const registerUser = async (req, res) => {
  try {
    const { name, email, password, securityAnswer } = req.body;
    
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    
    const user = await User.create({
  name,
  email,
  password,
  securityQuestion: "What is the name of your pet?",
  securityAnswer: securityAnswer.toLowerCase(),
  role: "user"
});

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: "user",
        token: generateToken(user._id, "user")
      });
    } else {
      res.status(400).json({ message: "Invalid user data" });
    }

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    
    const newPassword = Math.random().toString(36).slice(-8);

    user.password = newPassword; 
    await user.save();

    res.json({
      message: "Password reset successfully",
      newPassword
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const forgotPassword = async (req, res) => {
  try {

    const { email, securityAnswer } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.securityAnswer !== securityAnswer.toLowerCase()) {
      return res.status(401).json({ message: "Incorrect security answer" });
    }

    const newPassword = Math.random().toString(36).slice(-8);

    user.password = newPassword;
    await user.save();

    res.json({
      message: "Password reset successfully",
      newPassword
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // user
    let account = await User.findOne({ email });
    let role = "user";

    //Organization
    if (!account) {
      account = await Organization.findOne({ email });
      role = "organization";
    }
     //  Admin
    if (!account) {
      account = await Admin.findOne({ email });
      if (account) role = "admin";
    }

    if (!account) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isMatch = await account.matchPassword(password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    res.json({
      _id: account._id,
      name: account.name,
      email: account.email,
      role,
      token: generateToken(account._id, role)
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }


  
};