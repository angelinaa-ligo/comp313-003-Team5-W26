import mongoose from "mongoose";

const petSchema = new mongoose.Schema(
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
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    }
  },
  { timestamps: true }
);

export default mongoose.model("Pet", petSchema);
