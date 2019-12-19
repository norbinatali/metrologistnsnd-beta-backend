import { getUserId, Context } from '../../utils'
import {device} from "./device";

export const dtc ={


    createNewDTC: async function (parent, {name_UA, name_EN}, ctx: Context, info) {

        return ctx.prisma.createDTC({
            name_UA:name_UA,
            name_EN:name_EN,
            device_id:{connect:{id: ctx.request.prisma.device.id}}
        })
    }
};