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
             deviceTypeCategory:{connect:{id:ctx.request.prisma.deviceTypeCategory.id}},
            author: {
                connect: {id: userId},
            },
        })
    },

    async publishDevice(parent, { id }, ctx: Context, info) {
        const userId = getUserId(ctx);
        const postExists = await ctx.prisma.$exists.device({
            id,
            author: { id: userId },
        });
        if (!postExists) {
            throw new Error(`Post not found or you're not the author`)
        }

        return ctx.prisma.updateDevice({
            where: { id },
            data: { published: true },
        })
    },

    async deleteDevice(parent, { id }, ctx: Context, info) {
        const userId = getUserId(ctx)
        const postExists = await ctx.prisma.$exists.device({
            id,
            author: { id: userId },
        });
        if (!postExists) {
            throw new Error(`Post not found or you're not the author`)
        }

        return ctx.prisma.deleteDevice({ id })
    },


};
