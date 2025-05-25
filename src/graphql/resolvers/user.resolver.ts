import { getAllUsers, createUser, updateUser, user } from '@/controllers/users';
import { protectClerkOnlyResolver } from '@/middlewares/protectClerkOnlyResolver';
import { protectResolver } from '@/middlewares/protectResolver';
import { Role } from '@prisma/client';

export const userResolvers = {
  Query: {
    users: protectResolver(getAllUsers,{allowedRoles:[Role.ADMIN]}),
    user:protectResolver(user,{allowedRoles:[Role.ADMIN,Role.BUSINESS_OWNER,Role.STAFF]})
  },
  Mutation: {
    createUser: protectClerkOnlyResolver(createUser),
    updateUser: protectResolver(updateUser),
  },
};
