import {Context} from "../utils";

export const DeviceTypeCategory={

    device_id: ({id}, args, ctx: Context) => {
        return ctx.prisma.deviceTypeCategory({id}).device_id()
    },

}