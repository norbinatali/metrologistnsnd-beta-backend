import {prisma} from './generated/prisma-client'
import resolvers from './resolvers'
import {ApolloServer} from 'apollo-server'
import {importSchema} from 'graphql-import'



const server = new ApolloServer({
    cors: {
        credentials: true,
        origin: ['https://metrologistnsnd-beta-frontend.herokuapp.com'],
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE'
    },
    introspection: true,
    playground: true,
    typeDefs: importSchema('./src/schema.graphql'),
    resolvers,
    context: request => ({
        ...request,
        resolverValidationOptions: {requireResolversForResolveType: false,},
        prisma,

    }),
});


server.listen(process.env.PORT || 4000);
