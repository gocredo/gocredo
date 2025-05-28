import { getBlog, createBlog, updateBlog, deleteBlog } from "@/controllers/blog";
import { protectResolver } from "@/middlewares/protectResolver";
import { Role } from "@prisma/client";

export const blogResolvers = {
  Query: {
    blog: protectResolver(getBlog, {
      allowedRoles: [Role.ADMIN, Role.BUSINESS_OWNER],
    }),
  },
  Mutation: {
    createBlog: protectResolver(createBlog, {
      allowedRoles: [Role.ADMIN, Role.BUSINESS_OWNER],
    }),
    updateBlog: protectResolver(updateBlog, {
      allowedRoles: [Role.ADMIN, Role.BUSINESS_OWNER],
    }),
    deleteBlog: protectResolver(deleteBlog, {
      allowedRoles: [Role.ADMIN, Role.BUSINESS_OWNER],
    }),
  },
};