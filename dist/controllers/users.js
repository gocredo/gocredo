import { buildPrismaQuery } from "@/helpers/prismaQuerybuilder";
import { asyncWrapper } from "@/utils/asyncHandler";
import graphqlFields from "graphql-fields";
import { prisma } from "../lib/prismaClient";
async function getAllUsers() {
    try {
        const users = await prisma.user.findMany();
        return users;
    }
    catch (error) {
        console.error("Error fetching users:", error);
        throw error;
    }
}
const user = asyncWrapper(async (_, arg, context, info) => {
    const { user } = context;
    const relations = graphqlFields(info);
    const prismaQuery = await buildPrismaQuery(relations);
    return await prisma.user.findUnique({
        where: {
            clerkId: user.clerkId
        },
        include: prismaQuery,
    });
});
const createUser = asyncWrapper(async (_, arg, context) => {
    const { clerkUser } = context;
    const existingUser = await prisma.user.findUnique({
        where: { clerkId: clerkUser.id },
    });
    if (existingUser)
        return existingUser;
    const newUser = await prisma.user.create({
        data: {
            clerkId: clerkUser.id,
            email: clerkUser.email,
            name: `${clerkUser.fullName}`.trim(),
            role: arg.role || 'BUSINESS_OWNER',
            businessId: arg.businessId ?? null,
            websiteURLs: arg.websiteURLs ?? [],
        },
    });
    return newUser;
});
const updateUser = asyncWrapper(async (parent, arg, context) => {
    const { user: { id, name, email, clerkId } } = context;
    const { role, businessId } = arg;
    const dataToUpdate = {};
    if (role) {
        dataToUpdate.role = role;
    }
    if (name) {
        dataToUpdate.name = name;
    }
    if (businessId !== undefined) {
        dataToUpdate.businessId = businessId;
    }
    const updatedUser = await prisma.user.update({
        where: { clerkId },
        data: dataToUpdate,
    });
    return updatedUser;
});
export { createUser, getAllUsers, updateUser, user };
