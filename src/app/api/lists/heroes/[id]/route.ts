import { db } from "@/db";
import { heroes } from "@/db/schema";
import { eq } from "drizzle-orm";

export const dynamic = 'force-static'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {

    const data = await db.select().from(heroes).where(eq(heroes.code, params.id));

    if (data.length === 0) {
      return Response.json({ message: 'Hero not found' }, { status: 404 });
    }

    return Response.json(data[0]);
  } catch (error) {
    return Response.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}