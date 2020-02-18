import {getUserId, Context, getTRId} from '../../utils'

export const appointment={
    createNewAppointment(parent,{title, start_date, end_date, location, notes},ctx:Context){
        const userId=getUserId(ctx);
        return ctx.prisma.createAppointments({
            title:title,
            start_date:start_date,
            end_date:end_date,
            location:location,
            notes:notes,
            author:{connect:{id:userId}}

        })},
        async deleteAppointment(parent, { id }, ctx: Context, info) {
            const userId = getUserId(ctx);
            const appointmentExists = await ctx.prisma.$exists.appointments({
                id,
                author: { id: userId },
            });
            if (!appointmentExists) {
                throw new Error(`Appointment not found or you're not the author`)
            }

            return ctx.prisma.deleteAppointments({ id })
        },

    };
