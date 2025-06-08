import { createBooking,
    updateBooking,
    deleteBooking,
    getBookingById } from "@/controllers/booking";
import { protectClerkOnlyResolver } from "@/middlewares/protectClerkOnlyResolver";
import { protectResolver } from "@/middlewares/protectResolver";
import { Role } from "@prisma/client";

export const bookingResolvers = {
  Query: {
    booking: protectResolver(getBookingById,{ allowedRoles: [Role.ADMIN, Role.BUSINESS_OWNER,Role.STAFF,Role.CUSTOMER] }),
  },
  Mutation: {
    createBooking: protectResolver(createBooking,{ allowedRoles: [Role.ADMIN, Role.BUSINESS_OWNER,Role.STAFF,Role.CUSTOMER] }),
    updateBooking: protectResolver(updateBooking,{ allowedRoles: [Role.ADMIN, Role.BUSINESS_OWNER,Role.STAFF,Role.CUSTOMER] }),
    deleteBooking: protectResolver(deleteBooking,{ allowedRoles: [Role.ADMIN, Role.BUSINESS_OWNER,Role.STAFF,Role.CUSTOMER] }),
  },
};