import { env } from "@/server/env";
import { ExpressUser } from "@/server/types";
import { Router } from "express";

import passpot from "passport";

export const router = Router();

router.get("/google", passpot.authenticate("google"));

router.get("/google/callback", passpot.authenticate("google"), (request, response) => {
  const user = request.user as ExpressUser|undefined;
  if (!user) {
    response.redirect(env.CALLBACK_URL);
    return;
  }

  response.redirect(`${env.CALLBACK_URL}?token=${user.auth.token}`);
});
