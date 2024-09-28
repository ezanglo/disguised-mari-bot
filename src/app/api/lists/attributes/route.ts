import { db } from "@/db";
import { attributeTypes } from "@/db/schema";

export const dynamic = 'force-static'

export async function GET() {
  try {
    const attributes = await db.select().from(attributeTypes);
    return Response.json(attributes);
  } catch (error) {
    return Response.json({ message: 'Internal Server Error' }, { status: 500 })
  }
}