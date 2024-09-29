import { db } from "@/db";
import { classTypes } from "@/db/schema";
import { asc } from "drizzle-orm";

export const dynamic = 'force-static'

export async function GET() {
  try {
    const classes = await db.select().from(classTypes).orderBy(asc(classTypes.order));
    return Response.json(classes);
  } catch (error) {
    return Response.json({ message: 'Internal Server Error' }, { status: 500 })
  }
}