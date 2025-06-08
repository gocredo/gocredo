import { createMenuItem,
  updateMenuItem,
  deleteMenuItem,
  getMenuItem, } from "@/controllers/menuItem";
import { protectClerkOnlyResolver } from "@/middlewares/protectClerkOnlyResolver";
import { protectResolver } from "@/middlewares/protectResolver";
import { Role } from "@prisma/client";

export const menuItemResolvers = {
  Query: {
    menuItem: protectClerkOnlyResolver(getMenuItem),
  },
  Mutation: {
    createMenuItem: protectResolver(createMenuItem,{ allowedRoles: [Role.ADMIN, Role.BUSINESS_OWNER] }),
    updateMenuItem: protectResolver(updateMenuItem,{ allowedRoles: [Role.ADMIN, Role.BUSINESS_OWNER] }),
    deleteMenuItem: protectResolver(deleteMenuItem,{ allowedRoles: [Role.ADMIN, Role.BUSINESS_OWNER] }),
  },
};

