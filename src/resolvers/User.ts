import { Context } from '../utils'

export const User = {
  posts: ({ id }, args, ctx: Context) => {
    return ctx.prisma.user({ id }).posts()
  },
  devices: ({ id }, args, ctx: Context) => {
    return ctx.prisma.user({ id }).devices()
  },
  mydevices: ({ id }, args, ctx: Context) => {
    return ctx.prisma.user({ id }).mydevices()
  },
};
