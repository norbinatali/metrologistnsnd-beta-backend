import {prisma} from './generated/prisma-client'
import resolvers from './resolvers'
import { ApolloServer } from 'apollo-server-express';
import {importSchema} from 'graphql-import'
import {ApolloServerPluginLandingPageGraphQLPlayground, ApolloServerPluginDrainHttpServer} from 'apollo-server-core';
import * as express from 'express';
import * as http from 'http';

require('dotenv').config();

async function startApolloServer() {
    const app = express();

    const httpServer = http.createServer(app);

    // CORS configuration
    const corsOptions = {
        origin: ['http://localhost:3000'],
        credentials: true
    }

    const server = new ApolloServer({
        typeDefs: importSchema('./src/schema.graphql'),
        resolvers,
        introspection: true,
        context: request => ({
            ...request,
            resolverValidationOptions: {requireResolversForResolveType: false,},
            prisma,
        }),
        plugins: [
            ApolloServerPluginLandingPageGraphQLPlayground(),
            ApolloServerPluginDrainHttpServer({ httpServer })
        ],
    });

    await server.start();

    server.applyMiddleware({ app, cors: corsOptions });

    const PORT = process.env.PORT || 4000;

    await new Promise<void>(resolve => httpServer.listen({ port: PORT }, resolve));
    //console.log(`🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`);
}

startApolloServer();
