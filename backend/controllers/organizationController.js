import Organization from "../models/Organization.js";

export const getOrganizationProfile = async (req, res) => {
  try {
    if (!req.organization) {
      return res.status(403).json({ message: "Access denied" });
    }

    res.json(req.organization);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateOrganizationProfile = async (req, res) => {
  try {
    if (!req.organization) {
      return res.status(403).json({ message: "Access denied" });
    }

    const { name, email, address, phone, securityAnswer } = req.body;

    // security answer
    if (
      !securityAnswer ||
      securityAnswer.toLowerCase() !==
        req.organization.securityAnswer.toLowerCase()
    ) {
      return res
        .status(401)
        .json({ message: "Your security answer does not match" });
    }

    if (name) req.organization.name = name;
    if (email) req.organization.email = email;
    if (phone) req.organization.phone = phone;

    if (address) {
      req.organization.address.street =
        address.street ?? req.organization.address.street;

      req.organization.address.city =
        address.city ?? req.organization.address.city;

      req.organization.address.province =
        address.province ?? req.organization.address.province;

      req.organization.address.postalCode =
        address.postalCode ?? req.organization.address.postalCode;

      req.organization.address.country =
        address.country ?? req.organization.address.country;
    }

    await req.organization.save();

    res.json({
      message: "Organization profile updated successfully",
      organization: {
        name: req.organization.name,
        email: req.organization.email,
        phone: req.organization.phone,
        address: req.organization.address,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};