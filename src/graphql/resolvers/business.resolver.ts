import {
  businessForPublic,
  createBusiness,
  deleteBusiness,
  getAllBusinesses,
  getBusinessById,
  getBusinessByIdForAdmin,
  updateBusiness
} from '@/controllers/business';
import { protectResolver } from '@/middlewares/protectResolver';
import { Role } from '@/enums/Role';

export const businessResolvers = {
  Query: {
    business: protectResolver(getBusinessById, { allowedRoles: [Role.ADMIN, Role.BUSINESS_OWNER] }),
    businesses: protectResolver(getAllBusinesses, { allowedRoles: [Role.ADMIN] }),
    businessForAdmin: protectResolver(getBusinessByIdForAdmin, { allowedRoles: [Role.ADMIN] }),
    businessForPublic:businessForPublic,
    
  },
  Mutation: {
    createBusiness: protectResolver(createBusiness, { allowedRoles: [Role.ADMIN, Role.BUSINESS_OWNER] }),
    updateBusiness: protectResolver(updateBusiness, { allowedRoles: [Role.ADMIN, Role.BUSINESS_OWNER] }),
    deleteBusiness: protectResolver(deleteBusiness, { allowedRoles: [Role.ADMIN, Role.BUSINESS_OWNER] }),
  },
};
