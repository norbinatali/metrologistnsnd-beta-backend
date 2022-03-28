import {prisma} from './generated/prisma-client'
import resolvers from './resolvers'
import {ApolloServer} from 'apollo-server'
import {importSchema} from 'graphql-import'
import {ApolloServerPluginLandingPageGraphQLPlayground} from 'apollo-server-core';

require('dotenv').config();

const server = new ApolloServer({
    cors: {
        credentials: true,
        origin: ['https://metrologistnsnd-beta-frontend.herokuapp.com', 'http://localhost:3000/'],
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE'
    },
    introspection: true,
    typeDefs: importSchema('./src/schema.graphql'),
    resolvers,
    plugins: [
        ApolloServerPluginLandingPageGraphQLPlayground(),
    ],
    context: request => ({
        ...request,
        resolverValidationOptions: {requireResolversForResolveType: false,},
        prisma,
    }),
});


server.listen(process.env.PORT || 4000);
