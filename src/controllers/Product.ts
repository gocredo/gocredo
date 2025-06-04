import { asyncWrapper } from "@/utils/asyncHandler";
import { prisma } from "../lib/prismaClient";
import { Role } from '../enums/Role';
import graphqlFields from 'graphql-fields';
import { buildPrismaQuery } from "@/helpers/prismaQuerybuilder";
import { withCache, withCacheInvalidation } from "@/utils/withCache";

const productCacheKeyBuilder = (_: any, arg: { id: string }) => [
  'products:all',
  `product:${arg.id}`,
];

const productsCacheKeyBuilder = (_: any, args: any) => {
  const keyObject = {
    filter: args.filter ?? {},
    pagination: args.pagination ?? {},
    sort: args.sort ?? {},
  };
  return `products:${JSON.stringify(keyObject)}`;
};


const createProduct = asyncWrapper(async (_: any, arg: {
  businessId: string;
  name: string;
  price: number;
  stock?: number;
  tags?: string[];
  description?: string;
  imageUrl: string;
}, context: any) => {
  const { user } = context;

  if (user.role !== Role.BUSINESS_OWNER && user.role !== Role.ADMIN) {
    throw new Error('Unauthorized: Only business owners or admins can create products');
  }

  const newProduct = await prisma.product.create({
    data: {
      name: arg.name,
      price: arg.price,
      stock: arg.stock ?? 0,  // Use 0 as default if not provided
      tags: arg.tags ? { set: arg.tags } : { set: [] },  // fallback to empty array
      description: arg.description ?? null,
      imageUrl: arg.imageUrl ?? null,
      business: {
        connect: { id: arg.businessId },
      },
    },
  });

  return newProduct;
});


const updateProduct = withCacheInvalidation(
  productCacheKeyBuilder,
  asyncWrapper(async (_: any, arg: {
    id: string;
    name?: string;
    price?: number;
    stock?: number;
    tags?: string[];
    description?: string;
    imageUrl?: string;
  }, context: any) => {
    const { user } = context;
    if (user.role !== Role.BUSINESS_OWNER && user.role !== Role.ADMIN) {
      throw new Error('Unauthorized: Only business owners or admins can update products');
    }

    const updatedProduct = await prisma.product.update({
      where: { id: arg.id },
      data: {
        name: arg.name ?? undefined,
        price: arg.price,
        stock: arg.stock ?? undefined,
        tags: {
          set: arg.tags ?? [],
        },
        description: arg.description ?? undefined,
        imageUrl: arg.imageUrl,
      },
    });

    return updatedProduct;
  })
);

const deleteProduct = withCacheInvalidation(
  productCacheKeyBuilder,
  asyncWrapper(async (_: any, arg: { id: string }, context: any) => {
    const { user } = context;
    if (user.role !== Role.BUSINESS_OWNER && user.role !== Role.ADMIN) {
      throw new Error('Unauthorized: Only business owners or admins can delete products');
    }

    const deletedProduct = await prisma.product.delete({
      where: { id: arg.id },
    });

    return deletedProduct;
  })
);

const getProductById = asyncWrapper(async (_: any, arg: { id: string }, context: any) => {
  const product = await prisma.product.findUnique({
    where: { id: arg.id },
  });

  if (!product) {
    throw new Error('Product not found');
  }

  return product;
});


const products = withCache(
  productsCacheKeyBuilder,
  asyncWrapper(async (_: any, args: {
    filter?: {
      nameContains?: string;
      tagsIn?: string[];
      businessId?: string;
      minPrice?: number;
      maxPrice?: number;
    };
    pagination?: {
      limit?: number;
      offset?: number;
    };
    sort?: {
      field?: 'name' | 'price' | 'createdAt';
      order?: 'ASC' | 'DESC';
    };
  }) => {
    const where: any = {};

    if (args.filter) {
      const { nameContains, tagsIn, businessId, minPrice, maxPrice } = args.filter;

      if (nameContains) {
        where.name = { contains: nameContains, mode: 'insensitive' };
      }
      if (tagsIn) {
        where.tags = { hasSome: tagsIn };
      }
      if (businessId) {
        where.businessId = businessId;
      }
      if (minPrice !== undefined || maxPrice !== undefined) {
        where.price = {};
        if (minPrice !== undefined) where.price.gte = minPrice;
        if (maxPrice !== undefined) where.price.lte = maxPrice;
      }
    }

    const orderBy = args.sort?.field
      ? {
          [args.sort.field]: args.sort.order?.toLowerCase() === 'desc' ? 'desc' : 'asc',
        }
      : undefined;

    return await prisma.product.findMany({
      where,
      skip: args.pagination?.offset ?? 0,
      take: args.pagination?.limit ?? 10,
      orderBy,
    });
  })
);

export {
    createProduct,
    updateProduct,
    deleteProduct,
    getProductById,
    products
}


