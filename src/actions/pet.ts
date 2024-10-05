"use server"

import { PetFormSchema } from "@/components/admin/pets/pet-form";
import { DISCORD_EMOTE_URL } from "@/constants/constants";
import { ROUTES } from "@/constants/routes";
import { db } from "@/db";
import { pets } from "@/db/schema";
import { fetchImageBase64, GetDiscordEmoteName } from "@/lib/utils";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { getAuthorizedUser } from "./base";
import { DeleteDiscordEmote, UpdateDiscordEmoteName, UploadDiscordEmote } from "./discord";

export const insertPet = async (payload: PetFormSchema) => {
	const user = await getAuthorizedUser();
	if (!user) {
		throw new Error("Unauthorized");
	}

	const response = await db.transaction(async (trx) => {
		const result = await trx.insert(pets).values({
			...payload,
			createdBy: user.id,
		}).returning().then((res) => res[0] ?? null);

		if (payload.image) {
			let emoteUrl = payload.image
			let imageBase64 = await fetchImageBase64(payload.image);
			if (imageBase64) {
				const emoteName = GetDiscordEmoteName('pet', payload.name, result.id);
				const discordEmote = await UploadDiscordEmote({
					name: emoteName,
					image: imageBase64,
				})
				if (discordEmote?.id) {
					emoteUrl = DISCORD_EMOTE_URL(discordEmote.id);
				}
				
				return trx.update(pets).set({
					discordEmote: discordEmote?.id,
					image: emoteUrl,
					updatedBy: user.id,
				}).where(eq(pets.id, result.id)).returning();
			}
		}

		return result;
	});

	revalidatePath(ROUTES.ADMIN.TRAITS.BASE);
	return response;
}

export const updatePet = async (payload: Partial<PetFormSchema>) => {
	const user = await getAuthorizedUser();
	if (!user) {
		throw new Error("Unauthorized");
	}

	const pet = await db.query.pets.findFirst({
		where: eq(pets.code, payload.code || '')
	})
	if (!pet) {
		throw new Error("Trait type not found");
	}

	const response = await db.transaction(async (trx) => {

		let emoteName = GetDiscordEmoteName('hero', pet.name, pet.id);

		if (pet.discordEmote && payload.name && payload.name !== pet.name) {
			emoteName = GetDiscordEmoteName('hero', payload.name, pet.id);
			await UpdateDiscordEmoteName(pet.discordEmote, emoteName);
		}

		if (payload.image && payload.image.startsWith('data:image/png;base64,')) {

			if (pet.discordEmote) {
				await DeleteDiscordEmote(pet.discordEmote);
			}

			const image = await UploadDiscordEmote({
				name: emoteName,
				image: payload.image,
			})
			if (image?.id) {
				payload.image = DISCORD_EMOTE_URL(image.id)
				payload.discordEmote = image.id;
			}
		}

		return trx.update(pets).set({
			...payload,
			updatedBy: user.id,
		}).where(eq(pets.code, payload.code || '')).returning();
	});

	revalidatePath(ROUTES.ADMIN.TRAITS.BASE);
	return response;
}


export const deletePet = async (id: string) => {
	const user = await getAuthorizedUser();
	if (!user) {
		throw new Error("Unauthorized");
	}

	const pet = await db.query.pets.findFirst({
		where: eq(pets.id, id)
	})
	if (!pet) {
		throw new Error("Trait type not found");
	}

	if (pet.discordEmote) {
		await DeleteDiscordEmote(pet.discordEmote);
	}

	const response = await db.delete(pets).where(eq(pets.id, id)).returning();
	revalidatePath(ROUTES.ADMIN.TRAITS.BASE);
	return response;
}