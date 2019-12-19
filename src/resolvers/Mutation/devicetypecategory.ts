import { getUserId, Context } from '../../utils'
import {device} from "./device";
export const devicetypecategory={

    createNewDeviceTypeCategory:{
        async function (parent, {name_TR_UA, name_TR_EN}, ctx: Context, info) {

            return ctx.prisma.createDeviceTypeCategory({
                name_TR_UA:name_TR_UA,
                name_TR_EN:name_TR_EN,
                device_id:{connect:{id: ctx.request.prisma.device.id}}
            })
        }


    }

}