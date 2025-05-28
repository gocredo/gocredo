import { asyncWrapper } from "@/utils/asyncHandler";
import { prisma } from "@/lib/prismaClient";
import { Role } from "@/enums/Role";
import graphqlFields from "graphql-fields";
import { buildPrismaQuery } from "@/helpers/prismaQuerybuilder";

const getBlog = asyncWrapper(
  async (_: unknown, args: { id: string }, context: any, info: any) => {
    const { id } = args;
    const requestedFields = graphqlFields(info);
    const prismaQuerybuilder = await buildPrismaQuery(requestedFields);

    const blog = await prisma.blog.findUnique({
      where: { id },
      include: prismaQuerybuilder,
    });

    if (!blog) throw new Error("Blog not found");
    console.log('Fetched blog:', blog);
    return blog;
  }
);

const createBlog = asyncWrapper(
  async (
    _: unknown,
    args: {
      businessId: string;
      title: string;
      content: string;
      imageUrl?: string;
    },
    context: any
  ) => {
    const { user } = context;
    const { businessId, title, content, imageUrl } = args;

    if (user.businessId !== businessId && user.role !== Role.ADMIN) {
      throw new Error("Unauthorized: You cannot create a blog for this business");
    }

    const newBlog = await prisma.blog.create({
      data: {
        businessId,
        title,
        content,
        imageUrl: imageUrl ?? null,
        createdAt: new Date(),
      },
    });

    console.log('Created blog:', newBlog);
    return newBlog;
  }
);

const updateBlog = asyncWrapper(
  async (
    _: unknown,
    args: {
      id: string;
      title?: string;
      content?: string;
      imageUrl?: string;
    },
    context: any
  ) => {
    const { user } = context;
    const { id, title, content, imageUrl } = args;

    const blog = await prisma.blog.findUnique({ where: { id } });
    if (!blog) throw new Error("Blog not found");

    if (user.businessId !== blog.businessId && user.role !== Role.ADMIN) {
      throw new Error("Unauthorized: You cannot update this blog");
    }

    const dataToUpdate: any = {};
    if (title !== undefined) dataToUpdate.title = title;
    if (content !== undefined) dataToUpdate.content = content;
    if (imageUrl !== undefined) dataToUpdate.imageUrl = imageUrl;

    const updatedBlog = await prisma.blog.update({
      where: { id },
      data: dataToUpdate,
    });

    console.log('Updated blog:', updatedBlog);
    return updatedBlog;
  }
);

const deleteBlog = asyncWrapper(
  async (_: unknown, args: { id: string }, context: any) => {
    const { user } = context;
    const { id } = args;

    const blog = await prisma.blog.findUnique({ where: { id } });
    if (!blog) throw new Error("Blog not found");

    if (user.businessId !== blog.businessId && user.role !== Role.ADMIN) {
      throw new Error("Unauthorized: You cannot delete this blog");
    }

    await prisma.blog.delete({ where: { id } });
    return true;
  }
);

export { getBlog, createBlog, updateBlog, deleteBlog };