import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import newUser from "../models/newUserModel.js";

export const protect = asyncHandler(async (req, res, next) => {
  let token;
  let authHeader = req.headers.Authorization || req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer")) {
    try {
      token = authHeader.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await newUser.findById(decoded.id).select("-password");
      next();
    } catch (error) {
      console.error("Token verification error:", error);
      res.status(401).send("Not authorized");
    }
  }

  if (!token) {
    res.status(401);
    throw new Error("User is not authorized or token is missing");
  }
});
