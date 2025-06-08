import {
    createProperty,
    updateProperty,
    deleteProperty,
    getProperty
} from '../../controllers/property';
import { protectClerkOnlyResolver } from '@/middlewares/protectClerkOnlyResolver';
import { protectResolver } from '@/middlewares/protectResolver';
import {Role} from '@prisma/client';

export const propertyResolvers = {
  Query: {
    property: protectClerkOnlyResolver(getProperty),
  },
  Mutation: {
    createProperty: protectResolver(createProperty,{ allowedRoles: [Role.ADMIN, Role.BUSINESS_OWNER, Role.STAFF] }),
    updateProperty: protectResolver(updateProperty,{ allowedRoles: [Role.ADMIN, Role.BUSINESS_OWNER] }),
    deleteProperty: protectResolver(deleteProperty,{ allowedRoles: [Role.ADMIN, Role.BUSINESS_OWNER] }),
  },
};

