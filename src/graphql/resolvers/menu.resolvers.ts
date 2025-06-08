import { createMenu,
    updateMenu,
    deleteMenu,
    getMenuById, } from "@/controllers/menu";
import { protectClerkOnlyResolver } from "@/middlewares/protectClerkOnlyResolver";
import { protectResolver } from "@/middlewares/protectResolver";
import { Role } from "@prisma/client";

export const menuResolvers = {
  Query: {
    menu: protectClerkOnlyResolver(getMenuById),
  },
  Mutation: {
    createMenu: protectResolver(createMenu,{ allowedRoles: [Role.ADMIN, Role.BUSINESS_OWNER] }),
    updateMenu: protectResolver(updateMenu,{ allowedRoles: [Role.ADMIN, Role.BUSINESS_OWNER] }),
    deleteMenu: protectResolver(deleteMenu,{ allowedRoles: [Role.ADMIN, Role.BUSINESS_OWNER] }),
  },
};