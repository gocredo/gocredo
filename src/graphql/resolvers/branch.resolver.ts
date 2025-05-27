import { branchUpdate, createBranch, deleteBranch, getBranchById } from '@/controllers/branch';
import { protectResolver } from '@/middlewares/protectResolver';
import { withCache, withCacheInvalidation } from '@/utils/withCache';
import { Role } from '@prisma/client';
export const branchResolvers = {
  Query: {
    getBranch: protectResolver(withCache((_parent,{id},context)=>`getBranch:${id}`,getBranchById), { allowedRoles: [Role.ADMIN, Role.BUSINESS_OWNER, Role.STAFF] })
  },
  Mutation: {
    createBranch: protectResolver(createBranch, { allowedRoles: [Role.ADMIN, Role.BUSINESS_OWNER] }),
    updateBranch: protectResolver(withCacheInvalidation((_,{id},context)=>[`getBranch:${id}`],branchUpdate), { allowedRoles: [Role.ADMIN, Role.BUSINESS_OWNER] }),
    deleteBranch: protectResolver(withCacheInvalidation((_,{id},context)=>[`getBranch:${id}`],deleteBranch), { allowedRoles: [Role.ADMIN, Role.BUSINESS_OWNER] }),
  },
};
