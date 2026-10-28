import { NextFunction, Request, Response } from 'express';
import { verify } from 'jsonwebtoken';
import { env } from '../env';
import { prisma } from '../prisma';

export const tokenMiddleware = async (
  request: Request,
  _response: Response,
  next: NextFunction,
) => {
  const { authorization } = request.headers;
  if (!authorization) {
    return next();
  }

  const [method, ...tokenData] = authorization.split(' ');
  const token = tokenData.join(' ');

  if (method !== 'Bearer') {
    return next();
  }

  const payload = verify(token, env.HASH_KEY);
  if (typeof payload === 'string') {
    return next();
  }

  const { authId, userId } = payload;
  if (!authId || !userId) {
    return next();
  }

  const auth = await prisma.auth.findFirst({ where: { id: authId } });
  const user = await prisma.user.findFirst({ where: { id: userId } });

  if (!auth || !user) {
    return next();
  }

  request.user = {
    user,
    auth,
  };

  next();
};
