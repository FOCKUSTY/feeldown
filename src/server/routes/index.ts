import { Router } from "express";

import { router as auth } from "./auth";
import { tokenMiddleware } from "../middlewares";

export const router = Router();

router.use(tokenMiddleware);

router.use("/auth", auth);
