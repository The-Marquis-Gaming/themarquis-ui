import manifest from "./TheMarquis-contracts/l2/GAMEVAULT-Dojo/target/dev/manifest.json";
import { createDojoConfig } from "@dojoengine/core";

export const dojoConfig = createDojoConfig({
  manifest,
});
