import {Context} from "../utils";

export const Device = {
    tr: ({id}, args, ctx: Context) => {
        return ctx.prisma.device({id}).tr()
    },
    dtc: ({id}, args, ctx: Context) => {
        return ctx.prisma.device({id}).dtc()
    },
};
