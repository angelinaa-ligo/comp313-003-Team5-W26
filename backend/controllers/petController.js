import Pet from '../models/Pet.js';

// creating a pet
export const createPet = async (req, res) => {
    try {
        const userId = req.user._id;
        const { name, species, breed, sex, age } = req.body;

        if (!name || !species || !sex) {
            return res.status(400).json({
                message: "Name, species, and sex are required",
            })
        }

        const pet = await Pet.create({
            name,
            species,
            breed,
            sex,
            age,
            owner: userId
        });

        return res.status(201).json(pet);
    } catch (error) {
        return res.status(500).json({
            message: "Error creating pet",
            error: error.message
        });
    }
};

// get all pets for user
export const getPets = async (req, res) => {
    try {
        const userId = req.user._id;
        const pets = await Pet.find({ owner: userId }).sort({
            createdAt: -1
        });

        return res.status(200).json(pets);
    } catch (error) {
        return res.status(500).json({
            message: "Error fetching pets",
            error: error.message,
        });
    }
};

// get pet by id
export const getPetById = async (req, res) => {
    try {
        const userId = req.user._id;
        const petId = req.params.id;

        const pet = await Pet.findById(petId);

        if (!pet) {
            return res.status(404).json({
                message: "Pet not found",
            });
        }

        if (pet.owner.toString() !== userId.toString()) {
            return res.status(403).json({
                message: "You do not own this pet",
            });
        }
        return res.status(200).json(pet);
    } catch (error) {
        return res.status(500).json({
            message: "Error fetching pet",
            error: error.message,
        });
    }
}

// update pet
export const updatePet = async (req, res) => {
    try {
        const userId = req.user._id;
        const petId = req.params.id;

        const pet = await Pet.findById(petId);

        if (!pet) {
            return res.status(404).json({
                message: "Pet not found",
            });
        }

        if (pet.owner.toString() !== userId.toString()) {
            return res.status(403).json({
                message: "You do not own this pet",
            });
        }

        const allowedFields = ["name", "species", "breed", "sex", "age"];

        allowedFields.forEach((field) => {
            if (req.body[field] !== undefined) {
                pet[field] = req.body[field];
            }
        });

        const updatedPet = await pet.save();

        return res.status(200).json(updatedPet);

    } catch (error) {
        return res.status(500).json({
            message: "Error updating pet",
            error: error.message,
        });
    }
};



// delete pet

export const deletePet = async (req, res) => {
    try {
        const userId = req.user._id;
        const petId = req.params.id;

        const pet = await Pet.findById(petId);

        if (!pet) {
            return res.status(404).json({
                message: "Pet not found",
            });
        }

        if (pet.owner.toString() !== userId.toString()) {
            return res.status(403).json({
                message: "You do not own this pet",
            });
        }

        await pet.deleteOne();
        
        return res.status(200).json({
            message: "Pet deleted successfully",
        });
    } catch (error) {
        return res.status(500).json({
            message: "Error deleting pet",
            error: error.message,
        });
    }
};