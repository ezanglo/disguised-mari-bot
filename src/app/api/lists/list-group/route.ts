import { db } from "@/db";
import { listItems, lists } from "@/db/schema";
import { asc, count, eq, getTableColumns } from "drizzle-orm";

export const dynamic = 'force-static'

export async function GET() {
  try {
    const listGroup = await db
      .select({
        ...getTableColumns(lists),
        itemCount: count(listItems.id),
      }).from(lists)
      .leftJoin(listItems, eq(lists.id, listItems.listId))
      .groupBy(lists.id)
      .orderBy(asc(lists.createdAt));

    return Response.json(listGroup);
  } catch (error) {
    return Response.json({ message: 'Internal Server Error' }, { status: 500 })
  }
}