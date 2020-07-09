import {
    Context,
    findTeamId,
    findTeamMemberId,
    getUserId,
    updateTeamResetToken,
    updateUserResetToken
} from "../../utils";
import { v4 as uuid } from 'uuid';
import * as jwt from 'jsonwebtoken'
const nodemailer = require("nodemailer");

export const teamMembers = {
    async createTeamMembers(parent, {emailMember,teamId}, ctx: Context){

        if(emailMember === ""){
            throw new Error('no new member provided');
        }
        const userTeam=  await ctx.prisma.user({email:emailMember});
        if(!userTeam){
            throw new Error('User is not exist. Користувач не існує')
        }

        const memberConfirmToken = uuid();

        const teamID= await ctx.prisma.team({id:teamId});

        const member = await ctx.prisma.createTeamMembers({
            
            emailMembers:emailMember,
            member:"MEMBER1",
            memberConfirmToken,
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
                    "You was added to the Team on Metrologist. Confirm your email in :"+teamId.name+"\n" +
                    "\n" +
                    'https://metrologistnsnd-beta-frontend.herokuapp.com/create-team?emailMembers='+member.emailMembers+'&emailConfirmToken='+memberConfirmToken+ '\n',

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

        await updateTeamResetToken(
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
        const teamId =await ctx.prisma.team({id:id});
        const teamMemberExists = await ctx.prisma.$exists.teamMembers({
            id,
            team: teamId ,
        });
        if (!teamMemberExists) {
            throw new Error(`Team member is not found or you're not the author`)
        }

        return ctx.prisma.deleteTeamMembers({ id })
    },
};
