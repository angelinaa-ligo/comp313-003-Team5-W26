import mongoose from "mongoose";

const animalSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    species: {
      type: String,
      required: true
    },
    breed: {
      type: String,
      required: false
    },
    sex: {
      type: String,
      enum: ["male", "female", "unknown"],
      required: true
    },
    age: {
      type: Number
    },

    // Adoption fields
    adoptionStatus: {
      type: String,
      enum: ["available", "pending", "adopted"],
      default: "available"
    },
    adoptedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null
    },
    adoptionDate: {
      type: Date,
      default: null
    },

    organization: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
      required: true
    }
  },
  { timestamps: true }
);

export default mongoose.model("Animal", animalSchema);
