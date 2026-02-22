// just for simplicity, no need of this when the admin user 
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import Organization from "../models/Organization.js";

mongoose.connect("mongodb+srv://MariaAngelina:Ma010890@cluster0.jn1fy.mongodb.net/pawtracker");

const createOrg = async () => {
  const hashedPassword = await bcrypt.hash("Org@123", 10);

  await Organization.create({
    name: "Happy Paws Clinic",
    email: "admin@happypaws.com",
    password: hashedPassword,
    phone: "416-555-1234",
    address: {
      street: "123 Queen St W",
      city: "Toronto",
      province: "ON",
      postalCode: "M5V 2B6"
    }
  });

  console.log("Organization created");
  process.exit();
};

createOrg();