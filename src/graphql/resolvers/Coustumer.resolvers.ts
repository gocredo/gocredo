import{registerUser,
    getMyProfile,
    updateProfile,
    deleteProfile,
  getAllCustomerUsers} from "@/controllers/CoustumerUser";
import { protectCustomerResolver } from "@/middlewares/protectCoustumer";
import { protectClerkOnlyResolver } from "@/middlewares/protectClerkOnlyResolver";
import { withCache, withCacheInvalidation } from "@/utils/withCache";

export const customerResolvers = {
  Query: {
    customers: protectCustomerResolver(withCache((_,arg,context)=>`customers:${arg.businessId}`,getAllCustomerUsers)),
    customer: protectCustomerResolver(withCache((_,arg,context)=>`customer:${context.user.clerkId}`,getMyProfile)),
  },
  Mutation: {
    createCustomerUser:protectClerkOnlyResolver(registerUser),
    updateCustomerUser: protectCustomerResolver(withCacheInvalidation((_,arg,context)=>[`customer:${context.user.clerkId}`],updateProfile)),
    deleteCustomerUser: protectCustomerResolver(withCacheInvalidation((_,arg,context)=>[`customer:${context.user.clerkId}`],deleteProfile)),
  },
}