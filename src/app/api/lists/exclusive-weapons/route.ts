import { db } from "@/db";
import { equipTypes, listItems } from "@/db/schema";
import { and, asc, eq, getTableColumns } from "drizzle-orm";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const classType = searchParams.get('classType')

    const whereConditions = [eq(listItems.code, "ew")]
    if (classType) {
      whereConditions.push(eq(equipTypes.classType, classType))
    }
    const exclusiveWeapons = await db
      .select({
        ...getTableColumns(equipTypes),
      }).from(equipTypes)
      .innerJoin(listItems, eq(equipTypes.gearType, listItems.code))
      .where(and(...whereConditions)).orderBy(asc(listItems.createdAt));

    return Response.json(exclusiveWeapons);
  } catch (error) {
    return Response.json({ message: 'Internal Server Error' }, { status: 500 })
  }
}