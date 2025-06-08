import { asyncWrapper } from "@/utils/asyncHandler";
import { prisma } from "../lib/prismaClient";
import { Role } from '../enums/Role';
import graphqlFields from 'graphql-fields';
import { buildPrismaQuery } from "@/helpers/prismaQuerybuilder";
import { withCache, withCacheInvalidation } from "@/utils/withCache";

const menuCacheKeyBuilder = (_: any, arg: { id: string }) => [
  'menus:all',
  `menu:${arg.id}`,
];

const menusCacheKeyBuilder = (_: any, arg: {id:string}) => {
  return `menu:${arg.id}`
};

const createMenu = asyncWrapper(async (_: any, arg: {
  businessId: string;
  title: string;
}, context: any) => {
  const { user } = context;
  const newMenu = await prisma.menu.create({
    data: {
      title: arg.title ,   
      businessId: arg.businessId,
    },
    include: {
    items: true, // include related menu items (empty on creation)
    business: {
      select: {
        id: true,
        name: true,
        // add any other business fields you want to include here
       }
     }
    },
  });

  return newMenu;
});

const updateMenu = withCacheInvalidation(
  menuCacheKeyBuilder,
  asyncWrapper(async (_: any, arg: {
    id: string;
    title?: string;
  }, context: any) => {
    const { user } = context;
    const existingMenu = await prisma.menu.findUnique({
      where: { id: arg.id },
    });

    if (!existingMenu) {
      throw new Error('Menu not found');
    }

    const updatedMenu = await prisma.menu.update({
      where: { id: arg.id },
      data: {
        title: arg.title ?? undefined,
      },
    });

    return updatedMenu;
  })
);

const deleteMenu = withCacheInvalidation(
  menuCacheKeyBuilder,
  asyncWrapper(async (_: any, arg: { id: string }, context: any) => {
    const { user } = context;
    const existingMenu = await prisma.menu.findUnique({
      where: { id: arg.id },
    });

    if (!existingMenu) {
      throw new Error('Menu not found');
    }

    await prisma.menu.delete({
      where: { id: arg.id },
    });

    return true;
  })
);

const getMenuById = withCache(
  menusCacheKeyBuilder,
  asyncWrapper(async (_: any, arg: { id: string }, context: any, info: any) => {
    const requestedFields = graphqlFields(info);
    const prismaQuerybuilder = await buildPrismaQuery(requestedFields);
    const menu = await prisma.menu.findUnique({
      where: { id: arg.id },
      include: prismaQuerybuilder,
    });

    if (!menu) {
      throw new Error('Menu not found');
    }

    return menu;
  })
);




export {
    createMenu,
    updateMenu,
    deleteMenu,
    getMenuById,
}