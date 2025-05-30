import { Server } from "http";
import { prisma } from "@/lib/prismaClient";
import redis from "@/lib/redis";

export function setupGracefulShutdown(server: Server) {
  let isShuttingDown = false; // Flag to prevent multiple shutdowns
  let forceExitTimeout: NodeJS.Timeout;

  const shutdown = async (signal: string) => {
    if (isShuttingDown) return; // If shutdown already in progress, ignore
    isShuttingDown = true;

    console.log(`[GracefulShutdown] Received signal: ${signal}`);

    // Start a timer to force exit after 10 seconds
    forceExitTimeout = setTimeout(() => {
      console.warn("[GracefulShutdown] Shutdown taking too long, forcing exit.");
      process.exit(1);
    }, 10000);

    try {
      console.log("[GracefulShutdown] Closing HTTP server...");
      server.close(() => {
        console.log("[GracefulShutdown] HTTP server closed.");
      });

      console.log("[GracefulShutdown] Disconnecting from Prisma...");
      await prisma.$disconnect();

      if (redis) {
        console.log("[GracefulShutdown] Disconnecting Redis...");
      }

      console.log("[GracefulShutdown] Cleanup complete. Exiting...");
      clearTimeout(forceExitTimeout); // Cancel forced exit on success
      process.exit(0);
    } catch (err) {
      console.error(
        "[GracefulShutdown] Error during shutdown:",
        (err as Error).stack || err
      );
      clearTimeout(forceExitTimeout);
      process.exit(1);
    }
  };

  // Handle shutdown signals
  process.on("SIGINT", () => shutdown("SIGINT")); // e.g. Ctrl+C
  process.on("SIGTERM", () => shutdown("SIGTERM")); // e.g. Docker stop(killing process)

  process.on("uncaughtException", (err) => {
    console.error(
      "[GracefulShutdown] Uncaught Exception:",
      (err as Error).stack || err
    );
    shutdown("uncaughtException");
  });

  process.on("unhandledRejection", (reason) => {
    console.error(
      "[GracefulShutdown] Unhandled Rejection:",
      reason instanceof Error ? reason.stack : reason
    );
    shutdown("unhandledRejection");
  });

  process.on("exit", (code) => {
    console.log(`[GracefulShutdown] Process exiting with code: ${code}`);
  });
}
