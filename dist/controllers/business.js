import { asyncWrapper } from "@/utils/asyncHandler";
import { prisma } from "../lib/prismaClient";
import { Role } from '../enums/Role';
import { BusinessCategory } from "@/enums/BusinessCategory";
import graphqlFields from 'graphql-fields';
import { buildPrismaQuery } from "@/helpers/prismaQuerybuilder";
const createBusiness = asyncWrapper(async (_, arg, context) => {
    const { user: { id, name, clerkId, email } } = context;
    const newBusiness = await prisma.business.create({
        data: {
            name: arg.name,
            category: arg.category,
            description: arg.description ?? null,
            address: arg.address ?? null,
            phone: arg.phone ?? null,
            websiteUrl: arg.websiteUrl ?? null,
            // business ko user se link kr dia
            users: {
                connect: { id },
            },
        },
    });
    // connecting user to business (here one business for one user only)
    await prisma.user.update({
        where: { id },
        data: {
            businessId: newBusiness.id,
        },
    });
    return newBusiness;
});
const updateBusiness = asyncWrapper(async (_, arg, context) => {
    const { id, name, category, description, address, phone, websiteUrl } = arg;
    const { user } = context;
    const dataToUpdate = {};
    if (name !== undefined)
        dataToUpdate.name = name;
    if (category !== undefined) {
        if (!Object.values(BusinessCategory).includes(category)) {
            throw new Error("Invalid business category.");
        }
        dataToUpdate.category = category;
    }
    if (description !== undefined)
        dataToUpdate.description = description;
    if (address !== undefined)
        dataToUpdate.address = address;
    if (phone !== undefined)
        dataToUpdate.phone = phone;
    if (websiteUrl !== undefined)
        dataToUpdate.websiteUrl = websiteUrl;
    const updatedBusiness = await prisma.business.update({
        where: { id },
        data: dataToUpdate,
    });
    return updatedBusiness;
});
const deleteBusiness = asyncWrapper(async (_, arg, context) => {
    const { id } = arg;
    const { user } = context;
    const business = await prisma.business.findFirst({
        where: {
            id,
            users: {
                some: { id: user.id }, // Check user is part of business
            },
        },
    });
    if (!business) {
        throw new Error("Unauthorized or business not found.");
    }
    const deletedBusiness = await prisma.business.delete({
        where: { id },
    });
    return deletedBusiness;
});
// required only when the a user has multiple businesses
const usersAllBusinesses = asyncWrapper(async (_, arg, context) => {
    if (context.user.role !== Role.ADMIN && context.user.role !== Role.BUSINESS_OWNER) {
        throw new Error("Unauthorized. Only admins and business owners can view businesses.");
    }
    const TargetUserId = (context.user.role === Role.ADMIN && arg.userId) ? arg.userId : context.user.id;
    const businesses = await prisma.business.findMany({
        where: {
            users: {
                some: {
                    id: TargetUserId,
                },
            },
        },
    });
    return businesses;
});
const getBusinessById = asyncWrapper(async (_, arg, context, info) => {
    const { id } = arg;
    const requestedFields = graphqlFields(info);
    const prismaQuerybuilder = await buildPrismaQuery(requestedFields);
    const business = await prisma.business.findUnique({
        where: { id },
        include: prismaQuerybuilder
    });
    return business;
});
const getBusinessByIdForAdmin = asyncWrapper(async (_, arg, context) => {
    const { id } = arg;
    const business = await prisma.business.findUnique({
        where: { id },
    });
    return business;
});
const getAllBusinesses = asyncWrapper(async (_, arg, context) => {
    const businessess = await prisma.business.findMany();
    return businessess;
});
// can be removed as we can get users from getBusinessById directly
const UsersAssociatedWithBusiness = asyncWrapper(async (_, arg, context) => {
    const { id } = arg;
    const business = await prisma.business.findUnique({
        where: { id },
        include: { users: true }
    });
    if (!business) {
        throw new Error("Business not found.");
    }
    return business.users;
});
const businessForPublic = asyncWrapper(async (_, arg, context, info) => {
    const requestedFields = graphqlFields(info);
    const prismaQuerybuilder = await buildPrismaQuery(requestedFields);
    const business = await prisma.business.findUnique({ where: { id: arg.id }, include: prismaQuerybuilder });
    return business;
});
export { getAllBusinesses, createBusiness, updateBusiness, deleteBusiness, usersAllBusinesses, getBusinessById, getBusinessByIdForAdmin, businessForPublic, UsersAssociatedWithBusiness };
