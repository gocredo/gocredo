import { getBlog, createBlog, updateBlog, deleteBlog } from "@/controllers/blog";
import { protectResolver } from "@/middlewares/protectResolver";
import { withCache, withCacheInvalidation } from "@/utils/withCache";
import { Role } from "@prisma/client";
export const blogResolvers = {
    Query: {
        blog: withCache((_, { id }) => `blog:${id}`, getBlog),
    },
    Mutation: {
        createBlog: protectResolver(createBlog, {
            allowedRoles: [Role.ADMIN, Role.BUSINESS_OWNER],
        }),
        updateBlog: protectResolver(withCacheInvalidation((_, { id }) => [`blog:${id}`], updateBlog), {
            allowedRoles: [Role.ADMIN, Role.BUSINESS_OWNER],
        }),
        deleteBlog: protectResolver(withCacheInvalidation((_, { id }) => [`blog:${id}`], deleteBlog), {
            allowedRoles: [Role.ADMIN, Role.BUSINESS_OWNER],
        }),
    },
};
