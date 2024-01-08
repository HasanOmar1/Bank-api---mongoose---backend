import express from "express";
import {
  createUser,
  deleteNewUsers,
  getUserByToken,
  getNewUsers,
  loginUser,
} from "../controllers/newUserController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

// api/v1/users
// public routers
router.post("/create", createUser);
router.post("/login", loginUser);
router.delete("/:id", deleteNewUsers);
router.get("/", getNewUsers);

// private routers
router.use(protect);
router.get("/token", getUserByToken); // token

export default router;
