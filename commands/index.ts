import { Command } from "@/lib/types";
import hero from "./hero";

type Commands = {
  [key: string]: Command;
};

export default {
  hero,
} as Commands;
