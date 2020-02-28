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
  opt:{
    cors:{
      origin:{['https://metrologistnd-beta-frontend.herokuapp.com']}
    }
  }
})

server.start(() => console.log(`Server is running on http://localhost:4000`));
