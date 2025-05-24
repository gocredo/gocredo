import { getAllUsers, createUser, updateUser } from '@/controllers/users';
import { protectClerkOnlyResolver } from '@/middlewares/protectClerkOnlyResolver';
import { protectResolver } from '@/middlewares/protectResolver';
import { Role } from '@prisma/client';

export const userResolvers = {
  Query: {
    users: protectResolver(getAllUsers,{allowedRoles:[Role.ADMIN]}),
  },
  Mutation: {
    createUser: protectClerkOnlyResolver(createUser),
    updateUser: protectResolver(updateUser),
  },
};
