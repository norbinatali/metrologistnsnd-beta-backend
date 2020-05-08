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

   
   
}
