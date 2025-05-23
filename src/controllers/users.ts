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

const createUser = asyncWrapper(async (_: any, arg: any,context:any) => {
    return {
    id: "123",
    clerkId: context?.clerkUser?.id || "dummy-clerk-id",
    email: context?.clerkUser?.email || "dummy@example.com",
    name: `${context?.clerkUser?.firstName ?? "John"} ${context?.clerkUser?.lastName ?? "Doe"}`.trim(),
    role: arg.role || "BUSINESS_OWNER",
    businessId: arg.businessId ?? null,
    websiteURLs: arg.websiteURLs ?? [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
    const { clerkUser } = context;
    const existingUser = await prisma.user.findUnique({
    where: { clerkId: clerkUser.id },
  });

  if (existingUser) return existingUser;
  const newUser = await prisma.user.create({
    data: {
      clerkId: clerkUser.id,
      email: clerkUser.email,
      name: `${clerkUser.firstName ?? ""} ${clerkUser.lastName ?? ""}`.trim(),
      role: arg.role || 'BUSINESS_OWNER',
      businessId: arg.businessId ?? null,
      websiteURLs: arg.websiteURLs ?? [],
    },
  });
    
    return newUser;

    
})
const updateUser = asyncWrapper(async (parent: any, arg: { email: string, password?: string, role?: Role, name?: string, businessId?: string }) => {
    const { email, password, role, name, businessId } = arg;
    const dataToUpdate: any = {};

    if (password) {
        dataToUpdate.password = await argon2.hash(password);
    }
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
        where: { email },
        data: dataToUpdate,
    });

    return updatedUser;
});
export {
    getAllUsers,
    createUser,
    updateUser
}