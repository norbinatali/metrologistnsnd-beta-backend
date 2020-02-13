import { Context } from '../utils'

export const TeamMembers = {
    team: ({ id }, args, ctx: Context) => {
        return ctx.prisma.teamMembers({ id }).team()
    },
};