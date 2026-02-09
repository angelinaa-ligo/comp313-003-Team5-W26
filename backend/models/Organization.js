import mongoose from "mongoose";

const organizationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true,
      unique: true
    },
    password: {
      type: String,
      required: true
    },

    address: {
      street: {
        type: String
      },
      city: {
        type: String
      },
      province: {
        type: String
      },
      postalCode: {
        type: String
      },
      country: {
        type: String,
        default: "Canada"
      }
    },

    phone: {
      type: String
    },

    role: {
      type: String,
      default: "organization"
    }
  },
  { timestamps: true }
);

export default mongoose.model("Organization", organizationSchema);
