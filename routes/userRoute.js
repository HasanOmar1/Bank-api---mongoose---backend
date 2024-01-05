import express from "express";
import {
  createUser,
  deleteUser,
  depositCash,
  filterByCashLessThan,
  filterByCashMoreThan,
  getAllUsers,
  getUserById,
  transferMoney,
  updateCredit,
  updateUser,
  withdrawMoney,
} from "../controllers/userController.js";

const router = express.Router();

router.get("/", getAllUsers);
router.get("/filter-cash/less-than", filterByCashLessThan);
router.get("/filter-cash/more-than", filterByCashMoreThan);
router.get("/:id", getUserById);

router.post("/", createUser);

router.put("/:id", updateUser);
router.put("/update-credit/:id", updateCredit);
router.put("/deposit-cash/:id", depositCash);
router.put("/withdraw/:id", withdrawMoney);
router.put("/transfer/from/:senderId/to/:recipientId", transferMoney);

router.delete("/:id", deleteUser);

export default router;
