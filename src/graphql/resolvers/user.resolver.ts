import { getAllUsers, createUser, updateUser } from '@/controllers/users';
import { protectClerkOnlyResolver } from '@/middlewares/protectClerkOnlyResolver';
import { protectResolver } from '@/middlewares/protectResolver';

export const userResolvers = {
  Query: {
    users: getAllUsers,
  },
  Mutation: {
    createUser: protectClerkOnlyResolver(createUser),
    updateUser: protectResolver(updateUser),
  },
};
