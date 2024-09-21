import { Router } from "express";
import { allusersdata, loginUser, registerUser, updateUser } from "../controllers/User.controllers.js";
import jwtVerify from "../middlware/authmiddleware.js";

const userRouter = Router();

userRouter.route("/signup").post(registerUser);
userRouter.route("/signIn").post(loginUser);
userRouter.route("/update-user").patch(jwtVerify, updateUser);
userRouter.route("/allusers").get(jwtVerify, allusersdata);

export default userRouter;
