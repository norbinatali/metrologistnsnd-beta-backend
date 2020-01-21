import {getUserId, Context, getTRId} from '../../utils'


export const mydevice={
createNewMyDevice: async function (parent, {conformity_data, name_device,series_device,brand_device,type_device,certification_conformity,certification_number, certification_calibration,department_center,notes,certification_verification, next_conformity,next_calibration, module_device, valid_verification, calibration}, ctx: Context, info){
        const userId = getUserId(ctx);
        return ctx.prisma.createMyDevice({
            name_device: name_device,
            certification_calibration:certification_calibration,
            certification_verification:certification_verification,
            certification_conformity:certification_conformity,
            brand_device: brand_device,
            type_device:  type_device,
            series_device:series_device,
            module_device: module_device,
            notes:notes,
            certification_number:certification_number,
            conformity_data:conformity_data,
            department_center:department_center,
            next_conformity:next_conformity,
            next_calibration: next_calibration,
            valid_verification: valid_verification,
            calibration: calibration,
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
