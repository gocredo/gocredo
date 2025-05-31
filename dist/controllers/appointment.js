import { asyncWrapper } from "@/utils/asyncHandler";
import { prisma } from "../lib/prismaClient";
import graphqlFields from "graphql-fields";
import { buildPrismaQuery } from "@/helpers/prismaQuerybuilder";
// can be retrieved from business only
// const getAllAppointmentsOfBusiness = asyncWrapper(async (arg: { businessId: string },context:any) => {
//     const { clerkUser } = context;
//     if (!clerkUser) {
//         throw new Error("Unauthorized. Clerk user not found.");
//     }
//     const user = await prisma.user.findUnique({
//         where: { clerkId: clerkUser.id },
//     });
//     if (!user) {
//         throw new Error("User not found.")
//     }
//     if(user.businessId !== arg.businessId) {
//         throw new Error("Unauthorized. You do not have access to this business.");
//     }
//     const appointments = await prisma.appointment.findMany({
//         where: {
//             businessId: arg.businessId
//         },
//         include: {
//             branch: true
//         }
//     });
//     return appointments;
// });
//this will be placed in customerUser controller that will require a separate wrapper 
// const getAllAppointmentsOfUser = asyncWrapper(async (arg: { userId: string },context:any) => {
//     const { clerkUser } = context;
//     if (!clerkUser) {
//         throw new Error("Unauthorized. Clerk user not found.");
//     }
//     const user = await prisma.user.findUnique({
//         where: { clerkId: clerkUser.id },
//     });
//     if (!user) {
//         throw new Error("User not found.")
//     }
//     if(user.id !== arg.userId) {
//         throw new Error("Unauthorized. You do not have access to this user.");
//     }
//     const appointments = await prisma.appointment.findMany({
//         where: {
//             userId: arg.userId
//         },
//         include: {
//             business: true,
//             branch: true
//         }
//     });
//     return appointments;
// });
const getAppointmentById = asyncWrapper(async (arg, context, info) => {
    const { user } = context;
    if (!user.businessId)
        throw new Error("user not associated with business");
    const requestedFields = graphqlFields(info);
    const prismaQuerybuilder = await buildPrismaQuery(requestedFields);
    const appointment = await prisma.appointment.findUnique({
        where: {
            id: arg.id
        },
        include: prismaQuerybuilder
    });
    return appointment;
});
const updateAppointmentStatus = asyncWrapper(async (arg, context) => {
    const { user } = context;
    const appointment = await prisma.appointment.findUnique({ where: { id: arg.appointmentId } });
    if (!appointment)
        throw new Error("Appointment not found");
    if (!user || user.businessId !== appointment.businessId) {
        throw new Error("Unauthorized");
    }
    const updated = await prisma.appointment.update({
        where: { id: arg.appointmentId },
        data: { status: arg.status }
    });
    return updated;
});
const deleteAppointment = asyncWrapper(async (arg, context) => {
    const { user } = context;
    if (!user.businessId)
        throw new Error("user not associated with business");
    const appointment = await prisma.appointment.findUnique({ where: { id: arg.id } });
    if (!appointment)
        throw new Error("Appointment not found");
    if (!user || user.businessId !== appointment.businessId) {
        throw new Error("Unauthorized");
    }
    await prisma.appointment.delete({ where: { id: arg.id } });
    return { message: "Appointment deleted successfully" };
});
const getUpcomingAppointments = asyncWrapper(async (arg, context) => {
    const { user } = context;
    if (!user || user.businessId !== arg.businessId) {
        throw new Error("Unauthorized");
    }
    const appointments = await prisma.appointment.findMany({
        where: {
            businessId: arg.businessId,
            dateTime: {
                gte: new Date()
            }
        },
        orderBy: { dateTime: "asc" }
    });
    return appointments;
});
export { getAppointmentById, updateAppointmentStatus, deleteAppointment, getUpcomingAppointments };
