import { clsx, type ClassValue } from "clsx";
import {
  APIEmbed,
  APIInteractionResponseChannelMessageWithSource as InteractionResponse,
  InteractionResponseType,
} from "discord-api-types/v10";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function GenerateEmbedResponse(
  embed: APIEmbed & { type?: string }
): InteractionResponse {
  return {
    type: InteractionResponseType.ChannelMessageWithSource,
    data: { embeds: [embed] },
  };
}
