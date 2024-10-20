import React from 'react';
/** @jsxImportSource @emotion/react */
import ReactDOM from "react-dom/client";
import './index.css';
import App from "./App";
import { setup } from "./mud/setup";
import { MUDProvider, MUDCustomProvider } from "./MUDContext";
import mudConfig from "contracts/mud.config";
import "./index.css";

import {
  ChakraProvider,
  extendTheme,
} from "@chakra-ui/react";

const theme = extendTheme({
  styles: {
    global: {
      body: {
        bg: "black",
        color: "white",
        fontFamily: "'Courier New', monospace",
      },
    },
  },
  components: {
    Button: {
      baseStyle: {
        _focus: { boxShadow: "none" },
        _hover: { bg: "gray.700" },
      },
    },
    Kbd: {
      baseStyle: {
        color: "#666",
      },
    },
  },
});

const rootElement = document.getElementById("react-root");
if (!rootElement) throw new Error("React root not found");
const root = ReactDOM.createRoot(rootElement);

setup().then(async (result) => {
  root.render(
    <ChakraProvider theme={theme}>
      <MUDCustomProvider value={result}>
        <App />
      </MUDCustomProvider>
    </ChakraProvider>
  );

  // https://vitejs.dev/guide/env-and-mode.html
  if (import.meta.env.DEV) {
    const { mount: mountDevTools } = await import("@latticexyz/dev-tools");
    mountDevTools({
      config: mudConfig,
      publicClient: result.network.publicClient,
      walletClient: result.network.walletClient,
      latestBlock$: result.network.latestBlock$,
      storedBlockLogs$: result.network.storedBlockLogs$,
      worldAddress: result.network.worldContract.address,
      worldAbi: result.network.worldContract.abi,
      write$: result.network.write$,
      recsWorld: result.network.world,
    });
  }
});
