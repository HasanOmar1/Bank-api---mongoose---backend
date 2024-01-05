import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { errorHandler } from "./middlewares/errorMiddleware.js";
import userRouter from "./routes/userRoute.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/v1/bank", userRouter);

app.use(errorHandler);

const PORT = process.env.PORT || 9999;

mongoose.connect(process.env.CONNECTION_URI).then(() => {
  app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
  });
});
