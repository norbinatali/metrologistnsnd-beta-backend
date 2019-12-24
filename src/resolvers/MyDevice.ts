import {Context} from "../utils";

export const MyDevice= {

    author: ({id}, args, ctx: Context) => {
        return ctx.prisma.myDevice({id}).author()
    },

};