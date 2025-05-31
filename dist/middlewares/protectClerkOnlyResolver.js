import { getAuth, clerkClient } from '@clerk/express';
export function protectClerkOnlyResolver(resolver) {
    return async (parent, args, context, info) => {
        if (!context || !context.req) {
            throw new Error("Authentication context is not properly set.");
        }
        const auth = getAuth(context.req);
        if (!auth || !auth.userId) {
            throw new Error("Authentication required.");
        }
        const clerkUser = await clerkClient.users.getUser(auth.userId);
        if (!clerkUser) {
            throw new Error("Clerk user not found.");
        }
        context.clerkUser = {
            id: clerkUser.id,
            email: clerkUser.emailAddresses[0].emailAddress,
            name: clerkUser.fullName,
        };
        return await resolver(parent, args, context, info);
    };
}
