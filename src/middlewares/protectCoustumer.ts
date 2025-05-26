import { getAuth, clerkClient } from '@clerk/express';
import { prisma } from "../lib/prismaClient";

type ResolverFn = (parent: any, args: any, context: any, info: any) => Promise<any>;

export function protectCustomerResolver(resolver: ResolverFn) {
  return async (parent: any, args: any, context: any, info: any) => {
    const auth = getAuth(context.req);

    if (!auth || !auth.userId) {
      throw new Error('Authentication required');
    }

    // Fetch full user details from Clerk using userId
    const clerkUser = await clerkClient.users.getUser(auth.userId);

    if (!clerkUser) {
      throw new Error('User not found in Clerk');
    }

    // Query your DB for your user record by Clerk user ID
    const userInDb = await prisma.user.findUnique({
      where: { clerkId: clerkUser.id },
    });

    if (!userInDb) {
      throw new Error('User not registered in backend');
    }

    // No role checking here for customer

    // Inject user info into context
    context.user = {
      id: userInDb.id,
      clerkId: clerkUser.id,
      email: clerkUser.emailAddresses[0].emailAddress,
      name: clerkUser.fullName,
      businessId: userInDb.businessId,
    };

    return resolver(parent, args, context, info);
  };
}
