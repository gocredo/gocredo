import { createAboutPage, deleteAboutPage, getAboutPage, updateAboutPage } from "@/controllers/aboutPage";
import { protectResolver } from "@/middlewares/protectResolver";
import { Role } from "@prisma/client";
export const aboutPageResolver = {
  Query: {
    getAboutPage: getAboutPage
  },

  Mutation: {
    createAboutPage: protectResolver(createAboutPage, { allowedRoles: [Role.ADMIN, Role.BUSINESS_OWNER] }),
    updateAboutPage: protectResolver(updateAboutPage, { allowedRoles: [Role.ADMIN, Role.BUSINESS_OWNER] }),
    deleteAboutPage: protectResolver(deleteAboutPage, { allowedRoles: [Role.ADMIN, Role.BUSINESS_OWNER] })
  }
}