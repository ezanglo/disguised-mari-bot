import { db } from "@/db";
import { tierTypes } from "@/db/schema";

export const dynamic = 'force-static'

export async function GET() {
  try {
    const tiers = await db.select().from(tierTypes);
    return Response.json(tiers);
  } catch (error) {
    return Response.json({ message: 'Internal Server Error' }, { status: 500 })
  }
}