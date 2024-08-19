"use server"

import { DeleteDiscordEmote, UploadDiscordEmote } from "@/actions/discord";
import { auth } from "@/auth";
import { ClassFormSchema } from "@/components/admin/settings/class-form";
import { ROLES } from "@/constants/discord";
import { ROUTES } from "@/constants/routes";
import { db } from "@/db";
import { classTypes } from "@/db/schema/types";
import { GetDiscordEmoteName } from "@/lib/utils";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";


export const insertClassType = async (payload: ClassFormSchema) => {
	const session = await auth();
	const user = session?.user;
	
	if(!user?.roles.includes(ROLES.ADMIN)) {
		throw new Error("Unauthorized");
	}
	
	const response = await db.transaction(async (trx) => {
		const result = await trx.insert(classTypes).values({
			name: payload.name,
			color: payload.color,
			createdBy: user.id,
		}).returning().then((res) => res[0] ?? null);

		if(payload.image){
			
			const emoteName = GetDiscordEmoteName('class', payload.name, result.id);
			
			const image = await UploadDiscordEmote({
				name: emoteName,
				image: payload.image,
			})
			if(image){
				const emoteUrl = `https://cdn.discordapp.com/emojis/${image.id}.webp?size=32&quality=lossless`
				return trx.update(classTypes).set({
					discordEmote: image.id,
					image: emoteUrl,
					updatedBy: user.id,
				}).where(eq(classTypes.id, result.id)).returning();
			}
		}

		return result;
	});

	revalidatePath(ROUTES.ADMIN.SETTINGS.BASE);
	return response;
}

export const updateClassType = async (payload: ClassFormSchema) => {
	const session = await auth();
	const user = session?.user;
	
	if(!user?.roles.includes(ROLES.ADMIN)) {
		throw new Error("Unauthorized");
	}
	
	const classType = await db.query.classTypes.findFirst({
		where: eq(classTypes.id, payload.id || '')
	})
	if(!classType){
		throw new Error("Class type not found");
	}
	
	const response = await db.transaction(async (trx) => {
		if(payload.image && payload.image.startsWith('data:image/png;base64,')) {
			
			if(classType.discordEmote){
				await DeleteDiscordEmote(classType.discordEmote);
			}
			
			const emoteName = GetDiscordEmoteName('class', payload.name, classType.id);
			const image = await UploadDiscordEmote({
				name: emoteName,
				image: payload.image,
			})
			if(image){
				payload.image = `https://cdn.discordapp.com/emojis/${image.id}.webp?size=32&quality=lossless`;
				payload.discordEmote = image.id;
			}
		}
		
		return trx.update(classTypes).set({
			...payload,
			updatedBy: user.id,
		}).where(eq(classTypes.id, payload.id || '')).returning();
	});

	revalidatePath(ROUTES.ADMIN.SETTINGS.BASE);
	return response;
}


export const deleteClassType = async (id: string) => {
	const session = await auth();
	const user = session?.user;
	
	if(!user?.roles.includes(ROLES.ADMIN)) {
		throw new Error("Unauthorized");
	}
	
	const classType = await db.query.classTypes.findFirst({
		where: eq(classTypes.id, id)
	})
	if(!classType){
		throw new Error("Class type not found");
	}
	
	if(classType.discordEmote){
		await DeleteDiscordEmote(classType.discordEmote);
	}
	
	const response = await db.delete(classTypes).where(eq(classTypes.id, id)).returning();
	revalidatePath(ROUTES.ADMIN.SETTINGS.BASE);
	return response;
}