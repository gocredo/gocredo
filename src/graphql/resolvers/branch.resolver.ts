import { branchUpdate, createBranch, deleteBranch, getBranchById } from '@/controllers/branch';
import { protectResolver } from '@/middlewares/protectResolver';
import { Role } from '@prisma/client';
export const branchResolvers = {
  Query: {

    getBranch: protectResolver(getBranchById, { allowedRoles: [Role.ADMIN, Role.BUSINESS_OWNER, Role.STAFF] })
  },
  Mutation: {
    createBranch: protectResolver(createBranch, { allowedRoles: [Role.ADMIN, Role.BUSINESS_OWNER] }),
    updateBranch: protectResolver(branchUpdate, { allowedRoles: [Role.ADMIN, Role.BUSINESS_OWNER] }),
    deleteBranch: protectResolver(deleteBranch, { allowedRoles: [Role.ADMIN, Role.BUSINESS_OWNER] }),
  },
};
