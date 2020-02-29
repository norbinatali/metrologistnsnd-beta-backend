import { getUserId, Context } from '../utils'

export const Query = {
  feed(parent, args, ctx: Context) {
    return ctx.prisma.posts({ where: { published: true } })
  },

  drafts(parent, args, ctx: Context) {
    const id = getUserId(ctx);

    const where = {
      published: false,
      author: {
        id,
      },
    };

    return ctx.prisma.posts({ where })
  },

 async post(parent, { id }, ctx: Context) {
    const userId = getUserId(ctx);
    const requestingUserIsAuthor = await ctx.prisma.$exists.post({
      id,
      author: {
        id: userId,
      },
    });
    const requestingUserIsAdmin = await ctx.prisma.$exists.user({
      id: userId,
      role: 'ADMIN',
    });

    if (requestingUserIsAdmin || requestingUserIsAuthor) {
      return ctx.prisma.post({ id } )
    }
    throw new Error(
        'Invalid permissions, you must be an admin or the author of this post to retrieve it.',
    )

  },

  me(parent, args, ctx) {
    const id = getUserId(ctx);
    return ctx.prisma.user({ id })
  },
  allDevice(parent, args, ctx: Context) {
    return ctx.prisma.devices({ where: { published: true } })
  },
 dtcs(parent, args, ctx: Context) {
    return ctx.prisma.dTCs()
  },
  dtcL(parent, {id}, ctx: Context) {
    return ctx.prisma.dTCs({where:{id}})
  },
  dtc(parent,{id},ctx:Context){
    return ctx.prisma.dTC({id})
  },


  newDevice(parent, args, ctx: Context) {
    const id = getUserId(ctx);

    const where = {
      published: false,
      author: {
        id,
      },
    };

    return ctx.prisma.devices({ where })
  },

  device(parent, { id }, ctx: Context) {
    return ctx.prisma.device({ id })
  },
   async myDevice(parent, { id }, ctx: Context){
        const userId = getUserId(ctx);
        const requestingUserIsAuthor = await ctx.prisma.$exists.myDevice({
            id,
            author: {
                id: userId,
            },
        });
        const requestingUserIsAdmin = await ctx.prisma.$exists.user({
            id: userId,
            role: 'CUSTOMER',
        });

        if (requestingUserIsAdmin || requestingUserIsAuthor) {

            if(ctx.prisma.myDevices({where:{id}})){

            }
            return ctx.prisma.myDevice({ id } )
        }
        throw new Error(
            'Invalid permissions, you must be an admin or the author of this post to retrieve it.',
        )


    }
};
