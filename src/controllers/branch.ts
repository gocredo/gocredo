import { asyncWrapper } from "@/utils/asyncHandler";
import { prisma } from "../lib/prismaClient"
import { Role } from '../enums/Role';

//can be done from businessById
// const getAllBranchesOfBusiness = asyncWrapper(async (arg: { id: string }) => {
//     const { id } = arg;
//     const business = await prisma.business.findUnique({
//         where: { id },
//         include:{branches:true}
//     });
//     if (!business) {
//         throw new Error("Business not found");
//     }
//     return business.branches
// });

const createBranch = asyncWrapper(async (_: any, arg: {
    name: string,
    address: string,
    city: string,
    state: string,
    pincode: string,
    phone?: string,
    businessId: string
}, context: any) => {
    const { user } = context
    if (!user.businessId) {
        throw new Error("User is not associated with any business");
    }
    if (user.businessId !== arg.businessId) {
        throw new Error("User is not authorized to create branch for this business");
    }
    const branch = await prisma.branch.create({
        data: {
            name: arg.name,
            address: arg.address,
            city: arg.city,
            state: arg.state,
            pincode: arg.pincode,
            phone: arg.phone ?? null,
            businessId: arg.businessId
        }
    })
    return branch;
});

type UpdateBranchArgs = {
    id: string,
    name?: string,
    address?: string,
    city?: string,
    state?: string,
    pincode?: string,
    phone?: string
}
const branchUpdate = asyncWrapper(async (_: any, arg: UpdateBranchArgs, context: any) => {
    const { user } = context;
    const { id, name, address, city, state, pincode, phone } = arg;

    const branch = await prisma.branch.findUnique({
        where: { id }
    });
    if (!branch) {
        throw new Error("Branch not found");
    }
    if (branch.businessId !== user.businessId) {
        throw new Error("User is not authorized to update this branch");
    }
    const updatedBranch = await prisma.branch.update({
        where: { id },
        data: {
            name,
            address,
            city,
            state,
            pincode,
            phone
        }
    })
    return updatedBranch;
});

const deleteBranch = asyncWrapper(async (_: any, arg: { id: string }, context: any) => {
    const { user } = context;
    const { id } = arg;
    if (!user.businessId) throw new Error("user not associated with any business")
    const branch = await prisma.branch.findUnique({
        where: { id}
    });
    if (!branch) {
        throw new Error("Branch not found");
    }
    if (branch.businessId !== user.businessId) {
        throw new Error("User is not authorized to delete this branch");
    }
    const deletedBranch = await prisma.branch.delete({
        where: { id }
    })
    return deletedBranch;
});

const getBranchById = asyncWrapper(async (_: any, arg: { id: string }, context: any) => {
    const branch = await prisma.branch.findUnique({
        where: { id: arg.id },
        include:{
            appointment:true,
            business:true
        }
    });
    if (!branch) {
        throw new Error("Branch not found");
    }
    return branch;
});

export {
    createBranch,
    branchUpdate,
    deleteBranch,
    getBranchById
}