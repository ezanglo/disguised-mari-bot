"use server"

import { DeleteDiscordEmote, UpdateDiscordEmoteName, UploadDiscordEmote } from "@/actions/discord";
import { ClassFormSchema } from "@/components/admin/settings/class-form";
import { ROUTES } from "@/constants/routes";
import { db } from "@/db";
import { classTypes } from "@/db/schema/types";
import { GetDiscordEmoteName, toCode } from "@/lib/utils";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { getAuthorizedUser } from "./base";


export const insertClassType = async (payload: ClassFormSchema) => {
	const user = await getAuthorizedUser();
	if(!user){
    throw new Error("Unauthorized");
	}
	
	const response = await db.transaction(async (trx) => {
		const result = await trx.insert(classTypes).values({
			name: payload.name,
			code: payload.code || toCode(payload.name),
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
				const emoteUrl = `https://cdn.discordapp.com/emojis/${image.id}.webp`
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
	const user = await getAuthorizedUser();
	if(!user){
    throw new Error("Unauthorized");
	}
	
	const classType = await db.query.classTypes.findFirst({
		where: eq(classTypes.id, payload.id || '')
	})
	if(!classType){
		throw new Error("Class type not found");
	}
	
	const response = await db.transaction(async (trx) => {
		const emoteName = GetDiscordEmoteName('class', payload.name, classType.id);
		
		if(classType.discordEmote && payload.name !== classType.name){
			await UpdateDiscordEmoteName(classType.discordEmote, emoteName);
		}
		
		if(payload.image && payload.image.startsWith('data:image/png;base64,')) {
			
			if(classType.discordEmote){
				await DeleteDiscordEmote(classType.discordEmote);
			}
			
			const image = await UploadDiscordEmote({
				name: emoteName,
				image: payload.image,
			})
			if(image){
				payload.image = `https://cdn.discordapp.com/emojis/${image.id}.webp`;
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
	const user = await getAuthorizedUser();
	if(!user){
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