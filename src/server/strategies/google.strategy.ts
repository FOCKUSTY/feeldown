import type { VerifyCallback } from "passport-oauth2";
import { Strategy } from "passport-google-oauth20";

import passport from "passport";
import { prisma } from "../prisma";
import { env } from "../env";
import { v4 as uuid } from "uuid";
import { sign } from "jsonwebtoken";

passport.serializeUser((user: any, done) => {
  return done(null, user.user.id);
});

passport.deserializeUser(async (id, done) => {
  const [ user, auth ] = await prisma.$transaction([
    prisma.user.findUnique({
      where: {
        id: id as string
      }
    }),
    prisma.auth.findFirst({
      where: {
        userId: id as string
      }
    })
  ]);

  if (auth && user) {
    return done(null, {auth, user});
  }

  return done(null, null);
});

passport.use(new Strategy({
  clientID: env.GOOGLE_CLIENT_ID,
  clientSecret: env.GOOGLE_CLIENT_SECRET,
  callbackURL: env.GOOGLE_CALLBACK_URL,
  scope: ["openid", "profile", "email"]
}, async (
  accessToken: string,
  refreshToken: string,
  profile,
  done: VerifyCallback
) => {
  const existedAuth = await prisma.auth.findFirst({
    where: {
      provider: profile.provider,
      providerId: profile.id
    }
  });

  if (existedAuth) {
    const user = await prisma.user.findUnique({
      where: {
        id: existedAuth.userId
      }
    });

    if (!user) {
      throw new Error("user not found");
    }

    return done(null, { auth: existedAuth, user });
  }

  const authId = uuid();
  const userId = uuid();
  const token = sign({
    authId,
    userId,
    accessToken
  }, env.HASH_KEY, {
    expiresIn: env.TOKEN_EXPIRATION
  });

  const [ user, auth ] = await prisma.$transaction([
    prisma.user.create({
      data: {
        id: userId,
        username: uuid(),
        name: profile.username || profile.displayName,
      }
    }),
    prisma.auth.create({
      data: {
        id: authId,
        provider: profile.provider,
        providerId: profile.id,
        email: profile.emails?.[0].value,
        token,
        userId,
        accessToken,
        refreshToken
      }
    }),
  ])

  return done(null, {user, auth});
}));
