import { asyncWrapper } from "@/utils/asyncHandler";
import { prisma } from "../lib/prismaClient";
import graphqlFields from 'graphql-fields';
import { buildPrismaQuery } from "@/helpers/prismaQuerybuilder";
import { withCache,withCacheInvalidation } from "@/utils/withCache";
import { error } from "console";

const bookingCacheKeyBuilder = (_: any, arg: { id: string }) => [
  'bookings:all',
  `booking:${arg.id}`,
];

const bookingsCacheKeyBuilder = (_: any, arg: {id:string}) => {
  return `booking:${arg.id}`
};

const createBooking=asyncWrapper(async(_:any , args:{
    businessId:string,
    dateTime: string,
    customerName: string,
    service: string,},
    context: any
)=>{
    const {user}=context;
    const newBooking=await prisma.booking.create({
        data:{
            businessId : args.businessId,
            dateTime : args.dateTime,
            customerName : args.customerName,
            service : args.service,
        }
    })
    return newBooking;
}
);

const updateBooking=withCacheInvalidation(
    bookingCacheKeyBuilder,
    asyncWrapper(async(_:any , args:{
    id:string,
    dateTime: string,
    customerName: string,
    service: string,},
    context: any
)=>{
    const {user}=context;
    const existingBooking=await prisma.booking.findUnique({
        where:{
            id:args.id,
        }
    })
    if(!existingBooking){
        throw new Error("Booking not found");
    }

    const newBooking=await prisma.booking.update({
        where:{
            id:args.id
        },
        data:{
            dateTime : args.dateTime,
            customerName : args.customerName,
            service : args.service,
        }
    })
    return newBooking;
})
);

const deleteBooking=withCacheInvalidation(
    bookingCacheKeyBuilder,
    asyncWrapper(async(_:any , arg:{
    id:string},
    context: any
)=>{
    const {user}=context;
    const existingBooking=await prisma.booking.findUnique({
        where:{
            id:arg.id,
        }
    })
    if(!existingBooking){
        throw new Error("Booking not found");
    }

    const newBooking=await prisma.booking.delete({
        where:{
            id:arg.id
        },
    })
    return true;
})
);

const getBookingById=withCache(
    bookingsCacheKeyBuilder,
    asyncWrapper(async(_:any , arg:{
    id:string},
    context: any
)=>{
    const booking=await prisma.booking.findUnique({
        where:{
            id:arg.id
        },
    })
    if(!booking){
        throw new Error("Booking does not exists")
    }
    return booking;
})
);

export {
    createBooking,
    updateBooking,
    deleteBooking,
    getBookingById
}

