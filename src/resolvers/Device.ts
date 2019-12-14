import {Context} from "../utils";

export const Device = {
    author: ({id}, args, ctx: Context) => {
        return ctx.prisma.device({id}).author()
    },
    tr: ({id}, args, ctx: Context) => {
        return ctx.prisma.device({id}).tr()
    },
};
