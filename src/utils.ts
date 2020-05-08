import * as jwt from 'jsonwebtoken'
import { Prisma } from './generated/prisma-client'


export interface Context {
  prisma: Prisma
  request: any
}
export function updateUser(ctx: Context, email: string, data: any) {
  return ctx.prisma.updateUser({
    where: { email: email },
    data
  });
}

export function getUserId(ctx) {
  const Authorization = ctx.req.headers.authorization;
  if (Authorization) {
    const token = Authorization.replace('Bearer ', '');
    const { userId } = jwt.verify(token, process.env.APP_SECRET) as { userId: string };
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
export function updateUserResetToken(ctx: Context, email:string, data: any){
  return updateUser(ctx, email, data);
}
export function findTeamId({id}, ctx:Context) {
  return ctx.prisma.teams({where: {id}})

}
export function findTeamMemberId({id}, ctx:Context) {
  return ctx.prisma.teamMemberses({where: {id}})

}
export function updateTeam(ctx:Context, email: string, data: any) {
  const userUp = ctx.prisma.user({email:email});
  const userId = getUserId(ctx);
  if (!userUp) {
    throw new Error(`No such user found for email: ${email}`)
  } else {
    return ctx.prisma.updateTeam({where:{author:{id:userId}},data});

  }
}
export function updateTeamResetToken(ctx: Context, email:string, data: any){
  const userId = getUserId(ctx);
  return updateTeam(ctx, email, data);
}
