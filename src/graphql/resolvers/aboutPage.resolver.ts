import { ContextType } from "@/utils/contextForResolver";
export const resolvers = {
  Query:{
    getAboutPage:async(_:unknown, 
      args: { businessId: string }, 
      context:ContextType) => {
        const {prisma}=context;
        const {businessId}=args;

        return await prisma.aboutPage.findUnique({
          where:{businessId}
        });
      }
    },

    Mutation:{
      updateAboutPage: async(_:unknown,
        args:{
          businessId: string;
          description: string;
          mission: string;
          vision: string;
        },
        context:ContextType
      )=>{
          const {prisma}=context;
          const {businessId}=args;

          const existingInfo=await prisma.aboutPage.findUnique({
            where:{businessId}
          })
          if(existingInfo){
            return await prisma.aboutPage.update({
              where:{id:existingInfo.id},
              data:{
                description: args.description,
                mission: args.mission,
                vision: args.vision,
              }
            })
          }

          return await prisma.aboutPage.create({
            data: {
                businessId: args.businessId,
                description: args.description,
                mission: args.mission,
              vision: args.vision,
            },
          })
      }
    }
}