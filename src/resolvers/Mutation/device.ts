import {getUserId, Context, getTRId} from '../../utils'

import {tr} from "./tr";
import {prisma} from "../../generated/prisma-client";



export const device = {
    createNewDevice: async function (parent, {name_UA, name_EN, name_RUS, module}, ctx: Context, info) {
        const userId = getUserId(ctx);

        return ctx.prisma.createDevice({
            name_UA: name_UA,
            name_EN: name_EN,
            name_RUS: name_RUS,
            module: module,
            tr:{connect: {id: ctx.request.prisma.tR.id}},
             dtc:{connect:{id:ctx.request.prisma.dTC.id}},
           
        })
    },

    async publishDevice(parent, { id }, ctx: Context, info) {
        const userId = getUserId(ctx);
   

        return ctx.prisma.updateDevice({
            where: { id },
            data: { published: true },
        })
    },

    async deleteDevice(parent, { id }, ctx: Context, info) {
        const userId = getUserId(ctx)
      

        return ctx.prisma.deleteDevice({ id })
    },


};
