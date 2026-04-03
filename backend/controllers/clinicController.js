import Clinic from "../models/Clinic.js";

// GET clinics with optional search
export const getClinics = async (req, res) => {
  try {
    const search = req.query.search ? req.query.search.trim() : "";

    let query = { isActive: true };

    if (search) {
      query = {
        isActive: true,
        $or: [
          { city: { $regex: search, $options: "i" } },
          { postalCode: { $regex: search, $options: "i" } },
          { address: { $regex: search, $options: "i" } },
          { name: { $regex: search, $options: "i" } },
        ],
      };
    }

    const clinics = await Clinic.find(query).sort({ name: 1 });
    res.status(200).json(clinics);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ADD clinic
export const createClinic = async (req, res) => {
  try {
    const { name, address, city, postalCode, phone, isActive } = req.body;

    const clinic = new Clinic({
      name,
      address,
      city,
      postalCode,
      phone,
      isActive,
    });

    const savedClinic = await clinic.save();
    res.status(201).json(savedClinic);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE clinic
export const updateClinic = async (req, res) => {
  try {
    const { id } = req.params;

    const updatedClinic = await Clinic.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updatedClinic) {
      return res.status(404).json({ message: "Clinic not found" });
    }

    res.status(200).json(updatedClinic);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};