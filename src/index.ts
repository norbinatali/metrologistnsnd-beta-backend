import { GraphQLServer } from 'graphql-yoga'
import { prisma } from './generated/prisma-client'
import resolvers from './resolvers'

const server = new GraphQLServer({
  typeDefs: './src/schema.graphql',
  resolvers,
  context: request => ({
    ...request,
    resolverValidationOptions: { requireResolversForResolveType: false,},
    prisma,
  }),
  
  
})

server.start({cors: {
      credentials: true,
      origin: ["https://metrologistnsnd-beta-frontend.herokuapp.com"],
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
      
    }},() => console.log(`Server is running on http://localhost:4000`));
