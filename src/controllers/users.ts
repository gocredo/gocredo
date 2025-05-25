import { asyncWrapper } from "@/utils/asyncHandler";
import { prisma } from "../lib/prismaClient"
import argon2 from "argon2"
import { Role } from "@/enums/Role";
import crypto from "crypto"
async function getAllUsers() {
    try {
        const users = await prisma.user.findMany();
        return users;
    } catch (error) {
        console.error("Error fetching users:", error);
        throw error;
    }
}

const user = asyncWrapper(async (_:any,arg:any, context: any) => {
    const { user } = context;
    return await prisma.user.findUnique({
        where:{
            clerkId:user.clerkId
        },
        include:{business:true},

    })})

const createUser = asyncWrapper(async (_: any, arg: any, context: any) => {

    const { clerkUser } = context;
    const existingUser = await prisma.user.findUnique({
        where: { clerkId: clerkUser.id },
    });

    if (existingUser) return existingUser;
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


})
const updateUser = asyncWrapper(async (parent: any, arg: { role?: Role, businessId?: string }, context: any) => {
    const { user: { id, name, email, clerkId } } = context
    const { role, businessId } = arg
    const dataToUpdate: any = {};
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
export {
    getAllUsers,
    user,
    createUser,
    updateUser
}