import { Router } from "express";
import { createUser, loginUser, protect, protectRoute } from "../controller/auth";
const authRouter = Router();

authRouter.route("/signup").post(createUser);
authRouter.route("/login").post(loginUser);
authRouter.route("/protect").get(protectRoute, protect);

export {authRouter};