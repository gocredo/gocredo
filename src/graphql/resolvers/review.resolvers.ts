import {createReview,
  getReviews,
  updateReview,
  deleteReview,
  getReviewsById} from "@/controllers/reviews";    
import { protectCustomerResolver } from "@/middlewares/protectCoustumer";

export const reviewResolvers = {
  Query: {
    review: protectCustomerResolver(getReviewsById),
    reviews: protectCustomerResolver(getReviews),
  },
  Mutation: {
    createReview: protectCustomerResolver(createReview),
    updateReview: protectCustomerResolver(updateReview),
    deleteReview: protectCustomerResolver(deleteReview),
  },
};