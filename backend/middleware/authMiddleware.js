import jwt from "jsonwebtoken";
import User from "../models/User.js";

// 1. Protect routes - Check if the user is logged in
export const protect = async (req, res, next) => {
  let token;

  // Check if the authorization header exists and starts with 'Bearer'
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Get token from header (Format: "Bearer <token>")
      token = req.headers.authorization.split(" ")[1];

      // Verify the token using our secret key
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Find the user by ID and attach it to the request object (minus the password)
      req.user = await User.findById(decoded.id).select("-password");

      // Move on to the actual route
      next();
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: "Not authorized, token failed" });
    }
  }

  if (!token) {
    res.status(401).json({ message: "Not authorized, no token" });
  }
};

// 2. Role authorization - Check if the user has the right role
export const authorize = (...roles) => {
  return (req, res, next) => {
    // If the user's role is not in the list of allowed roles, reject them
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: `User role '${req.user.role}' is not authorized to access this route`,
      });
    }
    next();
  };
};
