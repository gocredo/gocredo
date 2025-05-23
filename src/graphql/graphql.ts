import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { graphQLSchema } from "@/graphql/schema";
import { graphQLResolver } from "@/graphql/resolvers";

export const connectGraphQL = async () => {
  const server = new ApolloServer({
    typeDefs: graphQLSchema,
    resolvers: graphQLResolver,
  });

  await server.start();

  return expressMiddleware(server, {
    context: async ({ req, res }) => {
      return { req, res };
    },
  });
};