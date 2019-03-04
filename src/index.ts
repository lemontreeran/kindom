import { GraphQLServer } from 'graphql-yoga'
import { importSchema } from 'graphql-import'
import { Prisma } from './generated/prisma'
import { Context } from './utils'
import { Keypair } from '@kinecosystem/kin-sdk'

const resolvers = {
  Query: {
      // 
      // 'info' contains information about the execution state of the query
      user(_, { username }, context: Context, info) {
          return context.db.query.user(
              {
                  where: {
                      username
                  }
              },
              info
          )
      }
  },
  Mutation: {
      signup(_, { username }, context: Context, info) {
          const keypair = Keypair.random()

          const data = {
              username,
              kinAccount: keypair.publicKey(),
              kinSeed: secret
          }

          return context.db.mutation.createUser(
              { data },
              info
          )
      },
  },
}

const server = new GraphQLServer({
  typeDefs: './src/schema.graphql',
  resolvers,
  context: req => ({
    ...req,
    db: new Prisma({
      endpoint: 'https://us1.prisma.sh/public-gravelcloud-78/kingdom/dev', // the endpoint of the Prisma API
      debug: true, // log all GraphQL queries & mutations sent to the Prisma API
      // secret: 'mysecret123', // only needed if specified in `database/prisma.yml`
    }),
  }),
})
server.start(() => console.log('Server is running on http://localhost:4000'))
