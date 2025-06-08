import { asyncWrapper } from "@/utils/asyncHandler";
import { prisma } from "../lib/prismaClient";
import { Role } from '../enums/Role';
import graphqlFields from 'graphql-fields';
import { buildPrismaQuery } from "@/helpers/prismaQuerybuilder";
import { withCache, withCacheInvalidation } from "@/utils/withCache";

const menuitemInvalidateCacheKeyBuilder = (_: any, arg: { id: string }) => [
  'menus:all',
  `menu:${arg.id}`,
];

function menuitemCacheKeyBuilder(_: any, args: { id: string }) {
  return `menuitem:${args.id}`;
}

const createMenuItem = asyncWrapper(async (_: any, args: { menuId:string,
    name: string,
    price: number,
    imageUrl: string
  }, context: any) => {
  const { menuId, name, price, imageUrl } = args;
  const { user } = context;

  const menuItem = await prisma.menuItem.create({
    data: {
      menuId,
      name,
      price,
      imageUrl,
    },
  });

  return menuItem;
});

const updateMenuItem = withCacheInvalidation(
  menuitemInvalidateCacheKeyBuilder,
  asyncWrapper(async (_: any, args: {
    id: string,
    name: string,
    price: number, 
    imageUrl: string }, context: any) => {
  const { id, name, price, imageUrl } = args;
  const { user } = context;

  const menuItem = await prisma.menuItem.update({
    where: { id },
    data: {
      name,
      price,
      imageUrl,
    },
  });

  return menuItem;
})
);

const deleteMenuItem = withCacheInvalidation(
  menuitemInvalidateCacheKeyBuilder,
  asyncWrapper(async (_: any, args: { id: string }, context: any) => {
    const { id } = args;

    const menuItem = await prisma.menuItem.delete({
      where: { id },
    });

    return menuItem;
  })
);

const getMenuItem = withCache(
  menuitemCacheKeyBuilder,
  asyncWrapper(async (_: any, args: { id: string }, context: any) => {
    const { id } = args;

    const menuItem = await prisma.menuItem.findUnique({
      where: { id },
    });

    if (!menuItem) {
      throw new Error('Menu item not found');
    }

    return menuItem;
  })
);

export {
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
  getMenuItem
}


