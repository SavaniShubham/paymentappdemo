import { Router } from "express";
import jwtVerify from "../middlware/authmiddleware.js";
import { balanceOfCurrentUser, transferFromCurrentUser } from "../controllers/account.controller.js";

const accountRouter = Router();

accountRouter.route("/balance").get(jwtVerify ,balanceOfCurrentUser);
accountRouter.route("/transfer").post(jwtVerify, transferFromCurrentUser);

export default accountRouter;
