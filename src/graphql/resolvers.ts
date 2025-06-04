import { mergeResolvers } from '@graphql-tools/merge';
import { userResolvers } from "./resolvers/user.resolver";
import { businessResolvers } from "./resolvers/business.resolver";
import { branchResolvers } from './resolvers/branch.resolver';
import { aboutPageResolver } from './resolvers/aboutPage.resolver';
import { customerResolvers } from './resolvers/Coustumer.resolvers';
import { blogResolvers } from './resolvers/blog.resolver';
import { reviewResolvers } from './resolvers/review.resolvers';
import { productResolvers } from './resolvers/product.resolvers';

export const graphQLResolver = mergeResolvers([
  userResolvers,
  businessResolvers,
  branchResolvers,
  aboutPageResolver,
  customerResolvers,
  blogResolvers,
  reviewResolvers,
  productResolvers,
]);