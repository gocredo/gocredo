import { products,
getProductById, 
createProduct, 
updateProduct, 
deleteProduct
} from "@/controllers/Product";
import { protectCustomerResolver } from "@/middlewares/protectCoustumer";
import { protectResolver } from "@/middlewares/protectResolver";
import { Role } from "@prisma/client";

export const productResolvers = {
  Query: {
    product: protectCustomerResolver(getProductById),
    products: protectCustomerResolver(products),
  },
  Mutation: {
    createProduct: protectResolver(createProduct,{ allowedRoles: [Role.ADMIN, Role.BUSINESS_OWNER] }),
    updateProduct: protectResolver(updateProduct,{ allowedRoles: [Role.ADMIN, Role.BUSINESS_OWNER] }),
    deleteProduct: protectResolver(deleteProduct,{ allowedRoles: [Role.ADMIN, Role.BUSINESS_OWNER] }),
  },
};