import { getAllUsers, createUser, updateUser, user } from '@/controllers/users';
import { protectClerkOnlyResolver } from '@/middlewares/protectClerkOnlyResolver';
import { protectResolver } from '@/middlewares/protectResolver';
import { withCache, withCacheInvalidation } from '@/utils/withCache';
import { Role } from '@prisma/client';

export const userResolvers = {
  Query: {
    users: protectResolver(getAllUsers,{allowedRoles:[Role.ADMIN]}),
    user:protectResolver(withCache((_parent,_,context)=>`user:${context.user.clerkId}`,user),{allowedRoles:[Role.ADMIN,Role.BUSINESS_OWNER,Role.STAFF]})
  },
  Mutation: {
    createUser: protectClerkOnlyResolver(createUser),
    updateUser: protectResolver(withCacheInvalidation((_parent,_,context)=>[`user:${context.user.clerkId}`],updateUser)),
  },
};
