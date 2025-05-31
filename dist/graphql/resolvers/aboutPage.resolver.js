import { createAboutPage, deleteAboutPage, getAboutPage, updateAboutPage } from "@/controllers/aboutPage";
import { protectResolver } from "@/middlewares/protectResolver";
import { withCache, withCacheInvalidation } from "@/utils/withCache";
import { Role } from "@prisma/client";
export const aboutPageResolver = {
    Query: {
        getAboutPage: withCache((_, { businessId }) => `getAboutPage:${businessId}`, getAboutPage)
    },
    Mutation: {
        createAboutPage: protectResolver(createAboutPage, { allowedRoles: [Role.ADMIN, Role.BUSINESS_OWNER] }),
        updateAboutPage: protectResolver(withCacheInvalidation((_, { businessId }) => [`getAboutPage:${businessId}`], updateAboutPage), { allowedRoles: [Role.ADMIN, Role.BUSINESS_OWNER] }),
        deleteAboutPage: protectResolver(withCacheInvalidation((_, { businessId }) => [`getAboutPage:${businessId}`], deleteAboutPage), { allowedRoles: [Role.ADMIN, Role.BUSINESS_OWNER] })
    }
};
