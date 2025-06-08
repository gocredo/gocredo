import {
    createOrder,
    updateOrderStatus,
    cancelOrder,
    getOrder,
    getOrders
} from "@/controllers/orders";
import { protectResolver } from "@/middlewares/protectResolver";
import { protectCustomerResolver } from "@/middlewares/protectCoustumer";
import {Role} from "@prisma/client"

export const orderResolvers = {
    Query: {
        order: protectResolver(getOrder),
        orders: protectResolver(getOrders),
    },
    Mutation: {
        createOrder: protectCustomerResolver(createOrder),
        updateOrder: protectResolver(updateOrderStatus, { allowedRoles: [Role.ADMIN, Role.BUSINESS_OWNER, Role.STAFF] }),
        deleteOrder: protectResolver(cancelOrder, { allowedRoles: [Role.ADMIN, Role.BUSINESS_OWNER, Role.STAFF] }),
    },
};