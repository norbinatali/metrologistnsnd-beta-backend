import { v4 } from "uuid";
import {Context} from "./utils";
import * as Email from 'email-templates';
import {User} from "./generated/prisma-client";

import {doc} from "prettier";


export interface IGraphqlAuthenticationConfig {
    mailer?: Email;
    mailAppUrl?: string;
    secret: string;
    requiredConfirmedEmailForLogin?: boolean;
    hookInviteUserPostCreate?: (
        data: any,
        ctx: Context,
        user: User
    ) => Promise<any>;
    validatePassword?: (value: string) => boolean;
}

export function graphqlAuthenticationConfig(
    options: IGraphqlAuthenticationConfig
) {
    const defaults = {
        requiredConfirmedEmailForLogin: false,
        validatePassword: value => value.length >= 8
    };


    return Object.assign(defaults, options);
}
