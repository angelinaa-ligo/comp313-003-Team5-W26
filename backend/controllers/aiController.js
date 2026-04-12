import { generateContent, generateJSON } from "../config/aiService.js";
import Animal from "../models/Animal.js";
import AdoptionRequest from "../models/AdoptionRequest.js";
import CareCampaign from "../models/CareCampaign.js";

/* ═══════════════════════════════════════════════════════
   US-02 — Generate Animal Profile Description
   POST /api/ai/generate-description
   ═══════════════════════════════════════════════════════ */
export const generateDescription = async (req, res) => {
  try {
    const { name, species, breed, age, sex } = req.body;

    if (!name || !species || !sex) {
      return res.status(400).json({
        message: "Name, species, and sex are required",
      });
    }

    const prompt = `You are a professional animal shelter copywriter. Write a warm, friendly, and compelling adoption profile description for this animal:

Name: ${name}
Species: ${species}
Breed: ${breed || "Mixed/Unknown"}
Age: ${age ? age + " years old" : "Unknown age"}
Sex: ${sex}

Requirements:
- Write between 80 and 200 words
- Use a warm, friendly tone appropriate for pet adoption
- Reference the animal's name, species, breed (if known), age, and sex naturally
- Highlight positive personality traits and what makes this animal special
- Include a call-to-action encouraging adoption
- Do NOT include any harmful, offensive, or misleading content
- Return ONLY the description text, no headers or labels`;

    const description = await generateContent(prompt);

    res.json({ description: description.trim() });
  } catch (error) {
    console.error("AI Description Error:", error.message);
    res.status(503).json({
      message: "Description generation failed. Please write one manually.",
    });
  }
};

/* ═══════════════════════════════════════════════════════
   US-05 — Generate Campaign Content
   POST /api/ai/generate-campaign
   ═══════════════════════════════════════════════════════ */
export const generateCampaignContent = async (req, res) => {
  try {
    const { eventDate, location, campaignType, isAdmin } = req.body;

    if (!eventDate || !location || !campaignType) {
      return res.status(400).json({
        message: "Event date, location, and campaign type are required",
      });
    }

    const scopeNote = isAdmin
      ? "This is a PLATFORM-WIDE campaign (not organization-specific). Use inclusive, community-wide language."
      : "This is an organization-specific campaign.";

    const prompt = `You are a marketing expert for animal welfare campaigns. Generate campaign content for:

Campaign Type: ${campaignType}
Event Date: ${eventDate}
Location: ${location}
Scope: ${scopeNote}

Return a JSON object with these exact fields:
{
  "title": "A compelling campaign title (max 10 words)",
  "description": "A 100-150 word event description that is warm, community-focused, and action-oriented with a clear call to action",
  "socialPost": "A social media caption under 280 characters with 3-5 relevant hashtags"
}

Requirements:
- Tone: warm, community-focused, action-oriented
- Include a call to action in the description
- The social post MUST be under 280 characters including hashtags
- Do NOT include harmful or inappropriate content
- Return ONLY valid JSON, no markdown formatting`;

    const content = await generateJSON(prompt);

    // Enforce social post character limit
    if (content.socialPost && content.socialPost.length > 280) {
      content.socialPost = content.socialPost.substring(0, 277) + "...";
    }

    res.json(content);
  } catch (error) {
    console.error("AI Campaign Error:", error.message);
    res.status(503).json({
      message: "Campaign content generation failed. Please write content manually.",
    });
  }
};

/* ═══════════════════════════════════════════════════════
   US-04 — Adoption Trend Analytics & Insights
   GET /api/ai/insights
   ═══════════════════════════════════════════════════════ */
export const getAIInsights = async (req, res) => {
  try {
    const role = req.user.role;
    const isOrganization = role === "organization";

    // Build query filter
    let animalFilter = {};
    let requestFilter = {};

    if (isOrganization) {
      // Scoped to this organization
      const orgId = req.user._id;
      animalFilter = { organization: orgId };
      requestFilter = { organization: orgId };
    }

    // Gather data
    const animals = await Animal.find(animalFilter);
    const adoptionRequests = await AdoptionRequest.find(requestFilter);
    const campaigns = await CareCampaign.find(
      isOrganization ? { organization: req.user._id } : {}
    );

    // Count adoption events
    const adoptedCount = adoptionRequests.filter(
      (r) => r.status === "approved"
    ).length;

    if (adoptedCount < 5) {
      return res.json({
        insufficientData: true,
        message:
          "Not enough data yet. Insights will appear after 5+ adoption events.",
      });
    }

    // Build stats summary for AI
    const totalAnimals = animals.length;
    const availableAnimals = animals.filter(
      (a) => a.adoptionStatus === "available"
    ).length;
    const pendingAnimals = animals.filter(
      (a) => a.adoptionStatus === "pending"
    ).length;
    const adoptedAnimals = animals.filter(
      (a) => a.adoptionStatus === "adopted"
    ).length;

    const approvedRequests = adoptionRequests.filter(
      (r) => r.status === "approved"
    );
    const rejectedRequests = adoptionRequests.filter(
      (r) => r.status === "rejected"
    );
    const pendingRequests = adoptionRequests.filter(
      (r) => r.status === "pending"
    );

    // Species breakdown
    const speciesCount = {};
    animals.forEach((a) => {
      speciesCount[a.species] = (speciesCount[a.species] || 0) + 1;
    });

    // Avg days to adoption
    let avgDays = "N/A";
    if (approvedRequests.length > 0) {
      const totalDays = approvedRequests.reduce((sum, r) => {
        const animal = animals.find(
          (a) => a._id.toString() === r.animal.toString()
        );
        if (animal) {
          const listed = new Date(animal.createdAt);
          const adopted = new Date(r.updatedAt);
          return sum + (adopted - listed) / (1000 * 60 * 60 * 24);
        }
        return sum;
      }, 0);
      avgDays = Math.round(totalDays / approvedRequests.length);
    }

    // Long-listed animals (30+ days without adoption)
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const longListed = animals.filter(
      (a) =>
        a.adoptionStatus === "available" &&
        new Date(a.createdAt) < thirtyDaysAgo
    );

    const dataSummary = `
Organization Data Summary:
- Total animals: ${totalAnimals}
- Available: ${availableAnimals}, Pending: ${pendingAnimals}, Adopted: ${adoptedAnimals}
- Species breakdown: ${JSON.stringify(speciesCount)}
- Total adoption requests: ${adoptionRequests.length}
- Approved: ${approvedRequests.length}, Rejected: ${rejectedRequests.length}, Pending: ${pendingRequests.length}
- Approval rate: ${adoptionRequests.length > 0 ? Math.round((approvedRequests.length / adoptionRequests.length) * 100) : 0}%
- Average days from listing to adoption: ${avgDays}
- Animals listed 30+ days without adoption: ${longListed.length}
- Active campaigns: ${campaigns.filter((c) => c.isActive).length}
- Total campaigns: ${campaigns.length}
    `;

    const prompt = `You are a data analyst for an animal shelter platform. Based on the following data, generate exactly 3 actionable insights.

${dataSummary}

Return a JSON array of exactly 3 insight objects:
[
  {
    "icon": "an emoji that fits the insight",
    "title": "A clear, data-driven title (e.g., 'Cats adopted 40% faster than dogs')",
    "explanation": "A one-sentence explanation of the insight",
    "action": "A specific recommended action (e.g., 'Consider featuring senior dogs in your next campaign')"
  }
]

Requirements:
- Each insight must be data-driven and reference specific numbers from the summary
- Keep titles concise and impactful
- Actions must be specific and actionable
- Return ONLY valid JSON, no markdown`;

    const insights = await generateJSON(prompt);

    res.json({ insights });
  } catch (error) {
    console.error("AI Insights Error:", error.message);
    res.status(503).json({
      message: "AI insights are currently unavailable.",
    });
  }
};

/* ═══════════════════════════════════════════════════════
   US-01 — AI Pet Matching
   POST /api/ai/match
   ═══════════════════════════════════════════════════════ */
export const matchPets = async (req, res) => {
  try {
    const { preferences } = req.body;

    if (!preferences) {
      return res.status(400).json({
        message: "Preferences are required",
      });
    }

    const {
      homeType,
      outdoorSpace,
      activityLevel,
      petExperience,
      preferredSpecies,
      householdMembers,
    } = preferences;

    // Get all available animals
    const availableAnimals = await Animal.find({
      adoptionStatus: "available",
    }).populate("organization", "name");

    if (availableAnimals.length === 0) {
      return res.json({
        matches: [],
        message:
          "There are currently no animals available for adoption. Please check back soon!",
      });
    }

    // Build animal list for AI
    const animalList = availableAnimals.map((a) => ({
      id: a._id.toString(),
      name: a.name,
      species: a.species,
      breed: a.breed || "Unknown",
      age: a.age || "Unknown",
      sex: a.sex,
      organization: a.organization?.name || "Unknown",
      description: a.description || "",
    }));

    const prompt = `You are an expert pet adoption counselor. Based on the adopter's lifestyle and preferences, rank the best animal matches from the available list.

ADOPTER PREFERENCES:
- Home type: ${homeType}
- Outdoor space: ${outdoorSpace}
- Activity level: ${activityLevel}
- Pet experience: ${petExperience}
- Preferred species: ${preferredSpecies}
- Household: ${householdMembers}

AVAILABLE ANIMALS:
${JSON.stringify(animalList, null, 2)}

Return a JSON object:
{
  "matches": [
    {
      "animalId": "the animal's id field",
      "compatibilityScore": 85,
      "compatibilityNote": "One sentence explaining why this animal is a great match"
    }
  ],
  "message": "A friendly summary message (1-2 sentences) about the matches found"
}

Requirements:
- Return up to 5 matches maximum, ordered by compatibility score (highest first)
- Score from 0-100 based on how well the animal fits the adopter's lifestyle
- Only include animals scoring 40 or above
- If no good matches exist, return empty matches array with a helpful message suggesting they broaden their search
- compatibilityNote must be warm and specific to both the adopter's situation and the animal
- Return ONLY valid JSON, no markdown`;

    const result = await generateJSON(prompt);

    // Enrich matches with full animal data
    const enrichedMatches = (result.matches || []).map((match) => {
      const animal = availableAnimals.find(
        (a) => a._id.toString() === match.animalId
      );
      return {
        ...match,
        animal: animal
          ? {
              _id: animal._id,
              name: animal.name,
              species: animal.species,
              breed: animal.breed,
              age: animal.age,
              sex: animal.sex,
              description: animal.description,
              organization: animal.organization?.name,
            }
          : null,
      };
    }).filter((m) => m.animal !== null);

    res.json({
      matches: enrichedMatches,
      message: result.message || "Here are your matches!",
    });
  } catch (error) {
    console.error("AI Match Error:", error.message);
    res.status(503).json({
      message:
        "Our AI assistant is taking a break. Please browse pets manually.",
    });
  }
};

/* ═══════════════════════════════════════════════════════
   US-03 — Smart Adoption Screening
   GET /api/ai/screen-adoption/:requestId
   ═══════════════════════════════════════════════════════ */
export const screenAdoption = async (req, res) => {
  try {
    const { requestId } = req.params;

    const adoptionRequest = await AdoptionRequest.findById(requestId)
      .populate("animal")
      .populate("user", "name email createdAt");

    if (!adoptionRequest) {
      return res.status(404).json({ message: "Adoption request not found" });
    }

    // Verify ownership
    if (
      adoptionRequest.organization.toString() !==
      req.organization._id.toString()
    ) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const animal = adoptionRequest.animal;
    const user = adoptionRequest.user;

    // Calculate account age in days
    const accountAgeDays = Math.floor(
      (Date.now() - new Date(user.createdAt).getTime()) / (1000 * 60 * 60 * 24)
    );

    // Count user's previous adoption requests
    const previousRequests = await AdoptionRequest.countDocuments({
      user: user._id,
    });

    const prompt = `You are an animal adoption screening specialist. Evaluate this adoption application and provide a compatibility assessment.

ANIMAL PROFILE:
- Name: ${animal.name}
- Species: ${animal.species}
- Breed: ${animal.breed || "Unknown"}
- Age: ${animal.age || "Unknown"} years
- Sex: ${animal.sex}

APPLICANT PROFILE:
- Name: ${user.name}
- Account age: ${accountAgeDays} days
- Previous adoption requests: ${previousRequests}
- Request submitted: ${adoptionRequest.createdAt.toISOString().split("T")[0]}

Return a JSON object:
{
  "score": 75,
  "level": "high",
  "rationale": [
    "Specific reason 1 for the score",
    "Specific reason 2 for the score",
    "Specific reason 3 for the score"
  ],
  "recommendation": "Approve"
}

Requirements:
- score: 0-100 integer
- level: "high" (70-100), "medium" (40-69), or "low" (0-39)
- rationale: exactly 2-3 bullet points explaining the score
- recommendation: exactly one of "Approve", "Review Further", or "Decline"
- Base assessment on account age (trust signal), previous activity, and animal-applicant compatibility
- Be fair and reasonable — newer accounts are not automatically low
- Return ONLY valid JSON, no markdown`;

    const screening = await generateJSON(prompt);

    res.json({
      requestId,
      score: screening.score,
      level: screening.level,
      rationale: screening.rationale,
      recommendation: screening.recommendation,
    });
  } catch (error) {
    console.error("AI Screening Error:", error.message);
    res.status(503).json({
      message: "AI screening is currently unavailable.",
    });
  }
};
