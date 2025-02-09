#!/usr/bin/env node
import yargs, { boolean, string } from "yargs";
import { execSync } from "child_process";

interface CommandLineOptions {
  [key: string]: string | string[] | boolean | undefined;
  $0: string;
  network?: string;
  reset?: string | string[] | boolean | undefined;
  fee?: string;
}

function main() {
  const argv = yargs(process.argv.slice(2))
    .option("network", {
      type: "string",
      choices: ["devnet", "sepolia", "mainnet"],
      default: "devnet",
    })
    .option("fee", { type: "string", choices: ["eth", "strk"], default: "eth" })
    .option("reset", {
      type: "boolean",
      description: "Do not reset deployments (keep existing deployments)",
      default: true,
    })
    .demandOption(["network", "fee", "reset"])
    .parseSync() as CommandLineOptions;

  if ((argv._ as string[]).length > 0) {
    console.error(
      `❌ Invalid arguments, only --network, --fee, or --reset/--no-reset can be passed in`
    );
    return;
  }

  try {
    execSync(
      `cd contracts && scarb build && ts-node ../scripts-ts/deploy.ts` +
        ` --network ${argv.network || "devnet"}` +
        ` --fee ${argv.fee || "eth"}` +
        ` ${!argv.reset && "--no-reset "}` +
        ` && ts-node ../scripts-ts/helpers/parse-deployments.ts && cd ..`,
      { stdio: "inherit" }
    );
  } catch (error) {
    console.error("Error during deployment:", error);
  }
}

if (require.main === module) {
  main();
}
