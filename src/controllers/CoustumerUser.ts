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
    const {clerkId}=context;
    if(!clerkId){
        throw new Error("Unauthorized");
    }
    const userExists = await prisma.CustomerUser.findUnique({
        where: { clerkId },
    });
    if (userExists) {
        throw new Error("User already exists");
    }
    const newUser = await prisma.CustomerUser.create({
        data: {
            clerkId,
            name,
            email,
            phone,
            businessId
        },
    });
    return newUser;
});

const getMyProfile = asyncWrapper(async(_:any,args:any,context:any,info:any) => {
    const requestedFields = graphqlFields(info);
    const prismaQuerybuilder = await buildPrismaQuery(requestedFields);
    const User=await prisma.CustomerUser.findUnique({
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

    const updatedUser = await prisma.CustomerUser.update({
        where: { clerkId: context.user.clerkId },
        data: dataToUpdate,
    });
    return updatedUser;
});

const deleteProfile = asyncWrapper(async(_:any,args:any,context:any) => {
    const deletedUser = await prisma.CustomerUser.delete({
        where: { id:context.user.id },
    });
    return deletedUser;
});

export{
    registerUser,
    getMyProfile,
    updateProfile,
    deleteProfile
}
