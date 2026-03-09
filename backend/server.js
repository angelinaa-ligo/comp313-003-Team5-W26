import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import bcrypt from "bcryptjs";
import userRoutes from "./routes/userRoutes.js";
import petRoutes from "./routes/petRoutes.js";
import animalRoutes from "./routes/orgAnimal.js";
import adoptionRoutes from "./routes/adoptionRoutes.js";
import careCampaignRoutes from "./routes/careCampaignRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";

import User from "./models/User.js"; 

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

/* ===============================
   CREATE ADMIN IF NOT EXISTS
================================ */
const createAdmin = async () => {
  try {

    const adminExists = await User.findOne({ email: "aadmin@admin.com" });

    if (!adminExists) {

      await User.create({
        name: "Admin",
        email: "aadmin@admin.com",
        password:"123456",
        securityQuestion: "admin",
        securityAnswer: "admin",
        role: "admin"
      });

      console.log("Default admin created");

    } else {
      console.log("Admin already exists");
    }

  } catch (error) {
    console.log("Admin creation error:", error);
  }
};

createAdmin();

/* ===============================
   ROUTES
================================ */

app.get("/", (req, res) => {
  res.send("API running");
});

app.use("/api/admin", adminRoutes);
app.use("/api/users", userRoutes);
app.use("/api/pets", petRoutes);
app.use("/api/animals", animalRoutes);
app.use("/api/adoptions", adoptionRoutes);
app.use("/api", careCampaignRoutes);

/* ===============================
   SERVER
================================ */

const PORT = process.env.PORT || 5000;

app.listen(PORT, () =>
  console.log(`Server running on port ${PORT}`)
);

