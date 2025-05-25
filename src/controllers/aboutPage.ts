import { asyncWrapper } from "@/utils/asyncHandler";
import { prisma } from "@/lib/prismaClient"

const getAboutPage = asyncWrapper(async (_: unknown, args: { businessId: string }, context: any) => {
    const { businessId } = args;
    return await prisma.aboutPage.findUnique({
        where: { businessId },
        include: {
            business: true
        }
    });
})

const createAboutPage = asyncWrapper(async (_: any, args: { businessId: string, description?: string, mission?: string, vision?: string }, context: any) => {
    const { user } = context;
    const { businessId, description, mission, vision } = args;
    if ((user.businessById !== businessId && user.role !== "ADMIN"))
        throw new Error("Unauthorized request");
    if (await prisma.aboutPage.findUnique({ where: { businessId } }))
        throw new Error("About Page for this business is already present")
    
    const newAboutPage = await prisma.aboutPage.create({
        data: {
            ...args
        }
    })
    return newAboutPage

})

const updateAboutPage = asyncWrapper(async (_: unknown, args: { businessId: string, description?: string, mission?: string, vision?: string }, context: any) => {
    const { user } = context;
    const { businessId, description, mission, vision } = args;
    if (user.businessId !== businessId || user.role !== "ADMIN")
        throw new Error("Unauthorized access")
    const dataToUpdate = {
        ...(description !== undefined && { description }),
        ...(mission !== undefined && { mission }),
        ...(vision !== undefined && { vision }),
    };
    const updatedAboutPage = await prisma.aboutPage.update({
        where: { businessId },
        data: {
            ...dataToUpdate
        }
    })

    return updateAboutPage

})


const deleteAboutPage = asyncWrapper(async (_: unknown, args: {Id: string}, context: any) => {
    const { user } = context;
    const {Id} = args;
    const aboutPage = await prisma.aboutPage.findUnique({
        where:{id:Id}
    })
    if((aboutPage?.businessId!==user.businessId) || (user.role!=="ADMIN") )
        throw new Error("Unauthorized access")

    try {
        const deleted=await prisma.aboutPage.delete({
        where:{id:Id}
    })
        return true
    } catch (error) {
        return false
    }
})

export {
    getAboutPage,
    createAboutPage,
    updateAboutPage,
    deleteAboutPage
}


