import { mergeResolvers } from '@graphql-tools/merge';
import { userResolvers } from "./resolvers/user.resolver";
import { businessResolvers } from "./resolvers/business.resolver";
import { branchResolvers } from './resolvers/branch.resolver';
import { aboutPageResolver } from './resolvers/aboutPage.resolver';
import { customerResolvers } from './resolvers/Coustumer.resolvers';
import { blogResolvers } from './resolvers/blog.resolver';
import { reviewResolvers } from './resolvers/review.resolvers';
import { productResolvers } from './resolvers/product.resolvers';
import { menuResolvers } from './resolvers/menu.resolvers';
import { menuItemResolvers } from './resolvers/menuItem.resolver';
import { bookingResolvers } from './resolvers/booking.resolver';
import { inquiryResolvers } from './resolvers/inquiry.resolvers';
import { propertyResolvers } from './resolvers/property.resolvers';
import { orderResolvers } from './resolvers/orders.resolvers';

export const graphQLResolver = mergeResolvers([
  userResolvers,
  businessResolvers,
  branchResolvers,
  aboutPageResolver,
  customerResolvers,
  blogResolvers,
  reviewResolvers,
  productResolvers,
  menuResolvers,
  menuItemResolvers,
  bookingResolvers,
  inquiryResolvers,
  propertyResolvers,
  orderResolvers,
]);