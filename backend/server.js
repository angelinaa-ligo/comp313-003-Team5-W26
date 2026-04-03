import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";

import userRoutes from "./routes/userRoutes.js";
import petRoutes from "./routes/petRoutes.js";
import animalRoutes from "./routes/orgAnimal.js";
import adoptionRoutes from "./routes/adoptionRoutes.js";
import careCampaignRoutes from "./routes/careCampaignRoutes.js";
import adminCampaignRoutes from "./routes/adminCampaignRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import organizationRoutes from "./routes/organizationRoutes.js";
import clinicRoutes from "./routes/clinicRoutes.js";



dotenv.config();
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

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
app.use("/api/organizations", organizationRoutes);
app.use("/api/clinics", clinicRoutes);
app.use("/api", careCampaignRoutes);
app.use("/api", adminCampaignRoutes);

/* ===============================
   SERVER
================================ */

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});