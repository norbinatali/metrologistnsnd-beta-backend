import {getUserId, Context, getTRId} from '../../utils'


export const mydevice={
createNewMyDevice: async function (parent, {brand_device,type_device, calibration,notes,verification_device, next_calibration, module_device}, ctx: Context, info){
    const userId = getUserId(ctx);
    return ctx.prisma.createMyDevice({
        brand_device: brand_device,
        type_device:  type_device,
        module_device: module_device,
        notes:notes,
        verification_device:verification_device,
        calibration:calibration ,
        next_calibration: next_calibration,
        author:{connect:{id: userId}}

    })
},
    async publishMyDevice(parent, { id }, ctx: Context, info) {
        const userId = getUserId(ctx);
        const mydeviceExists = await ctx.prisma.$exists.myDevice({
            id,
            author: { id: userId },
        });
        if (!mydeviceExists) {
            throw new Error(`My device not found or you're not the author`)
        }
        return ctx.prisma.updateMyDevice({where: { id },data:{}
        })
    },
    async deleteMyDevice(parent, { id }, ctx: Context, info) {
        const userId = getUserId(ctx);
        const mydeviceExists = await ctx.prisma.$exists.myDevice({
            id,
            author: { id: userId },
        });
        if (!mydeviceExists) {
            throw new Error(`Post not found or you're not the author`)
        }

        return ctx.prisma.deleteMyDevice({ id })
    },


};
