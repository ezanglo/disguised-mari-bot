import { ExecuteCommand } from "@/lib/types";
import {
  APIApplicationCommand,
  APIEmbed,
  ApplicationCommandOptionType,
  ApplicationCommandType,
  APIInteractionResponseChannelMessageWithSource as InteractionResponse,
  InteractionResponseType,
} from "discord-api-types/v10";

const data: APIApplicationCommand = {
  name: "hero",
  description: "Show hero basic recommendations",
  options: [
    {
      name: "",
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

const execute: ExecuteCommand = (interaction): InteractionResponse => {
  const embed: APIEmbed = {
    title: "test hero",
  };

  return {
    type: InteractionResponseType.ChannelMessageWithSource,
    data: {
      embeds: [embed],
    },
  };
};

export default {
  data,
  execute,
};
