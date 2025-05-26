import{registerUser,
    getMyProfile,
    updateProfile,
    deleteProfile} from "@/controllers/CoustumerUser";
import { protectCustomerResolver } from "@/middlewares/protectCoustumer";
import { protectClerkOnlyResolver } from "@/middlewares/protectClerkOnlyResolver";

export const customerResolvers = {
  Query: {
    customer: protectCustomerResolver(getMyProfile),
  },
  Mutation: {
    createCustomerUser:protectClerkOnlyResolver(registerUser),
    updateCustomerProfile: protectCustomerResolver(updateProfile),
    deleteCustomerProfile: protectCustomerResolver(deleteProfile),
  },
}