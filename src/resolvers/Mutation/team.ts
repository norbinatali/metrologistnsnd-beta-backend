import { getUserId, Context } from '../../utils'

export const team = {
    async createTeam(parent, {name}, ctx: Context, info) {
        const userId = getUserId(ctx);
        return ctx.prisma.createTeam({
                name: name,
                payment: false,
                author: {
                    connect: {id: userId},
                },
            }
            )
    },

    async teamUser(parent, { id }, ctx: Context, info) {
        const userId = getUserId(ctx);
        const teamExists = await ctx.prisma.$exists.team({
            id,
            author: { id: userId },
        });
        if (!teamExists) {
            throw new Error(`Team is not found or you're not the author`)
        }

        return ctx.prisma.updateTeam({where: { id },data:{}
        })
    },

    async deleteTeam(parent, { id }, ctx: Context, info) {
        const userId = getUserId(ctx);
        const teamExists = await ctx.prisma.$exists.team({
            id,
            author: { id: userId },
        });
        if (!teamExists) {
            throw new Error(`Post not found or you're not the author`)
        }

        return ctx.prisma.deleteTeam({ id })
    },
}
