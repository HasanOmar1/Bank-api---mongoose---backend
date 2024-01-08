import express from "express";
import {
  addClient,
  deleteUser,
  depositCash,
  filterByCashLessThan,
  filterByCashMoreThan,
  getAllUsers,
  getUserById,
  sortByHighCash,
  sortByLowCash,
  transferMoney,
  updateCredit,
  updateUser,
  withdrawMoney,
} from "../controllers/userController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

// api/v1/bank

router.get("/filter-cash/less-than", filterByCashLessThan); // not using it in frontend .
router.get("/filter-cash/more-than", filterByCashMoreThan); // not using it in frontend .
router.get("/sort-low", sortByLowCash);
router.get("/sort-high", sortByHighCash);
router.get("/:id", getUserById);

router.post("/", addClient);

router.get("/", getAllUsers);
router.delete("/:id", deleteUser);

router.put("/:id", updateUser); // not using it in frontend .
// private routes
router.use(protect);
router.put("/update-credit/:id", updateCredit);
router.put("/deposit-cash/:id", depositCash);
router.put("/withdraw/:id", withdrawMoney);
router.put("/transfer/from/:senderId/to/:recipientId", transferMoney);

export default router;
