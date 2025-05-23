import {
  getAllBusinesses,
  createBusiness,
  updateBusiness,
  deleteBusiness,
  usersAllBusinesses,
  getBusinessById,
  getBusinessByIdForAdmin,
  UsersAssociatedWithBusiness,
} from '@/controllers/business';
import { protectClerkOnlyResolver } from '@/middlewares/protectClerkOnlyResolver';
import { protectResolver } from '@/middlewares/protectResolver';

export const businessResolvers = {
  Query: {
    //getAllBusinesses,
    // getBusinessById,
    // getBusinessByIdForAdmin: protectResolver(getBusinessByIdForAdmin),
    // usersAllBusinesses: protectResolver(usersAllBusinesses),
    // usersAssociatedWithBusiness: protectResolver(UsersAssociatedWithBusiness),
  },
  Mutation: {
    createBusiness: protectClerkOnlyResolver(createBusiness),
    updateBusiness: protectResolver(updateBusiness),
    deleteBusiness: protectResolver(deleteBusiness),
  },
};
