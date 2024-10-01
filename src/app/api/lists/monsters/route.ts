import { db } from "@/db";
import { monsters } from "@/db/schema";

export const dynamic = 'force-static'

export async function GET() {
  try {
    const data = await db.select().from(monsters);
    return Response.json(data);
  } catch (error) {
    return Response.json({ message: 'Internal Server Error' }, { status: 500 })
  }
}