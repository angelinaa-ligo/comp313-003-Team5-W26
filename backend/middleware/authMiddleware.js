import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Organization from "../models/Organization.js";
import Admin from "../models/Admin.js";

export const protect = async (req, res, next) => {
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res
        .status(401)
        .json({ message: "Not authorized, no token" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("DECODED TOKEN:", decoded);

    let account = null;

    if (decoded.role === "user") {
      account = await User.findById(decoded.id).select("-password");
    } else if (decoded.role === "organization" || decoded.role === "pending") {
      account = await Organization.findById(decoded.id).select("-password");
    } else if (decoded.role === "admin") {
      account = await Admin.findById(decoded.id).select("-password");
    }

    if (!account) {
      return res.status(401).json({ message: "User not found" });
    }

    req.user = account;
    req.user.role = decoded.role;

    next(); // ✅ SEMPRE chamado se autorizado
  } catch (error) {
    console.error("AUTH ERROR:", error);
    return res
      .status(401)
      .json({ message: "Not authorized, token failed" });
  }
};