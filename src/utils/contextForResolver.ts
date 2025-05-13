import { PrismaClient } from "@prisma/client";
export interface ContextType {
  prisma: PrismaClient;
}