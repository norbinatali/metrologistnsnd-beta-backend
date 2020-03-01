import * as bcrypt from 'bcryptjs'
import * as jwt from 'jsonwebtoken'
import {Context, findUserByEmail, getUserId, updateUserResetToken} from '../../utils'
import { v4 as uuid } from 'uuid';
const nodemailer = require("nodemailer");
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



export const auth = {
  async signup(parent, args, ctx: Context) {
    if (args.password==="" ) {
      throw new Error('no password provided');
    }
    if (args.email==="") {
      throw new InvalidEmailError('no email provided');
    }
    if (args.name==="") {
      throw new Error('no name provided');
    }
    const userEmail=await ctx.prisma.$exists.user({email:args.email});
   
   if(userEmail){
      throw new Error("User already exists. Користувач вже існує")
    }
    const password = await bcrypt.hash(args.password, 18);
    const emailConfirmToken = uuid();
    const user = await ctx.prisma.createUser({ ...args,password, emailConfirmToken,
      emailConfirmed: false,
        joinedAt: new Date().toISOString()}
      );

    const transporter = nodemailer.createTransport({
      service: 'Gmail',
       host: "smtp.gmail.com",
       type: "SMTP",
       secure: false,
       port: 587,
      debug:true,
 
      auth: {
        user: 'metrologistnsnd@gmail.com',
        pass: 'NataliBear3'
      }
    });

    transporter.sendMail({
          template: 'confirmEmail',
          from:"metrologistnsnd@gmail.com",
          to:user.email,
          subject: `Confirm your email on Metrologist`,
          text: "Hi,\n" +
              "You sign up on Metrologist. Confirm your email:\n" +
              "\n" +
              'https://metrologistnsnd-beta-frontend.herokuapp.com/confirm-email?email='+user.email+'&emailConfirmToken='+emailConfirmToken+ '\n',

        },
        function (err, info, response) {
         console.log(user.email);
          console.log('Successful in sending email');
          console.dir({success: true, existing: false, sendError: false});
          console.dir(response);
          if(err)
            console.log(err);
          else
            response.redirect('https://metrologistnsnd-beta-frontend.herokuapp.com/');
        });

    return {
      token: jwt.sign({ userId: user.id }, process.env.APP_SECRET),
      user,
    }
  },
  async confirmEmail(parent: any, { emailConfirmToken, email }: { emailConfirmToken: string; email: string },
                     ctx: Context
  ) {
    if (!emailConfirmToken || !email) {
      throw new Error('no mail and token');
    }
    const user = await ctx.prisma.user({ email});
    if (!user) {
      throw new Error('no user found');
    }
    if (user.emailConfirmToken !== emailConfirmToken || user.emailConfirmed) {
      throw new Error('no right token or email');
    }

    await updateUserResetToken(
        ctx,
        user.email,
        {
          emailConfirmToken: '',
          emailConfirmed: true
        }
    );

    return {
      token: jwt.sign({ userId: user.id }, process.env.APP_SECRET),
      user
    };
  },

  async login(parent, {email, password }, ctx: Context) {
    if (email==="") {
      throw new MissingDataError();
    }
    if (password==="" ) {
      throw new MissingDataError();
    }
    const user = await ctx.prisma.user({ email});

    if (!user) {
      throw new InvalidEmailError()

    }
    const valid = await bcrypt.compare(password, user.password);

    if (!valid) {
      throw new Error('Invalid password')
    }
    if (
        user.emailConfirmed == false
    ) {
      throw new UserEmailUnconfirmedError('please confirm your email');
    }
    return {
      token: jwt.sign({ userId: user.id }, process.env.APP_SECRET),
      user,
    }
  },
};
