import { asyncWrapper } from "@/utils/asyncHandler";
import { prisma } from "../lib/prismaClient"
import graphqlFields from 'graphql-fields';
import { buildPrismaQuery } from "@/helpers/prismaQuerybuilder";
import { withCache,withCacheInvalidation } from "@/utils/withCache";
import { verifyCaptcha } from "@/middlewares/captcha";

const inquiryCacheKeyBuilder = (_: any, arg: { id: string }) => [
  'inquiries:all',
  `inquiry:${arg.id}`,
];

const inquiriesCacheKeyBuilder = (_: any, arg: { id: string }) => {
  return `inquiries:${arg.id}`;
};

const createInquiry = asyncWrapper(async (_: any, arg: {
  businessId: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  captchaToken: string;
}) => {
  try {
    console.log("Received Create Inquiry Request:", arg);
    await verifyCaptcha(arg.captchaToken);

    console.log("Creating Inquiry:", arg);
    const newInquiry = await prisma.inquiry.create({
      data: {
        businessId: arg.businessId,
        name: arg.name,
        email: arg.email,
        phone: arg.phone,
        message: arg.message,
      },
    });
    console.log("Inquiry Created:", newInquiry);

    return newInquiry;
  } catch (err) {
    console.error("Create Inquiry Error:", err);
    throw new Error("Failed to create inquiry");
  }
});


const updateInquiry = withCacheInvalidation(
    inquiryCacheKeyBuilder,
    asyncWrapper(async (_: any, arg: {
      id: string;
      phone: string;
      name: string;
      email: string;
      message: string;
    }) => {

      const inquiry = await prisma.inquiry.findUnique({
        where: { id: arg.id },
      });
      if(!inquiry) {
        throw new Error(`Inquiry with id ${arg.id} not found`);
      }

      const updatedInquiry = await prisma.inquiry.update({
        where: { id: arg.id },
        data: {
          phone: arg.phone,
          name: arg.name,
          email: arg.email,
          message: arg.message,
        },
      });

      return updatedInquiry;
    })
);

const deleteInquiry = withCacheInvalidation(
    inquiryCacheKeyBuilder,
    asyncWrapper(async (_: any, arg: { id: string }) => {
        const inquiry = await prisma.inquiry.findUnique({
        where: { id: arg.id },
      });
      if(!inquiry) {
        throw new Error(`Inquiry with id ${arg.id} not found`);
      }

      const deletedInquiry = await prisma.inquiry.delete({
        where: { id: arg.id },
      });

      return deletedInquiry;
    })
);

const getInquiry = withCache(
  inquiriesCacheKeyBuilder,
  asyncWrapper(async (_: any, arg: { id: string }, context: any,info: any) => {
    const { user } = context;

   const requestedFields = graphqlFields(info);
   const prismaQuerybuilder = await buildPrismaQuery(requestedFields);

    const inquiry = await prisma.inquiry.findUnique({
      where: { id: arg.id },
      include: prismaQuerybuilder,
    });

    if (!inquiry) {
      throw new Error(`Inquiry with id ${arg.id} not found`);
    }

    return inquiry;
  })
);

export {
  createInquiry,
  updateInquiry,
  deleteInquiry,
  getInquiry,
}