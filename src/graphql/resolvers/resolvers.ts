import { getAllUsers,createUser,updateUser, } from "@/controllers/users";
import {getAllBusinesses,
    createBusiness,
    updateBusiness,
    deleteBusiness,
    usersAllBusinesses,
    getBusinessById,
    getBusinessByIdForAdmin,
    UsersAssociatedWithBusiness} from "@/controllers/business";
import { protectClerkOnlyResolver } from "@/middlewares/protectClerkOnlyResolver";
import { protectResolver } from "@/middlewares/protectResolver";
import { getArgumentValues } from "graphql";

export const graphQLResolver = {
    Query: {
        users: getAllUsers,
        getAllBusinesses: getAllBusinesses,
        getBusinessById: getBusinessById,
        getBusinessByIdForAdmin: protectResolver(getBusinessByIdForAdmin),
        usersAllBusinesses: protectResolver(usersAllBusinesses),
        usersAssociatedWithBusiness: protectResolver(UsersAssociatedWithBusiness),
    },
    Mutation: {
        createUser:protectClerkOnlyResolver(createUser),
        updateUser:protectResolver(updateUser),
        createBusiness: protectClerkOnlyResolver(createBusiness),
        updateBusiness: protectResolver(updateBusiness),
        deleteBusiness: protectResolver(deleteBusiness),
    },  
};

