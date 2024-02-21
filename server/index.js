import express from "express";
import "./config/db.js";
import { authRouter } from "./routes/auth.route.js";
import cookieParser from "cookie-parser";
import { userRouter } from "./routes/user.route.js";
import { listingRouter } from "./routes/listing.route.js";

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use("/server/auth", authRouter);
app.use("/server/user", userRouter);
app.use("/server/listing", listingRouter);

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "internal server error";
  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});

const port = 3000;

app.use("/health", (req, res) => {
  return res.json("API is up and running properly");
});

app.listen(port, () => {
  console.log("server is running on port 3000");
});
