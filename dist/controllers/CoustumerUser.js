import { asyncWrapper } from "@/utils/asyncHandler";
import { prisma } from "../lib/prismaClient";
import graphqlFields from 'graphql-fields';
import { buildPrismaQuery } from "@/helpers/prismaQuerybuilder";
const registerUser = asyncWrapper(async (_, args, context) => {
    const { name, email, phone, businessId } = args;
    const { clerkUser } = context;
    const userExists = await prisma.customerUser.findUnique({
        where: { clerkId: clerkUser.id },
    });
    if (userExists) {
        throw new Error("User already exists");
    }
    const newUser = await prisma.customerUser.create({
        data: {
            clerkId: clerkUser.id,
            name: `${clerkUser.fullName}`.trim(),
            email: clerkUser.email,
            phone,
            businessId
        },
    });
    return newUser;
});
const getMyProfile = asyncWrapper(async (_, args, context, info) => {
    const requestedFields = graphqlFields(info);
    const prismaQuerybuilder = await buildPrismaQuery(requestedFields);
    const User = await prisma.customerUser.findUnique({
        where: { clerkId: context.user.clerkId },
        include: prismaQuerybuilder,
    });
    return User;
});
const updateProfile = asyncWrapper(async (_, args, context) => {
    const { name, email, phone } = args;
    const dataToUpdate = {};
    if (name !== undefined)
        dataToUpdate.name = name;
    if (email !== undefined)
        dataToUpdate.email = email;
    if (phone !== undefined)
        dataToUpdate.phone = phone;
    const updatedUser = await prisma.customerUser.update({
        where: { clerkId: context.user.clerkId },
        data: dataToUpdate,
    });
    return updatedUser;
});
const deleteProfile = asyncWrapper(async (_, args, context) => {
    const deletedUser = await prisma.customerUser.delete({
        where: { id: context.user.id },
    });
    return deletedUser;
});
export { registerUser, getMyProfile, updateProfile, deleteProfile };
