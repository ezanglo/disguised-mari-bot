"use server"

import { DeleteDiscordEmote, UpdateDiscordEmoteName, UploadDiscordEmote } from "@/actions/discord";
import { auth } from "@/auth";
import { EquipFormSchema } from "@/components/admin/settings/equip-form";
import { ROLES } from "@/constants/discord";
import { ROUTES } from "@/constants/routes";
import { db } from "@/db";
import { equipTypes } from "@/db/schema/types";
import { GetDiscordEmoteName } from "@/lib/utils";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export const insertEquip = async (payload: EquipFormSchema) => {
	const session = await auth();
	const user = session?.user;
	
	if(!user?.roles.includes(ROLES.ADMIN)) {
		throw new Error("Unauthorized");
	}
	
	const response = await db.transaction(async (trx) => {
		const result = await trx.insert(equipTypes).values({
			classType: payload.classType,
			gearType: payload.gearType,
			createdBy: user.id,
		}).returning().then((res) => res[0] ?? null);

		if(payload.image){
			
			const emoteName = GetDiscordEmoteName('equip', payload.classType + payload.gearType, result.id);
			
			const image = await UploadDiscordEmote({
				name: emoteName,
				image: payload.image,
			})
			if(image){
				const emoteUrl = `https://cdn.discordapp.com/emojis/${image.id}.webp`
				return trx.update(equipTypes).set({
					discordEmote: image.id,
					image: emoteUrl,
					updatedBy: user.id,
				}).where(eq(equipTypes.id, result.id)).returning();
			}
		}

		return result;
	});

	revalidatePath(ROUTES.ADMIN.EQUIPS.BASE);
	return response;
}

export const updateEquip = async (payload: EquipFormSchema) => {
	const session = await auth();
	const user = session?.user;
	
	if(!user?.roles.includes(ROLES.ADMIN)) {
		throw new Error("Unauthorized");
	}
	
	const equipType = await db.query.equipTypes.findFirst({
		where: eq(equipTypes.id, payload.id || '')
	})
	if(!equipType){
		throw new Error("Equip type not found");
	}
	
	const response = await db.transaction(async (trx) => {
		
		const emoteName = GetDiscordEmoteName('equip', payload.classType + payload.gearType, equipType.id);
		if(equipType.discordEmote
			&& (payload.classType !== equipType.classType || payload.gearType !== equipType.gearType)
		){
			await UpdateDiscordEmoteName(equipType.discordEmote, emoteName);
		}
		
		if(payload.image && payload.image.startsWith('data:image/png;base64,')) {
			
			if(equipType.discordEmote){
				await DeleteDiscordEmote(equipType.discordEmote);
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
		
		return trx.update(equipTypes).set({
			...payload,
			updatedBy: user.id,
		}).where(eq(equipTypes.id, payload.id || '')).returning();
	});

	revalidatePath(ROUTES.ADMIN.EQUIPS.BASE);
	return response;
}


export const deleteEquip = async (id: string) => {
	const session = await auth();
	const user = session?.user;
	
	if(!user?.roles.includes(ROLES.ADMIN)) {
		throw new Error("Unauthorized");
	}
	
	const equipType = await db.query.equipTypes.findFirst({
		where: eq(equipTypes.id, id)
	})
	if(!equipType){
		throw new Error("Equip type not found");
	}
	
	if(equipType.discordEmote){
		await DeleteDiscordEmote(equipType.discordEmote);
	}
	
	const response = await db.delete(equipTypes).where(eq(equipTypes.id, id)).returning();
	revalidatePath(ROUTES.ADMIN.EQUIPS.BASE);
	return response;
}