import { Context } from '../utils'

export const User = {
  posts: ({ id }, args, ctx: Context) => {
    return ctx.prisma.user({ id }).posts()
  },
  appointments: ({ id }, args, ctx: Context) => {
    return ctx.prisma.user({ id }).appointments()
  },

  mydevices: ({ id }, args, ctx: Context) => {
    return ctx.prisma.user({ id }).mydevices()
  },
  teams: ({ id }, args, ctx: Context) => {
    return ctx.prisma.user({ id }).teams()
  },
};
