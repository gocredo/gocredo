import { ApolloServer} from "@apollo/server";
  export const typeDefs = `#graphql
    type AboutPage {
        id: ID!
        businessId: ID!
        description: String!
        mission: String!
        vision: String!
        createdAt: String!
        updatedAt: String!
    }

    type Query {
      getAboutPage(businessId: ID!): AboutPage
    }

    type Mutation {
    updateAboutPage(
      businessId: ID!
      description: String
      mission: String
      vision: String
    ): AboutPage
  }
`;