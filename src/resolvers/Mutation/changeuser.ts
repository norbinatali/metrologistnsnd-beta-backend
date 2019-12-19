import {Context,updateUser} from "../../utils";
import * as bcrypt from "bcryptjs";
import * as validator from 'validator';
import * as jwt from 'jsonwebtoken'
import {User} from "../../generated/prisma-client";
const nodemailer = require("nodemailer");
const path = require('path');
import { v4 as uuid } from 'uuid';
import {
    MissingDataError,
        ResetTokenExpiredError,
        InvalidEmailError,
        PasswordTooShortError,
        UserNotFoundError,
        InvalidInviteTokenError,
        UserEmailExistsError,
        UserInviteNotAcceptedError,
        UserDeletedError,
        InvalidOldPasswordError,
        InvalidEmailConfirmToken,
        UserEmailUnconfirmedError
} from '../../errors';



function validatePassword(ctx: Context, value: string) {
    if (value.length < 8) {
        throw new PasswordTooShortError();
    }
}
function generateToken(user: User, ctx: Context) {
    return jwt.sign({ userId: user.id }, "jwtsecret123");
}
function getHashedPassword(value: string) {
    return bcrypt.hash(value, 10);
}


export const changeuser= {

    async upgradeUser(_, {email, password, name}, ctx: Context) {
        const userUp = await ctx.prisma.user({email});
        if (!userUp) {
            throw new Error(`No such user found for email: ${email}`)
        } else {
            userUp.password = password;
            userUp.name = name;
            return userUp;
        }
    },


    async passwordReset(parent: any, {email, resetToken, password}: { email: string; resetToken: string; password: string },
                        ctx: Context) {
        if (!resetToken || !password) {
            throw new MissingDataError();
        }
        console.log(email);
        const user =  await ctx.prisma.user({email});
        console.log(user);
        if (user.resetToken !== resetToken) { throw new Error('anu poshov otsudogo')}
        if (!validator.isEmail(email)) {
            throw new InvalidEmailError();
        }
        validatePassword(ctx, password);
        const hashedPassword = await getHashedPassword(password);
        console.log(user.email);

        await updateUser(ctx, user.email, {resetToken: '',password: hashedPassword
        });
        return {
            email: user.email,
            password: user.password,
            name:user.name,
        };
    },
    async changePassword(parent: any, { oldpassword, newpassword, email }: { oldpassword: string; newpassword: string, email: string },
        ctx: Context
    ) {
        const user = await ctx.prisma.user({ email});

        const valid = await bcrypt.compare(oldpassword, user.password);
        if (!valid) {
            throw new InvalidOldPasswordError();
        }
        validatePassword(ctx, newpassword);
        const password = await getHashedPassword(newpassword);
        const newuser= await updateUser(ctx, user.email, {password});
      return {
          id:newuser.id,
           email: newuser.email,
          name:newuser.name,
          password:newuser.password
    }

    },

    async triggerPasswordReset(parent: any, {email}: { email: string }, ctx: Context) {
        if (!validator.isEmail(email)) {
            throw new InvalidEmailError();
        }

        const user = await ctx.prisma.user({ email});
        if (!user) {
            return {ok: true};
        }
        const resetToken = uuid();

        const now = new Date();
// Expires in two hours
        const resetExpires = new Date(now.getTime() + 7200000).toISOString();

        await updateUser(ctx, user.email, {resetToken, resetExpires});
        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: 'metrologistnsnd@gmail.com',
                pass: 'NataliBear3'
            }
        });

        transporter.sendMail({
            template: 'passwordReset',
            from:"metrologistnsnd@gmail.com",
           to:user.email,
            subject: `Confirm your password on Metrologist`,
            text: "Hi,\n" +
                "You requested a password reset on Metrologist.\n" +
                "\n" +
                  "http://metrologistnsnd-beta-backend.herokuapp.com/reset-password/"+resetToken + "\n"+ "Reset my password.",

        },
            function (err, info, response) {
console.log(user.email);
            if(err)
                console.log(err);
            else
                response.redirect('http://metrologistnsnd-beta-backend.herokuapp.com/reset-password/'+resetToken);
        });


        return {
            ok: true,
            resetToken:user.resetToken

        };

    }


};





