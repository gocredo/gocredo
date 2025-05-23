import { branchUpdate, createBranch, deleteBranch, getAllBranchesOfBusiness, getBranchById } from '@/controllers/branch';
import { protectClerkOnlyResolver } from '@/middlewares/protectClerkOnlyResolver';
import { protectResolver } from '@/middlewares/protectResolver';

export const branchResolvers = {
  Query: {
    // getAllBranchesOfBusiness: protectResolver(getAllBranchesOfBusiness),
    // getBranchById: protectResolver(getBranchById)
  },
  Mutation: {
    createBranch: protectClerkOnlyResolver(createBranch),
    updateBranch: protectResolver(branchUpdate),
    deleteBranch: protectResolver(deleteBranch),
  },
};
