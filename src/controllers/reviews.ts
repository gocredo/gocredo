import { asyncWrapper } from "@/utils/asyncHandler";
import { prisma } from "../lib/prismaClient"
import graphqlFields from 'graphql-fields';
import { buildPrismaQuery } from "@/helpers/prismaQuerybuilder";
import { Role } from "@prisma/client";
import { withCache } from "@/utils/withCache";
import { withCacheInvalidation } from "@/utils/withCache";

const reviewCacheKeyBuilder = (_: any, __: any, context: any) => {
  return [`reviews:user:${context.user.id}:*`]; // Invalidate all queries related to this user's reviews
};

const getReviewCacheKeyBuilder = (_: any, args: { id: string }, context: any) => {
  return `review:user:${context.user.id}:id:${args.id}`;
};




const createReview = asyncWrapper(async (_: any, arg: 
    { businessId: string,
      rating: number, 
      comment?: string,
      customerUserId: string
    }, context: any) => {
    const { user } = context;

    const newReview = await prisma.review.create({
      data: {
        businessId: arg.businessId,
        customerUserId: arg.customerUserId ?? user.id, // Use the provided customerUserId or the logged-in user's id
        rating: arg.rating,
        comment: arg.comment ?? null,
      },
    });

    return newReview;
  });


const getReviews = withCache(
  // Key Builder
  getReviewCacheKeyBuilder,
  asyncWrapper(async (_: any, arg:{businessId:string}, context: any, info: any) => {
    const { user } = context;
    const fields = graphqlFields(info);
    const query = await buildPrismaQuery(fields);
    if(user.role !== Role.BUSINESS_OWNER && user.role !== Role.ADMIN) {
      throw new Error('Unauthorized: Only business owners or admins can view reviews');
    }
    const reviews = await prisma.review.findMany({
      where: { businessId: arg.businessId },
      include: query,
    });
    return reviews;
  })
);

const updateReview = withCacheInvalidation(
  reviewCacheKeyBuilder,
  asyncWrapper(async (_: any, args:{id:string,rating:number,comment:string}, context: any) => {
    const { user } = context;
    const { id, rating, comment } = args;

    const updatedReview = await prisma.review.update({
      where: {
        id,
        customerUserId: user.id,
      },
      data: {
        rating,
        comment: comment ?? null,
      },
    });

    return updatedReview;
  })
);


const deleteReview = withCacheInvalidation(
  reviewCacheKeyBuilder,
  asyncWrapper(async (_: any, args:{id:string}, context: any) => {
    const { user } = context;
    const { id } = args;

    const deletedReview = await prisma.review.delete({
      where: {
        id,
        customerUserId: user.id,
      },
    });

    return deletedReview;
  })
);

const getReviewsById = withCache(
  getReviewCacheKeyBuilder,
  asyncWrapper(async (_: any, args: { id: string }, context: any, info: any) => {
    const { user } = context;
    const { id } = args;
    const fields = graphqlFields(info);
    const query = await buildPrismaQuery(fields);

    const review = await prisma.review.findUnique({
      where: {
        id,
        customerUserId: user.id,
      },
      include: query,
    });

    return review;
  })
);

export {
  createReview,
  getReviews,
  updateReview,
  deleteReview,
  getReviewsById,
};