export async function buildPrismaQuery(fields: any) {
  let include: any = {};
  let hasNested = false;

  for (const key in fields) {
    const value = fields[key];
    const isObject = typeof value === "object" && Object.keys(value).length > 0;

    if (isObject) {
      hasNested = true;
      include[key] = {
        include: await buildPrismaQuery(value)
      };
    }
  }

  return hasNested ? include : true;
}
