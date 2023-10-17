import {
  ApplicationCommandOptionType,
  InteractionResponseType,
  APIApplicationCommandAutocompleteInteraction as AutocompleteInteraction,
  APIApplicationCommandAutocompleteResponse as AutocompleteResponse,
  APIApplicationCommandInteractionDataOption as Option,
  APIApplicationCommandInteractionDataStringOption as StringOption,
  APIApplicationCommandInteractionDataIntegerOption as IntegerOption,
  APIApplicationCommandInteractionDataNumberOption as NumberOption,
} from "discord-api-types/v10";
export const heroes = [
  {
    name: "amy",
    value: "amy",
  },
  {
    name: "mari",
    value: "mari",
  },
];

export function getAutoCompleteChoices(
  interaction: AutocompleteInteraction
): AutocompleteResponse {
  const { options } = interaction.data;

  const option = options.find(isFocused);

  let choices;
  if (option) {
    switch (option?.name) {
      case "hero":
        choices = heroes;
    }
  }

  return {
    type: InteractionResponseType.ApplicationCommandAutocompleteResult,
    data: { choices },
  };
}

function isFocused(val: Option) {
  switch (val.type) {
    case ApplicationCommandOptionType.String:
      return (val as StringOption).focused;
    case ApplicationCommandOptionType.Integer:
      return (val as IntegerOption).focused;
    case ApplicationCommandOptionType.Number:
      return (val as NumberOption).focused;
    default:
      return false;
  }
}
