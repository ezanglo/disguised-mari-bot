import { db } from "@/db";
import { traitTypes } from "@/db/schema";

export const dynamic = 'force-static'

export async function GET() {
  try {
    const traits = await db.select().from(traitTypes);
    return Response.json(traits);
  } catch (error) {
    return Response.json({ message: 'Internal Server Error' }, { status: 500 })
  }
}