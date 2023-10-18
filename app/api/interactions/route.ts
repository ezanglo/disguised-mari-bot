import { verifyInteractionRequest } from "@/services/discord/verify-incoming-request";
import {
  InteractionResponseType,
  InteractionType,
} from "discord-api-types/v10";
import { NextResponse } from "next/server";

/**
 * Use edge runtime which is faster, cheaper, and has no cold-boot.
 * If you want to use node runtime, you can change this to `node`, but you'll also have to polyfill fetch (and maybe other things).
 *
 * @see https://nextjs.org/docs/app/building-your-application/rendering/edge-and-nodejs-runtimes
 */
export const runtime = "edge";

// Your public key can be found on your application in the Developer Portal
const DISCORD_APP_PUBLIC_KEY = process.env.DISCORD_APP_PUBLIC_KEY;

/**
 * Handle Discord interactions. Discord will send interactions to this endpoint.
 *
 * @see https://discord.com/developers/docs/interactions/receiving-and-responding#receiving-an-interaction
 */
export async function POST(request: Request) {
  const verifyResult = await verifyInteractionRequest(
    request,
    DISCORD_APP_PUBLIC_KEY!
  );
  if (!verifyResult.isValid || !verifyResult.interaction) {
    return new NextResponse("Invalid request", { status: 401 });
  }
  const { interaction } = verifyResult;

  let response;

  switch (interaction.type) {
    case InteractionType.Ping:
      response = {
        type: InteractionResponseType.Pong,
      };
      break;
    case InteractionType.ApplicationCommand:
      response = await interaction.reply(interaction);
      break;
    case InteractionType.ApplicationCommandAutocomplete:
      response = await interaction.autocomplete(interaction);
      break;
  }

  if (response) {
    return NextResponse.json(response);
  }

  return new NextResponse("Unknown command", { status: 400 });
}
