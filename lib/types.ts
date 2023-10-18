import {
  ApplicationCommandType,
  APIApplicationCommand,
  APIInteractionResponseChannelMessageWithSource as InteractionResponse,
  APIApplicationCommandInteraction as CommandInteraction,
  APIApplicationCommandAutocompleteInteraction as AutocompleteInteraction,
  APIApplicationCommandAutocompleteResponse as AutocompleteResponse,
  APIApplicationCommandOptionChoice,
} from "discord-api-types/v10";

export type Command = {
  data: APIApplicationCommand;
  execute: ExecuteCommand;
  autocomplete: AutoCompleteOption;
};

export type ExecuteCommand = (
  interaction: CommandInteraction
) => Promise<InteractionResponse>;

export type AutoCompleteOption = (
  option?: string
) => Promise<AutocompleteResponse>;

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
