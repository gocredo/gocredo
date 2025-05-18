import { getAllUsers,createUser,updateUser, } from "@/controllers/users";
import { protectClerkOnlyResolver } from "@/middlewares/protectClerkOnlyResolver";
import { protectResolver } from "@/middlewares/protectResolver";
import { getArgumentValues } from "graphql";

export const graphQLResolver = {
    Query: {
        users: getAllUsers,
    },
    Mutation: {
        createUser:protectClerkOnlyResolver(createUser),
        updateUser:protectResolver(updateUser),
        
    },  
};

