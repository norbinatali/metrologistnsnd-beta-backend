import {Context, findTeamByName, getTeamId,getTeamMemberId, getUserId, updateUserResetToken} from "../../utils";
import { v4 as uuid } from 'uuid';
import * as jwt from 'jsonwebtoken'
const nodemailer = require("nodemailer");
export const teamMembers = {
    async createTeamMembers(parent, args, ctx: Context){
        console.log(args)
        if(args.emailMembers === ""){
            throw new Error('no new member provided');
        }
        const memberConfirmToken = uuid();
        const teamId= getTeamId(ctx);
        const member = await ctx.prisma.createTeamMembers({
            ...args, memberConfirmToken,
            memberConfirmed: false,
            team:{connect:{id:teamId}}
        });
        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: 'metrologistnsnd@gmail.com',
                pass: 'NataliBear3'
            }
        });

        transporter.sendMail({
                template: 'confirmEmail',
                from:"metrologistnsnd@gmail.com",
                to:member.emailMembers,
                subject: `Confirm your email in Team on Metrologist`,
                text: "Hi,\n" +
                    "You was added to the Team on Metrologist. Confirm your email:\n" +
                    "\n" +
                    'https://metrologistnsnd-beta-frontend.herokuapp.com/create-team?email='+member.emailMembers+'&emailConfirmToken='+memberConfirmToken+ '\n',

            },
            function (err, info, response) {
                console.log(member.emailMembers);
                if(err)
                    console.log(err);
                else
                    response.redirect('https://metrologistnsnd-beta-frontend.herokuapp.com/');
            });
        return {
            token: jwt.sign({ memberId: member.id }, "jwtsecret123"),
            member,
        }
    },
    async confirMemberEmail(parent: any, { memberConfirmToken, emailMembers }: { memberConfirmToken: string; emailMembers: string },
                       ctx: Context
    ) {

        if (!memberConfirmToken || !emailMembers) {
            throw new Error('no members email and token');
        }
        const member = await ctx.prisma.teamMembers({ emailMembers});
        if (!member) {
            throw new Error('no member found');
        }
        if (member.memberConfirmToken !== memberConfirmToken || member.emailMembers) {
            throw new Error('no right token or email');
        }

        await updateUserResetToken(
            ctx,
            member.emailMembers,
            {
                memberConfirmToken: '',
                memberConfirmed: true
            }
        );

        return {
            token: jwt.sign({ memberId: member.id }, "jwtsecret123"),
            member
        };
    },
    async deleteTeamMembers(parent, { id }, ctx: Context, info) {
        const teamId =getTeamMemberId(ctx)
        const teamMemberExists = await ctx.prisma.$exists.team({
            id,
            author: { id: teamId },
        });
        if (!teamMemberExists) {
            throw new Error(`Team member is not found or you're not the author`)
        }

        return ctx.prisma.deleteTeamMembers({ id })
    },
};

