import {Context} from "../utils";

export const DTC = {
    device_id: ({id}, args, ctx: Context) => {
        return ctx.prisma.dTC({id}).device_id()
    }
}
