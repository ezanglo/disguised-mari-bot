import { db } from "@/db";
import { listItems, lists } from "@/db/schema";
import { and, asc, eq, getTableColumns } from "drizzle-orm";

export const dynamic = 'force-static'

export async function GET() {
  try {
    const skillTypes = await db
      .select({
        ...getTableColumns(listItems),
      }).from(listItems)
      .innerJoin(lists, eq(listItems.listId, lists.id))
      .where(and(
        eq(lists.name, "Skill"),
      )).orderBy(asc(listItems.order));

    return Response.json(skillTypes);
  } catch (error) {
    return Response.json({ message: 'Internal Server Error' }, { status: 500 })
  }
}