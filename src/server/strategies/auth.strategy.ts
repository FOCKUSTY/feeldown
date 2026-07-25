import type { VerifyCallback } from 'passport-oauth2';
import type { Profile } from 'passport';
import type { Provider } from '../types';

import passport from 'passport';
import { prisma } from '../prisma';
import { env } from '../env';
import { v4 as uuid } from 'uuid';
import { sign } from 'jsonwebtoken';
import { GROUPED_AUTH_PARAMETERS } from '../constants';

//@ts-ignore
import { Strategy as Github } from 'passport-github';
import { Strategy as Google } from 'passport-google-oauth20';

passport.serializeUser((user: any, done) => {
  return done(null, user.user.id);
});

passport.deserializeUser(async (id, done) => {
  const user = await prisma.user.findUnique({
    where: {
      id: id as string,
    },
  });

  const auth = await prisma.auth.findFirst({
    where: {
      userId: id as string,
    },
  });

  if (auth && user) {
    return done(null, { auth, user });
  }

  return done(null, null);
});

export const verify = async (
  accessToken: string,
  refreshToken: string,
  profile: Profile,
  done: VerifyCallback,
) => {
  const existedAuth = await prisma.auth.findFirst({
    where: {
      provider: profile.provider,
      providerId: profile.id,
    },
  });
  if (existedAuth) {
    const user = await prisma.user.findUnique({
      where: {
        id: existedAuth.userId,
      },
    });
    if (!user) {
      throw new Error('user not found');
    }
    return done(null, { auth: existedAuth, user });
  }
  const authId = uuid();
  const userId = uuid();
  const token = sign(
    {
      authId,
      userId,
      accessToken,
    },
    env.HASH_KEY,
    {
      expiresIn: env.TOKEN_EXPIRATION,
    },
  );
  const [user, auth] = await prisma.$transaction([
    prisma.user.create({
      data: {
        id: userId,
        description: '',
        username: uuid(),
        name: profile.username || profile.displayName,
      },
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
        refreshToken,
      },
    }),
  ]);
  return done(null, { user, auth });
};

const STRATEGIES: Record<Provider, any> = {
  github: Github,
  google: Google,
};

export const useStrategy = (provider: Provider, scope: string[]) => {
  const parameters = GROUPED_AUTH_PARAMETERS[provider];

  const Strategy = STRATEGIES[provider];
  const strategy = new Strategy(
    {
      clientID: parameters.CLIENT_ID,
      clientSecret: parameters.CLIENT_SECRET,
      callbackURL: parameters.CALLBACK_URL,
      scope,
    },
    verify,
  );

  return strategy;
};
