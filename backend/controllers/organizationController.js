import Organization from "../models/Organization.js";

export const getOrganizationProfile = async (req, res) => {
  try {
    // Não precisa checar role aqui, o middleware já garante que é uma org
    if (!req.organization) {
      return res.status(403).json({ message: "Access denied" });
    }

    // Retorna a organização atual
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

    // Verificar security answer
    if (
      !securityAnswer ||
      securityAnswer.toLowerCase() !== req.organization.securityAnswer.toLowerCase()
    ) {
      return res.status(401).json({ message: "Your security answer does not match" });
    }

    // Atualizar campos enviados
    if (name) req.organization.name = name;
    if (email) req.organization.email = email;
    if (address) req.organization.address = address;
    if (phone) req.organization.phone = phone;

    await req.organization.save();

    res.json({
      message: "Organization profile updated successfully",
      name: req.organization.name,
      email: req.organization.email,
      address: req.organization.address,
      phone: req.organization.phone,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};