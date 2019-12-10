import * as jwt from 'jsonwebtoken'
import { Prisma } from './generated/prisma-client'
import {IGraphqlAuthenticationConfig} from "./createConfirmationURL";

export interface Context {
  prisma: Prisma
  request: any
  graphqlAuthentication: IGraphqlAuthenticationConfig,
}
export function updateUser(ctx: Context, email: string, data: any) {
  return ctx.prisma.updateUser({
    where: { email: email },
    data
  });
}

export function getUserId(ctx: Context) {
  const Authorization = ctx.request.get('Authorization');
  if (Authorization) {
    const token = Authorization.replace('Bearer ', '');
    const { userId } = jwt.verify(token, "jwtsecret123") as { userId: string };
    return userId
  }

  throw new AuthError()
}

export class AuthError extends Error {
  constructor() {
    super('Not authorized')
  }
}
export function getTRId(ctx: Context) {
  const { trId } = ctx.request.get.prisma.tRs({});
  return trId
}
export function findUserByEmail(ctx: Context, email: string, info?: any){
  const user =  ctx.prisma.user({ email});
  if (!user) {
    throw new Error(`No such user found for email: ${email}`)
  }
  return user

}

