import {
  ApplicationCommandType,
  APIApplicationCommandInteraction,
  APIApplicationCommand,
  APIInteractionResponseChannelMessageWithSource as InteractionResponse,
} from "discord-api-types/v10";

export type Command = {
  data: APIApplicationCommand;
  execute: ExecuteCommand;
};

export type ExecuteCommand = (
  interaction: APIApplicationCommandInteraction
) => InteractionResponse;

export type CommandData = {
  name: string;
  description: string;
  options: CommandOption[];
};

export type CommandOption = {
  name: string;
  description: string;
  type: ApplicationCommandType;
  required: boolean;
  choices: CommandOptionChoice[];
  autoComplete: boolean;
};

export type CommandOptionChoice = {
  name: string;
  value: string;
};
