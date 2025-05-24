import { asyncWrapper } from "@/utils/asyncHandler";
import { prisma } from "../lib/prismaClient"
import { Role } from '../enums/Role';
import { BusinessCategory } from "@/enums/BusinessCategory";

async function getAllBusinesses() {
    try {
        const businesses = await prisma.business.findMany();
        return businesses;
    } catch (error) {
        console.error("Error fetching businesses:", error);
        throw error;
    }
}

const createBusiness = asyncWrapper(async (_: any, arg: {
  name: string;
  category: BusinessCategory;
  description?: string;
  address?: string;
  phone?: string;
  websiteUrl?: string;
}, context: any) => {
  const existingUser = await prisma.user.findUnique({
    where: { clerkId: context.clerkUser.id },
  });

  if (!existingUser) {
    throw new Error("User must be registered before creating a business.");
  }
  if( existingUser.role !== Role.ADMIN && existingUser.role !== Role.BUSINESS_OWNER) {
    throw new Error("Unauthorized. Only admins and business owners can create businesses.");
  }
  if (!Object.values(BusinessCategory).includes(arg.category)) {
    throw new Error("Invalid business category.");
  }
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
        connect: { id: existingUser.id },
      },
    },
  });

  return newBusiness;
});

type UpdateBusinessArgs = {
  id: string;
  name?: string;
  category?: BusinessCategory;
  description?: string;
  address?: string;
  phone?: string;
  websiteUrl?: string;
};

const updateBusiness = asyncWrapper(
  async (_: any, arg: UpdateBusinessArgs, context: any) => {
    const { id, name, category, description, address, phone, websiteUrl } = arg;

    if(context.user.role !== Role.ADMIN && context.user.role !== Role.BUSINESS_OWNER) {
      throw new Error("Unauthorized. Only admins and business owners can update businesses.");
    }
    const dataToUpdate: any = {};

    if (name !== undefined) dataToUpdate.name = name;
    if (category !== undefined) {
      if (!Object.values(BusinessCategory).includes(category)) {
        throw new Error("Invalid business category.");
      }
      dataToUpdate.category = category;
    }
    if (description !== undefined) dataToUpdate.description = description;
    if (address !== undefined) dataToUpdate.address = address;
    if (phone !== undefined) dataToUpdate.phone = phone;
    if (websiteUrl !== undefined) dataToUpdate.websiteUrl = websiteUrl;

    const updatedBusiness = await prisma.business.update({
      where: { id },
      data: dataToUpdate,
    });

    return updatedBusiness;
  }
);

const deleteBusiness = asyncWrapper(
  async (_: any, arg: { id: string }, context: any) => {
    const { id } = arg;

    if(context.user.role !== Role.ADMIN && context.user.role !== Role.BUSINESS_OWNER) {
      throw new Error("Unauthorized. Only admins and business owners can delete businesses.");
    }
    const deletedBusiness = await prisma.business.delete({
      where: { id },
    });

    return deletedBusiness;
  }
);

const usersAllBusinesses = asyncWrapper(
  async (_: any, arg:any, context: any) => {

    if(context.user.role !== Role.ADMIN && context.user.role !== Role.BUSINESS_OWNER) {
      throw new Error("Unauthorized. Only admins and business owners can view businesses.");
    }
    const businesses = await prisma.business.findMany({
      where: {
        users: {
          some: {
            id: context.user.id,
          },
        },
      },
    });
    return businesses;
  });

const getBusinessById = asyncWrapper(
  async (_: any, arg: { id: string }) => {
    const { id } = arg;
    const business = await prisma.business.findUnique({
      where: { id },
    });
    return business;
  });

  const getBusinessByIdForAdmin = asyncWrapper(
    async (_: any, arg: { id: string }, context: any) => {
      const { id } = arg;
      
      if(context.user.role !== Role.ADMIN) {
        throw new Error("Unauthorized. Only admins can view businesses.");
      }
      const business = await prisma.business.findUnique({
        where: { id },
      });
  
      return business;
    });

    const UsersAssociatedWithBusiness = asyncWrapper(
      async (_: any, arg: { id: string }, context: any) => {
        const { id } = arg;

        if(context.user.role !== Role.ADMIN && context.user.role !== Role.BUSINESS_OWNER) {
          throw new Error("Unauthorized. Only admins and business owners can view businesses.");
        }
        const business = await prisma.business.findUnique({
          where: { id },
        });
        if(!business) {
          throw new Error("Business not found.");
        }
        const users = await prisma.user.findMany({
          where: {
            businesses: {
              some: {
                id: business.id,
              },
            },
          },
        });
        return users;
      }
    );

export {
    getAllBusinesses,
    createBusiness,
    updateBusiness,
    deleteBusiness,
    usersAllBusinesses,
    getBusinessById,
    getBusinessByIdForAdmin,
    UsersAssociatedWithBusiness
}