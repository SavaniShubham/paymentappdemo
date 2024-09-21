import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import ApiError from "./utils/apiError.js";


const app=express();


app.use(cors(
    {
        origin:'http://localhost:5173',
        credentials:true,
    }
))

app.use(express.json())

app.use(cookieParser())


import userRouter from "./routes/User.routes.js";
import accountRouter from "./routes/account.routes.js";



app.use("/api/v1/users", userRouter)

app.use("/api/v1/account",accountRouter);

//http://localhost:3000/api/v1/users/register

app.use((err, req, res, next) => {
    if (err instanceof ApiError) {
      // Send the custom error response
      res.status(err.statusCode).json({
        success: err.success,
        message: err.message,
        data: err.data,
      });
    } else {
      // Handle other errors (e.g., unexpected errors)
      res.status(500).json({
        success: false,
        message: 'An unexpected error occurred',
      });
    }
  });
  

export default app;