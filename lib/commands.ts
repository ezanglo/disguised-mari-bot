import hero from "@/commands/hero";
import {
  APIApplicationCommandInteraction as CommandInteraction,
  APIInteractionResponseChannelMessageWithSource as InteractionResponse,
  InteractionResponseType,
  APIEmbed,
} from "discord-api-types/v10";
import { Command } from "./types";

const commands: Command[] = [hero];

export const getCommand = (name: string) => {
  return commands.find((command) => command.data.name === name);
};

export function executeCommand(
  interaction: CommandInteraction
): InteractionResponse | undefined {
  const { name } = interaction.data;
  const command = getCommand(name);
  return command?.execute(interaction);
}

export function generateEmbedResponse(
  embed: APIEmbed & { type?: string }
): InteractionResponse {
  return {
    type: InteractionResponseType.ChannelMessageWithSource,
    data: { embeds: [embed] },
  };
}
