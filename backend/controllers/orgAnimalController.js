import Animal from "../models/Animal.js";

/**
 * GET all animals for logged organization
 */
export const getOrganizationAnimals = async (req, res) => {
  try {
    const orgId = req.organization._id;

    const animals = await Animal.find({
      organization: orgId,
    });

    return res.status(200).json(animals);
  } catch (error) {
    return res.status(500).json({
      message: "Error fetching animals",
      error: error.message,
    });
  }
};
export const getAnimalById = async (req, res) => {
  try {
    const orgId = req.organization._id;
    const animalId = req.params.id;

    const animal = await Animal.findById(animalId);

    if (!animal) {
      return res.status(404).json({
        message: "Animal not found",
      });
    }

    // Ownership check
    if (animal.organization.toString() !== orgId.toString()) {
      return res.status(403).json({
        message: "You do not own this animal",
      });
    }

    return res.status(200).json(animal);

  } catch (error) {
    return res.status(500).json({
      message: "Error fetching animal",
      error: error.message,
    });
  }
};
/**
 * CREATE animal (Organization only)
 */
export const createAnimal = async (req, res) => {
  try {
    const orgId = req.organization._id;

    const { name, species, breed, sex, age, adoptionStatus } = req.body;

    if (!name || !species || !sex) {
      return res.status(400).json({
        message: "Name, species and sex are required",
      });
    }

    const animal = await Animal.create({
      name,
      species,
      breed,
      sex,
      age,
      adoptionStatus,
      organization: orgId,
    });

    return res.status(201).json(animal);
  } catch (error) {
    return res.status(500).json({
      message: "Error creating animal",
      error: error.message,
    });
  }
};
/**
 * DELETE animal (Organization only)
 */
export const deleteAnimal = async (req, res) => {
  try {
    const orgId = req.organization._id;
    const animalId = req.params.id;

    const animal = await Animal.findById(animalId);

    if (!animal) {
      return res.status(404).json({ message: "Animal not found" });
    }

    if (animal.organization.toString() !== orgId.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await animal.deleteOne();

    res.json({ message: "Animal deleted successfully" });

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * UPDATE animal (Organization only)
 */
export const updateAnimal = async (req, res) => {
  try {
    const orgId = req.organization._id;
    const animalId = req.params.id;

    const animal = await Animal.findById(animalId);

    if (!animal) {
      return res.status(404).json({
        message: "Animal not found",
      });
    }

    // Ownership check
    if (animal.organization.toString() !== orgId.toString()) {
      return res.status(403).json({
        message: "You do not own this animal",
      });
    }

    const allowedFields = [
      "name",
      "species",
      "breed",
      "sex",
      "age",
      "adoptionStatus",
    ];

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        animal[field] = req.body[field];
      }
    });

    const updatedAnimal = await animal.save();

    return res.status(200).json(updatedAnimal);
  } catch (error) {
    return res.status(500).json({
      message: "Error updating animal",
      error: error.message,
    });
  }
};