type ResolverFn = (...args: any[]) => Promise<any>;

export function asyncWrapper(fn: ResolverFn): ResolverFn {
  return async function wrappedFn(...args) {
    try {
      return await fn(...args);
    } catch (error) {
      // Handle error here or rethrow to be caught by your GraphQL error handler
      console.error("Async error:", error);
      throw error; 
    }
  };
}
