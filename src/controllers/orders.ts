import { asyncWrapper } from "@/utils/asyncHandler";
import { prisma } from "../lib/prismaClient"
import graphqlFields from 'graphql-fields';
import { buildPrismaQuery } from "@/helpers/prismaQuerybuilder";
import { withCache,withCacheInvalidation } from "@/utils/withCache";
import { OrderType } from "@prisma/client";
import { OrderStatus } from "@prisma/client";
import { SortOrder } from "@prisma/client";

const orderCacheKeyBuilder = (_: any, arg: { id: string }) => [
  'orders:all',
  `order:${arg.id}`,
];

const ordersCacheKeyBuilder = (_: any, arg: { id: string }) => {
  return `orders:${arg.id}`;
};

type OrderItemInput = {
  productId: string;
  quantity: number;
  price?: number;
};


const createOrder= asyncWrapper(async(_: any, arg: {
    businessId: string,
    type: OrderType,
    items: OrderItemInput[],
    totalAmount: number,
    customerUserId: string,},
    context: any) => {
    const { businessId, type, items, totalAmount, customerUserId } = arg;
    const { user } = context;
    const itemsCount = items.length;

    const order = await prisma.order.create({
        data: {
            businessId,
            type,
            items,
            itemsCount,
            totalAmount,
            customerUserId,
            status: OrderStatus.PENDING,
        },
    });

    return order;
})

const updateOrderStatus = withCacheInvalidation(
    orderCacheKeyBuilder,
     asyncWrapper(async(_: any, arg: {
    id: string,
    status: OrderStatus
}) => {
    const { id, status } = arg;
    const exisingOrder = await prisma.order.findUnique({
        where: { id: id },
    });
    if (!exisingOrder) {
        throw new Error("Order not found");
    }
    const order = await prisma.order.update({
        where: { id: id },
        data: { status },
    });

    return order;
})
);

const cancelOrder = withCacheInvalidation(
    orderCacheKeyBuilder, 
    asyncWrapper(async(_: any, arg: {
    orderId: string,
}) => {
    const { orderId } = arg;

    const existingOrder = await prisma.order.findUnique({
        where: { id: orderId },
    });
    if (!existingOrder) {
        throw new Error("Order not found");
    }

    const order = await prisma.order.update({
        where: { id: orderId },
        data: { status: OrderStatus.CANCELLED },
    });

    return true;
})
);

const getOrder=withCache(
    ordersCacheKeyBuilder,
    asyncWrapper(async(_: any, arg: { id: string },context: any,info: any) => {
        const { id } = arg;
        const requestedFields = graphqlFields(info);
        const prismaQuery=await buildPrismaQuery(requestedFields);
        const order = await prisma.order.findUnique({
            where: { id },
            include: prismaQuery,
        });

        if (!order) {
            throw new Error("Order not found");
        }

        return order;
    })
);

type OrdersArgs = {
  businessId?: string;
  customerUserId?: string;
  status?: OrderStatus;
  sortOrder?: SortOrder; // "asc" | "desc"
};

const getOrders = withCache(
  ordersCacheKeyBuilder,
  asyncWrapper(
  async (_: any, args: OrdersArgs,context: any, info: any) => {
    const { businessId, customerUserId, status, sortOrder = "DSC" } = args;

    // Ensure either businessId or customerUserId is provided
    if (!businessId && !customerUserId) {
      throw new Error("Either businessId or customerUserId must be provided.");
    }

    // Build where clause dynamically
    const whereClause: any = {
      ...(businessId ? { businessId } : {}),
      ...(customerUserId ? { customerUserId } : {}),
      ...(status ? { status } : {}),
    };
    const requestedFields = graphqlFields(info);
    const prismaQuery=await buildPrismaQuery(requestedFields);
    const orders = await prisma.order.findMany({
      where: whereClause,
      orderBy: {
        createdAt: sortOrder.toLowerCase() as "asc" | "desc",
      },
      include: prismaQuery
    });

    return orders;
  }
));

export {
  createOrder,
  updateOrderStatus,
  cancelOrder,
  getOrder,
  getOrders
}