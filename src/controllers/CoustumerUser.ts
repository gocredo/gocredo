import { asyncWrapper } from "@/utils/asyncHandler";
import { prisma } from "../lib/prismaClient"
import graphqlFields from 'graphql-fields';
import { buildPrismaQuery } from "@/helpers/prismaQuerybuilder";

//fetching all coustumers will be done in the business controller only 

type registerUserArgs = {
    name:string;
    email:string;
    phone:string;
    businessId:string;
}
const registerUser = asyncWrapper(async(_:any,args:registerUserArgs,context:any) => {
    const {name,email,phone,businessId}=args;
    const {clerkUser}=context;
    
    const userExists = await prisma.customerUser.findUnique({
        where: { clerkId:clerkUser.id },
    });
    if (userExists) {
        throw new Error("User already exists");
    }
    const newUser = await prisma.customerUser.create({
        data: {
            clerkId:clerkUser.id,
            name: name,
            email: email,
            phone: phone,
            businessId: businessId
        },
    });
    return newUser;
});

const getMyProfile = asyncWrapper(async(_:any,args:any,context:any,info:any) => {
    const requestedFields = graphqlFields(info);
    const prismaQuerybuilder = await buildPrismaQuery(requestedFields);
    const User=await prisma.customerUser.findUnique({
      where: { clerkId: context.user.clerkId },
      include:prismaQuerybuilder,
    });
    return User;
});

type UpdateProfileArgs = {
    name?: string;
    email?: string;
    phone?: string;
};

const updateProfile = asyncWrapper(async(_:any,args:UpdateProfileArgs,context:any) => {
    const {name,email,phone}=args;
    const dataToUpdate:any={};
    if(name!==undefined) dataToUpdate.name=name;
    if(email!==undefined) dataToUpdate.email=email;
    if(phone!==undefined) dataToUpdate.phone=phone;

    const updatedUser = await prisma.customerUser.update({
        where: { clerkId: context.user.clerkId },
        data: dataToUpdate,
    });
    return updatedUser;
});

const deleteProfile = asyncWrapper(async(_:any,args:any,context:any) => {
    const deletedUser = await prisma.customerUser.delete({
        where: { id:context.user.id },
    });
    if(deletedUser){
        return true;
    }
    return false;
});
 const getAllCustomerUsers = asyncWrapper(async(_:any,args:{businessId:string},context:any,info:any) => {
    const requestedFields = graphqlFields(info);
    const prismaQuerybuilder = await buildPrismaQuery(requestedFields);
    const Users=await prisma.customerUser.findMany({
      where: { businessId: args.businessId },
      include:prismaQuerybuilder,
    });
    return Users;
});

export{
    registerUser,
    getMyProfile,
    updateProfile,
    deleteProfile,
    getAllCustomerUsers
}
