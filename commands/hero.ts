import { AutoCompleteOption, ExecuteCommand } from "@/lib/types";
import { GenerateEmbedResponse } from "@/lib/utils";
import supabase from "@/services/supabase";
import {
  APIApplicationCommand,
  APIApplicationCommandOptionChoice,
  APIEmbed,
  ApplicationCommandOptionType,
  ApplicationCommandType,
  APIChatInputApplicationCommandInteraction as CommandInteraction,
  InteractionResponseType,
} from "discord-api-types/v10";

const data: APIApplicationCommand = {
  name: "hero",
  description: "Show hero basic recommendations",
  options: [
    {
      name: "hero",
      description: "",
      type: ApplicationCommandOptionType.String,
      required: true,
      autocomplete: true,
    },
  ],
  id: "",
  type: ApplicationCommandType.ChatInput,
  application_id: "",
  default_member_permissions: "",
  version: "",
};

const execute: ExecuteCommand = async (interaction) => {
  const { options } = (interaction as CommandInteraction).data;

  const heroCode = options?.find(
    (option) => option.name === "hero"
  ) as APIApplicationCommandOptionChoice;
  if (!heroCode) {
    return GenerateEmbedResponse({
      description: "Hero is required",
    });
  }

  const { data: hero } = await supabase
    .from("hero")
    .select("*")
    .eq("code", heroCode.value);

  if (!hero || hero.length === 0) {
    return GenerateEmbedResponse({
      description: "Hero Not Found",
    });
  }

  const selectedHero = hero[0];
  const embed: APIEmbed = {
    title: selectedHero.name || "",
    thumbnail: {
      url: hero[0].image || "",
    },
  };

  return {
    type: InteractionResponseType.ChannelMessageWithSource,
    data: {
      embeds: [embed],
    },
  };
};

const autocomplete: AutoCompleteOption = async (option) => {
  let choices = [] as APIApplicationCommandOptionChoice<string>[];
  switch (option) {
    case "hero":
      const { data: heroes } = await supabase.from("hero").select("code");
      if (heroes) {
        choices = heroes?.map(({ code }) => ({
          name: code,
          value: code,
        }));
      }
      break;
  }

  return {
    type: InteractionResponseType.ApplicationCommandAutocompleteResult,
    data: { choices },
  };
};

export default {
  data,
  execute,
  autocomplete,
};
