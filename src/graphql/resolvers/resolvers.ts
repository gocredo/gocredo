import { getAllUsers,createUser,updateUser, } from "@/controllers/users";
import {getAllBusinesses,
    createBusiness,
    updateBusiness,
    deleteBusiness,
    usersAllBusinesses,
    getBusinessById,
    getBusinessByIdForAdmin,
    UsersAssociatedWithBusiness} from "@/controllers/business";
import {
    getAllBranchesOfBusiness,
    createBranch,
    branchUpdate,
    deleteBranch,
    getBranchById
} from "@/controllers/branch";
import { protectClerkOnlyResolver } from "@/middlewares/protectClerkOnlyResolver";
import { protectResolver } from "@/middlewares/protectResolver";
import { getArgumentValues } from "graphql";

export const graphQLResolver = {
    Query: {
        users: getAllUsers,
        businesses: getAllBusinesses,
        getBusinessById: getBusinessById,
        getBusinessByIdForAdmin: protectResolver(getBusinessByIdForAdmin),
        usersAllBusinesses: protectResolver(usersAllBusinesses),
        usersAssociatedWithBusiness: protectResolver(UsersAssociatedWithBusiness),
        getAllBranchesOfBusiness: getAllBranchesOfBusiness,
        getBranchById: getBranchById
    },
    Mutation: {
        createUser: protectClerkOnlyResolver(createUser),
        updateUser: protectResolver(updateUser),
        createBusiness: protectClerkOnlyResolver(createBusiness),
        updateBusiness: protectResolver(updateBusiness),
        deleteBusiness: protectResolver(deleteBusiness),
        createBranch: protectClerkOnlyResolver(createBranch),
        branchUpdate: protectResolver(branchUpdate),
        deleteBranch: protectResolver(deleteBranch),
    },  
};

