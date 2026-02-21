import User from "../models/User.js";
import jwt from "jsonwebtoken";
import Organization from "../models/Organization.js";

const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: "30d"
  });
};


export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    
    const user = await User.create({
      name,
      email,
      password,
      role:"user"
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


export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. tenta User
    let account = await User.findOne({ email });
    let role = "user";

    // 2. se não achou, tenta Organization
    if (!account) {
      account = await Organization.findOne({ email });
      role = "organization";
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