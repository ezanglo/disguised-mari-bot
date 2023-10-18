import commands from "@/commands";
import { GenerateEmbedResponse } from "@/lib/utils";
import {
  ApplicationCommandOptionType,
  APIApplicationCommandAutocompleteInteraction as AutocompleteInteraction,
  APIApplicationCommandInteraction as CommandInteraction,
  APIApplicationCommandInteractionDataIntegerOption as IntegerOption,
  APIApplicationCommandInteractionDataNumberOption as NumberOption,
  APIApplicationCommandInteractionDataOption as Option,
  APIApplicationCommandInteractionDataStringOption as StringOption,
} from "discord-api-types/v10";

export const reply = async (interaction: CommandInteraction) => {
  const { name } = interaction.data;
  const command = commands[name];
  if (!command) {
    return GenerateEmbedResponse({
      description: `Hero not found ${interaction.user}... try again ? ❌`,
    });
  }

  return command.execute(interaction);
};

export const autocomplete = async (interaction: AutocompleteInteraction) => {
  const { name, options } = interaction.data;
  const command = commands[name];
  const option = options.find(isOptionFocused);
  return command.autocomplete(option?.name);
};

function isOptionFocused(option: Option) {
  switch (option.type) {
    case ApplicationCommandOptionType.String:
      return (option as StringOption).focused;
    case ApplicationCommandOptionType.Integer:
      return (option as IntegerOption).focused;
    case ApplicationCommandOptionType.Number:
      return (option as NumberOption).focused;
    default:
      return false;
  }
}
