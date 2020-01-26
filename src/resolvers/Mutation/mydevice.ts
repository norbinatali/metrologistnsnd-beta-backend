import {getUserId, Context, getTRId} from '../../utils'


export const mydevice={
createNewMyDevice: async function (parent, {name_device,brand_device,series_device,kind_device,certificate_calibration,certificate_verification,certificate_conformity,module_device,tr_device,certificate_assessment_number,certificate_verification_number,certificate_calibration_number,department_assessment_center,department_verification_center,department_calibration_center,conformity_data,calibration_data,valid_verification,notes}, ctx: Context, info){
        const userId = getUserId(ctx);
        return ctx.prisma.createMyDevice({
            name_device: name_device,
            brand_device:brand_device,
            series_device:series_device,
            kind_device:kind_device,
            certificate_calibration:certificate_calibration,
            certificate_verification:certificate_verification,
            certificate_conformity:certificate_conformity,
            certificate_assessment_number:certificate_assessment_number,
            certificate_calibration_number:certificate_calibration_number,
            certificate_verification_number:certificate_verification_number,
            module_device:module_device,
            tr_device:tr_device,
            department_assessment_center:department_assessment_center,
            department_calibration_center:department_calibration_center,
            department_verification_center:department_verification_center,
            calibration_data:calibration_data,
            conformity_data:conformity_data,
            valid_verification:valid_verification,
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
