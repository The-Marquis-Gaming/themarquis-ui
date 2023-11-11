"use client";
import React from "react";
import Board from "./internals/Board/board";
import Row from "../components/Row/Row";

import { DojoProvider } from "../DojoContext";
import { setup } from "../dojo/setup";
import { useEffect, useState } from "react";

function Roulette() {
  const [setupResult, setSetupResult] = useState<any>(null);

  useEffect(() => {
    async function setupDojo() {
      const result = await setup();
      setSetupResult(result);
    }
    setupDojo();
  }, []);
  return (
    <Row>
      {setupResult && (
        <DojoProvider value={setupResult}>
          <Board></Board>
        </DojoProvider>
      )}
    </Row>
  );
}

export default Roulette;
