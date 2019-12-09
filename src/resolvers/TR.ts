import {Context} from "../utils";

export const TR={

    device_id: ({id}, args, ctx: Context) => {
    return ctx.prisma.tR({id}).device_id()
},
};
