import { GraphQLServer } from 'graphql-yoga'
import { prisma } from './generated/prisma-client'
import resolvers from './resolvers'
import {ApolloServer} from 'apollo-server'
import {importSchema} from 'graphql-import'

const server = new ApolloServer({
  typeDefs: importSchema('./src/schema.graphql'),
  resolvers:resolvers,
  context: request => ({
    ...request,
    resolverValidationOptions: { requireResolversForResolveType: false,},
    prisma,
  }),
});


server.listen({
  cors: {
    credentials: true,
    origin: ["https://metrologistnsnd-beta-frontend.herokuapp.com"],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',

  }
}).then(({ url }) => {console.log(`Server is running on http://localhost:4000`)});
