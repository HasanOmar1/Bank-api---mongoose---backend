import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { errorHandler } from "./middlewares/errorMiddleware.js";
import userRouter from "./routes/userRoute.js";
import fs from "fs";
import newUserRouter from "./routes/newUserRoute.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  const indexHtml = fs.readFileSync("./constants/index.html", "utf-8");
  res.send(indexHtml);
});

app.use("/api/v1/bank", userRouter);
app.use("/api/v1/users", newUserRouter);

app.use(errorHandler);

const PORT = process.env.PORT || 3000;

mongoose.connect(process.env.CONNECTION_URI).then(() => {
  app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
  });
});
