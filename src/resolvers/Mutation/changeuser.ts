import {Context, updateUser} from "../../utils";
import * as bcrypt from "bcryptjs";
import * as validator from 'validator';
import * as jwt from 'jsonwebtoken'
import {User} from "../../generated/prisma-client";

const nodemailer = require("nodemailer");
import {v4 as uuid} from 'uuid';
import {
    MissingDataError,
    InvalidEmailError,
    PasswordTooShortError,
    InvalidOldPasswordError,
} from '../../errors';

function validatePassword(ctx: Context, value: string) {
    if (value.length < 8) {
        throw new PasswordTooShortError();
    }
}

function generateToken(user: User, ctx: Context) {
    return jwt.sign({userId: user.id}, "jwtsecret123");
}

function getHashedPassword(value: string) {
    return bcrypt.hash(value, 10);
}


export const changeuser = {

    async upgradeUser(_, {email, name, companyName, country}, ctx: Context) {
        const userUp = await ctx.prisma.user({email});
        if (!userUp) {
            throw new Error(`No such user found for email: ${email}`)
        } else {
            userUp.name = name;
            userUp.companyName = companyName;
            userUp.country = country;
            return userUp;
        }
    },

    async passwordReset(parent: any, {
                            email,
                            resetToken,
                            password
                        }: { email: string; resetToken: string; password: string },
                        ctx: Context) {
        if (!resetToken || !password) {
            throw new MissingDataError();
        }

        const user = await ctx.prisma.user({email});
        if (user.resetToken !== resetToken) {
            throw new Error('anu poshov otsudogo')
        }
        if (!validator.isEmail(email)) {
            throw new InvalidEmailError();
        }
        validatePassword(ctx, password);
        const hashedPassword = await getHashedPassword(password);
        await updateUser(ctx, user.email, {
            resetToken: '', password: hashedPassword
        });
        return {
            email: user.email,
            password: user.password,
            name: user.name,
        };
    },
    async changePassword(parent: any, {
                             oldpassword,
                             newpassword,
                             email
                         }: { oldpassword: string; newpassword: string, email: string },
                         ctx: Context
    ) {
        const user = await ctx.prisma.user({email});

        const valid = await bcrypt.compare(oldpassword, user.password);
        if (!valid) {
            throw new InvalidOldPasswordError();
        }
        validatePassword(ctx, newpassword);
        const password = await getHashedPassword(newpassword);
        const newuser = await updateUser(ctx, user.email, {password});
        return {
            id: newuser.id,
            email: newuser.email,
            name: newuser.name,
            password: newuser.password
        }
    },

    async triggerPasswordReset(parent: any, {email}: { email: string }, ctx: Context) {
        if (!validator.isEmail(email)) {
            throw new InvalidEmailError();
        }

        const user = await ctx.prisma.user({email});
        if (!user) {
            return {ok: true};
        }
        const resetToken = uuid();

        const now = new Date();

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
                from: "metrologistnsnd@gmail.com",
                to: user.email,
                subject: `Confirm your password on Metrologist`,
                text: "Hi,\n" +
                    "You requested a password reset on Metrologist.\n" +
                    "\n" +
                    "https://metrologistnsnd-beta-frontend.herokuapp.com/reset-password?email=" + user.email + "&resetToken=" + resetToken + "\n" + "Reset my password.",

            },
            function (err, info, response) {
                if (err)
                    console.log(err);
                else
                    response.redirect('https://metrologistnsnd-beta-frontend.herokuapp.com/reset-password?email="+user.email+"&resetToken="+resetToken');
            });
        return {
            ok: true,
            resetToken: user.resetToken
        };
    }
};





