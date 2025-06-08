import { asyncWrapper } from "@/utils/asyncHandler";
import { prisma } from "../lib/prismaClient"
import graphqlFields from 'graphql-fields';
import { buildPrismaQuery } from "@/helpers/prismaQuerybuilder";
import { withCache,withCacheInvalidation } from "@/utils/withCache";

const propertyCacheKeyBuilder = (_: any, arg: { id: string }) => [
  'properties:all',
  `property:${arg.id}`,
];

const propertiesCacheKeyBuilder = (_: any, arg: { id: string }) => {
  return `properties:${arg.id}`;
};

const createProperty = asyncWrapper(async (_: any, arg: {
  businessId: string;
  title: string;
  description: string;
  price: number;
  location: string;
  imageUrl: string;
}) => {
  const { businessId, title, description, price, location, imageUrl } = arg;

  const property = await prisma.property.create({
    data: {
      title,
      description,
      price,
      location,
      imageUrl,
      business: {
        connect: { id: businessId },
      },
    },
  });

  return property;
});


const updateProperty = withCacheInvalidation(
  propertyCacheKeyBuilder,
  asyncWrapper(async (_: any, arg: {
    id: string;
    title?: string;
    description?: string;
    price?: number;
    location?: string;
    imageUrl?: string;
  }) => {
    const { id} = arg;
    const propertyExists = await prisma.property.findUnique({
      where: { id },
    });
    if (!propertyExists) {
      throw new Error(`Property with id ${id} does not exist.`);
    }

    const property = await prisma.property.update({
      where: { id },
      data: {
        title: arg.title,
        description: arg.description,
        price: arg.price,
        location: arg.location,
        imageUrl: arg.imageUrl,
      },
    });

    return property;
  })
);

const deleteProperty = withCacheInvalidation(
  propertyCacheKeyBuilder,
  asyncWrapper(async (_: any, arg: { id: string }) => {
    const { id } = arg;
    const propertyExists = await prisma.property.findUnique({
      where: { id },
    });
    if (!propertyExists) {
      throw new Error(`Property with id ${id} does not exist.`);
    }
    const property = await prisma.property.delete({
      where: { id },
    });

    return true;
  })
);

const getProperty = withCache(
  propertiesCacheKeyBuilder,
  asyncWrapper(async (_: any, arg: { id: string },context: any ,info: any ) => {
    const { id } = arg;
    const requestedFields = graphqlFields(info);
    const prismaQuerybuilder = await buildPrismaQuery(requestedFields);
    const property = await prisma.property.findUnique({
      where: { id },
      include: prismaQuerybuilder,
    });

    return property;
  })
);  

export{
    createProperty,
    updateProperty,
    deleteProperty,
    getProperty
}