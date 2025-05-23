import { asyncWrapper } from "@/utils/asyncHandler";
import { prisma } from "../lib/prismaClient"
import { Role } from '../enums/Role';
import { AppointmentStatus } from "@/enums/AppointmentStatus";

const getAllAppointmentsOfBusiness = asyncWrapper(async (arg: { businessId: string },context:any) => {
    const { clerkUser } = context;
    if (!clerkUser) {
        throw new Error("Unauthorized. Clerk user not found.");
    }
    const user = await prisma.user.findUnique({
        where: { clerkId: clerkUser.id },
    });
    if (!user) {
        throw new Error("User not found.")
    }
    if(user.businessId !== arg.businessId) {
        throw new Error("Unauthorized. You do not have access to this business.");
    }
    const appointments = await prisma.appointment.findMany({
        where: {
            businessId: arg.businessId
        },
        include: {
            user: true,
            branch: true
        }
    });
    return appointments;
});

const getAllAppointmentsOfUser = asyncWrapper(async (arg: { userId: string },context:any) => {
    const { clerkUser } = context;
    if (!clerkUser) {
        throw new Error("Unauthorized. Clerk user not found.");
    }
    const user = await prisma.user.findUnique({
        where: { clerkId: clerkUser.id },
    });
    if (!user) {
        throw new Error("User not found.")
    }
    if(user.id !== arg.userId) {
        throw new Error("Unauthorized. You do not have access to this user.");
    }
    const appointments = await prisma.appointment.findMany({
        where: {
            userId: arg.userId
        },
        include: {
            business: true,
            branch: true
        }
    });
    return appointments;
});

const getAppointmentById = asyncWrapper(async (arg: { id: string },context:any) => {
    const appointment = await prisma.appointment.findUnique({
        where: {
            id: arg.id
        },
        include: {
            business: true,
            branch: true
        }
    });
    return appointment;
});

type CreateAppointmentArgs = {
  customerName: string;
  customerPhone?: string;
  customerEmail?: string;
  dateTime: Date;
  service: string;
  businessId: string;
  branchId?: string;
};

const createAppointment = asyncWrapper(async (arg: CreateAppointmentArgs, context: any) => {
  const { clerkUser } = context;
  if (!clerkUser) throw new Error("Unauthorized");

  const user = await prisma.user.findUnique({ where: { clerkId: clerkUser.id } });
  if (!user || user.businessId !== arg.businessId) {
    throw new Error("Unauthorized");
  }

  const newAppointment = await prisma.appointment.create({
    data: {
      ...arg,
      status: "PENDING"
    }
  });

  return newAppointment;
});

type UpdateAppointmentStatusArgs = {
  appointmentId: string;
  status: AppointmentStatus;
};

const updateAppointmentStatus = asyncWrapper(async (arg: UpdateAppointmentStatusArgs, context: any) => {
  const { clerkUser } = context;
  if (!clerkUser) throw new Error("Unauthorized");

  const appointment = await prisma.appointment.findUnique({ where: { id: arg.appointmentId } });
  if (!appointment) throw new Error("Appointment not found");

  const user = await prisma.user.findUnique({ where: { clerkId: clerkUser.id } });
  if (!user || user.businessId !== appointment.businessId) {
    throw new Error("Unauthorized");
  }

  const updated = await prisma.appointment.update({
    where: { id: arg.appointmentId },
    data: { status: arg.status }
  });

  return updated;
});


type GetAppointmentsByBranchArgs = {
  branchId: string;
};

const getAppointmentsByBranch = asyncWrapper(async (arg: GetAppointmentsByBranchArgs, context: any) => {
  const { clerkUser } = context;
  if (!clerkUser) throw new Error("Unauthorized");

  const user = await prisma.user.findUnique({ where: { clerkId: clerkUser.id } });
  if (!user) throw new Error("Unauthorized");

  const appointments = await prisma.appointment.findMany({
    where: {
      branchId: arg.branchId
    },
    include: {
      business: true,
      user: true
    }
  });

  return appointments;
});


type DeleteAppointmentArgs = {
  id: string;
};

const deleteAppointment = asyncWrapper(async (arg: DeleteAppointmentArgs, context: any) => {
  const { clerkUser } = context;
  if (!clerkUser) throw new Error("Unauthorized");

  const appointment = await prisma.appointment.findUnique({ where: { id: arg.id } });
  if (!appointment) throw new Error("Appointment not found");

  const user = await prisma.user.findUnique({ where: { clerkId: clerkUser.id } });
  if (!user || user.businessId !== appointment.businessId) {
    throw new Error("Unauthorized");
  }

  await prisma.appointment.delete({ where: { id: arg.id } });
  return { message: "Appointment deleted successfully" };
});


type GetUpcomingAppointmentsArgs = {
  businessId: string;
};

const getUpcomingAppointments = asyncWrapper(async (arg: GetUpcomingAppointmentsArgs, context: any) => {
  const { clerkUser } = context;
  if (!clerkUser) throw new Error("Unauthorized");

  const user = await prisma.user.findUnique({ where: { clerkId: clerkUser.id } });
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

export{
    getAllAppointmentsOfBusiness,
    getAllAppointmentsOfUser,
    getAppointmentById,
    createAppointment,
    updateAppointmentStatus,
    getAppointmentsByBranch,
    deleteAppointment,
    getUpcomingAppointments
}