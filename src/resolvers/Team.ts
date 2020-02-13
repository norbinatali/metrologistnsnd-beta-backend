import { Context } from '../utils'

export const Team = {
    author: ({ id }, args, ctx: Context) => {
        return ctx.prisma.team({ id }).author()
    },
    teamMembers: ({ id }, args, ctx: Context) => {
        return ctx.prisma.team({ id }).teamMembers()
    },
};