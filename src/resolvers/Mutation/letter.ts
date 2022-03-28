import {Context} from "../../utils";

export const letter = {
    createNewLetter: async function (parent, {from, subject, text}, ctx: Context, info) {
        return ctx.prisma.createLetterEmail({
            from: from,
            subject: subject,
            text: text
        })
    }
};
