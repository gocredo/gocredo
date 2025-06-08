import {
  createInquiry,
  updateInquiry,
  deleteInquiry,
  getInquiry,
} from "@/controllers/inquiry";
import { Role } from "@prisma/client";
import { protectClerkOnlyResolver } from "@/middlewares/protectClerkOnlyResolver";
import { protectResolver } from "@/middlewares/protectResolver";

export const inquiryResolvers = {
  Query: {
    inquiry: protectResolver(getInquiry,{ allowedRoles: [Role.ADMIN, Role.BUSINESS_OWNER,Role.STAFF] }),
  },
  Mutation: {
    createInquiry: createInquiry,
    updateInquiry: protectResolver(updateInquiry,{ allowedRoles: [Role.ADMIN, Role.BUSINESS_OWNER,Role.STAFF] }),
    deleteInquiry: protectResolver(deleteInquiry,{ allowedRoles: [Role.ADMIN, Role.BUSINESS_OWNER,Role.STAFF] }),
  },
};

