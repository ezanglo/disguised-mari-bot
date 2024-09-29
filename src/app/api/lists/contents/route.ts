import { db } from "@/db";
import { listItems, lists } from "@/db/schema";
import { asc, eq, getTableColumns } from "drizzle-orm";

export const dynamic = 'force-static'

export async function GET() {
  try {
    const contents = await db
		.select({
			...getTableColumns(listItems),
		}).from(listItems)
		.innerJoin(lists, eq(listItems.listId, lists.id))
		.where(eq(lists.name, "Content")).orderBy(asc(listItems.createdAt));

    return Response.json(contents);
  } catch (error) {
    return Response.json({ message: 'Internal Server Error' }, { status: 500 })
  }
}