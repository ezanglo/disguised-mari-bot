import { db } from "@/db";
import { heroes } from "@/db/schema";

export const dynamic = 'force-static'

export async function GET() {
  try {
    const data = await db.select().from(heroes);
    return Response.json(data);
  } catch (error) {
    return Response.json({ message: 'Internal Server Error' }, { status: 500 })
  }
}