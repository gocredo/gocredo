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
import { withCache, withCacheInvalidation } from '@/utils/withCache';

export const businessResolvers = {
  Query: {
    business: protectResolver(withCache((_parent,{id})=>`business:${id}`,getBusinessById), { allowedRoles: [Role.ADMIN, Role.BUSINESS_OWNER] }),
    businesses: protectResolver(getAllBusinesses, { allowedRoles: [Role.ADMIN] }),
    businessForAdmin: protectResolver(getBusinessByIdForAdmin, { allowedRoles: [Role.ADMIN] }),
    businessForPublic:withCache((_parent,{id})=>`businessForPublic:${id}`,businessForPublic),
    
  },
  Mutation: {
    createBusiness: protectResolver(createBusiness, { allowedRoles: [Role.ADMIN, Role.BUSINESS_OWNER] }),
    updateBusiness: protectResolver(withCacheInvalidation((_parent,{id})=>[`business:${id}`,`businessForPublic:${id}`],updateBusiness), { allowedRoles: [Role.ADMIN, Role.BUSINESS_OWNER] }),
    deleteBusiness: protectResolver(withCacheInvalidation((_parent,{id})=>[`business:${id}`,`businessForPublic:${id}`],deleteBusiness), { allowedRoles: [Role.ADMIN, Role.BUSINESS_OWNER] }),
  },
};
