"use server"

import { auth } from "@/auth";
import { ContentFormSchema } from "@/components/admin/contents/content-form";
import { ROLES } from "@/constants/discord";
import { ROUTES } from "@/constants/routes";
import { db } from "@/db";
import { contentPhases } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export const insertContent = async (payload: ContentFormSchema) => {
	const session = await auth();
	const user = session?.user;
	
	if (!user?.roles.includes(ROLES.ADMIN)) {
		throw new Error("Unauthorized");
	}
	
	const response = await db.transaction(async (trx) => {
		return trx.insert(contentPhases).values({
			...payload,
			createdBy: user.id,
		}).returning().then((res) => res[0] ?? null);
	});
	
	revalidatePath(ROUTES.ADMIN.TRAITS.BASE);
	return response;
}

export const updateContent = async (payload: ContentFormSchema) => {
	const session = await auth();
	const user = session?.user;
	
	if (!user?.roles.includes(ROLES.ADMIN)) {
		throw new Error("Unauthorized");
	}
	
	const contentPhase = await db.query.contentPhases.findFirst({
		where: eq(contentPhases.id, payload.id || '')
	})
	if (!contentPhase) {
		throw new Error("Trait type not found");
	}
	
	const response = await db.transaction(async (trx) => {
		return trx.update(contentPhases).set({
			...payload,
			updatedBy: user.id,
		}).where(eq(contentPhases.id, payload.id || '')).returning();
	});
	
	revalidatePath(ROUTES.ADMIN.TRAITS.BASE);
	return response;
}


export const deleteContent = async (id: string) => {
	const session = await auth();
	const user = session?.user;
	
	if (!user?.roles.includes(ROLES.ADMIN)) {
		throw new Error("Unauthorized");
	}
	
	const contentPhase = await db.query.contentPhases.findFirst({
		where: eq(contentPhases.id, id)
	})
	if (!contentPhase) {
		throw new Error("Trait type not found");
	}
	
	const response = await db.delete(contentPhases).where(eq(contentPhases.id, id)).returning();
	revalidatePath(ROUTES.ADMIN.TRAITS.BASE);
	return response;
}