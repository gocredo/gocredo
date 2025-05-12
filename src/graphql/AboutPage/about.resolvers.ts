import { ApolloServer } from "@apollo/server";
export const resolvers = {
  Query: {
    getAboutPage:async(parent: any, args: { businessId: string }, context: any) => {
    }
  }
}