import { products,
getProductById, 
createProduct, 
updateProduct, 
deleteProduct
} from "@/controllers/Product";
import { protectCustomerResolver } from "@/middlewares/protectCoustumer";
import { protectResolver } from "@/middlewares/protectResolver";

export const productResolvers = {
  Query: {
    product: protectCustomerResolver(getProductById),
    products: protectCustomerResolver(products),
  },
  Mutation: {
    createProduct: protectResolver(createProduct),
    updateProduct: protectResolver(updateProduct),
    deleteProduct: protectResolver(deleteProduct),
  },
};