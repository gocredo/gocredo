import {createReview,
  getReviews,
  updateReview,
  deleteReview,
  getReviewsById} from "@/controllers/reviews";    
import { protectCustomerResolver } from "@/middlewares/protectCoustumer";
import { protectResolver } from "@/middlewares/protectResolver";
import {Role} from "@prisma/client"

export const reviewResolvers = {
  Query: {
    review: protectResolver(getReviewsById,{ allowedRoles: [Role.ADMIN, Role.BUSINESS_OWNER] }),
    reviews: protectResolver(getReviews,{ allowedRoles: [Role.ADMIN, Role.BUSINESS_OWNER] }),
  },
  Mutation: {
    createReview: protectCustomerResolver(createReview),
    updateReview: protectCustomerResolver(updateReview),
    deleteReview: protectCustomerResolver(deleteReview),
  },
};