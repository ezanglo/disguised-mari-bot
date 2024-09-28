import { db } from "@/db";
import { listItems, lists } from "@/db/schema";
import { and, asc, eq, getTableColumns } from "drizzle-orm";

export const dynamic = 'force-static'

export async function GET() {
  try {
    const upgradeTypes = await db
      .select({
        ...getTableColumns(listItems),
      }).from(listItems)
      .innerJoin(lists, eq(listItems.listId, lists.id))
      .where(and(
        eq(lists.name, "Upgrade"),
      )).orderBy(asc(listItems.createdAt));

    return Response.json(upgradeTypes);
  } catch (error) {
    return Response.json({ message: 'Internal Server Error' }, { status: 500 })
  }
}