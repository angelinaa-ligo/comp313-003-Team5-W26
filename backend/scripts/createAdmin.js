import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import Admin from "../models/Admin.js";

mongoose.connect("mongodb+srv://MariaAngelina:Ma010890@cluster0.jn1fy.mongodb.net/pawtracker");

const createAdmin = async () => {
  const hashedPassword = await bcrypt.hash("Admin@123", 10);

  await Admin.create({
    name: "Admin", 
    email: "adminpawtracker@gmail.com",
    password: hashedPassword,
    securityAnswer: "blue",
    securityQuestion: "What is your favorite color?"
  });

  console.log("Admin created");
  process.exit();
};

createAdmin();