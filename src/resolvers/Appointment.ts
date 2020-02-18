import { Context } from '../utils'

export const Appointments={
    author: ({ id }, args, ctx: Context) => {
        return ctx.prisma.appointments({ id }).author()
    },
};