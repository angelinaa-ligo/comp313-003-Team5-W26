import AdoptionRequest from "../models/AdoptionRequest.js";
import Animal from "../models/Animal.js";

/**
 * USER → create adoption request
 */
export const createAdoptionRequest = async (req, res) => {
  try {
    const userId = req.user._id;
    const { animalId } = req.body;

    const animal = await Animal.findById(animalId);
    if (!animal || animal.adoptionStatus !== "available") {
      return res.status(400).json({ message: "Animal not available" });
    }

    const exists = await AdoptionRequest.findOne({
      animal: animalId,
      user: userId,
    });

    if (exists) {
      return res.status(400).json({ message: "Request already exists" });
    }

    const request = await AdoptionRequest.create({
      animal: animalId,
      user: userId,
      organization: animal.organization,
    });

    animal.adoptionStatus = "pending";
    animal.adoptionRequestId = request._id;
    await animal.save();

    res.status(201).json(request);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * ORGANIZATION → get requests
 */
export const getOrganizationRequests = async (req, res) => {
  try {
    const orgId = req.organization._id;

    const requests = await AdoptionRequest.find({
      organization: orgId,
    })
      .populate("animal")
      .populate("user", "name email");

    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * ORGANIZATION → accept / reject
 */
export const updateAdoptionRequestStatus = async (req, res) => {
  const { status } = req.body;
  const requestId = req.params.id;

  const request = await AdoptionRequest.findById(requestId).populate("animal");

  if (!request) {
    return res.status(404).json({ message: "Request not found" });
  }

  request.status = status;
  await request.save();

  if (status === "approved") {
    await Animal.findByIdAndUpdate(request.animal._id, {
      adoptionStatus: "adopted",
      adopter: request.user,
      adoptionRequestId: null,
    });

    await AdoptionRequest.updateMany(
      {
        animal: request.animal._id,
        _id: { $ne: requestId },
      },
      { status: "rejected" }
    );
  }

  if (status === "rejected") {
    await Animal.findByIdAndUpdate(request.animal._id, {
      adoptionStatus: "available",
      adoptionRequestId: null,
    });
  }

  res.json({ message: "Adoption request updated successfully" });
};