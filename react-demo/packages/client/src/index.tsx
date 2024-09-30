import React, { useState, useEffect } from 'react';
import { ChakraProvider, Container, Heading, Button } from "@chakra-ui/react";
/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import ReactDOM from "react-dom/client";
import { App } from "./App";
import { setup } from "./mud/setup";
import { MUDProvider } from "./MUDContext";
import mudConfig from "contracts/mud.config";
import { Provider } from "react-redux";
import store from "./store";

// / import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";
import { DAppProvider, Mainnet, Sepolia, ChainId, DEFAULT_SUPPORTED_CHAINS } from "@usedapp/core";
// import { getDefaultProvider } from 'ethers'

import { AdventureLayer as l2 } from './config'

const rootElement = document.getElementById("react-root");
if (!rootElement) throw new Error("React root not found");
const root = ReactDOM.createRoot(rootElement);

const getAddressLink = (explorerUrl: string) => (address: string) => `${explorerUrl}/address/${address}`
const getTransactionLink = (explorerUrl: string) => (txnId: string) => `${explorerUrl}/tx/${txnId}`

const AdventureLayer = {
  chainId: l2.chainId,
  rpcUrl: l2.rpcUrl,
  wssUrl: l2.wssUrl,
  chainName: l2.chainName,
  isTestChain: false,
  isLocalChain: false,
  nativeCurrency: {
    name: 'Ether',
    symbol: 'ETH',
    decimals: 18,
  },
  blockExplorerUrl: l2.blockExplorerUrl,
  getExplorerAddressLink: getAddressLink(l2.blockExplorerUrl),
  getExplorerTransactionLink: getTransactionLink(l2.blockExplorerUrl),
}

const config: any = {
  // readOnlyChainId: Sepolia.chainId,
  readOnlyChainId: Mainnet.chainId,
  readOnlyUrls: {
    [Mainnet.chainId]: Mainnet.rpcUrl,
    [Sepolia.chainId]: Sepolia.rpcUrl,
    [AdventureLayer.chainId]: AdventureLayer.rpcUrl,
  },
  // supportedChains: [ChainId.Mainnet, ChainId.Goerli, ChainId.Kovan, ChainId.Rinkeby, ChainId.Ropsten, ChainId.Arbitrum, ChainId.Sepolia, AdventureLayer.chainId],
  networks: [...DEFAULT_SUPPORTED_CHAINS, AdventureLayer,], // AdventureLocal2
}

// TODO: figure out if we actually want this to be async or if we should render something else in the meantime
setup().then(async (result) => {
  root.render(
    <DAppProvider config={config}>
      <Provider store={store}>
        <ChakraProvider>
          <MUDProvider value={result}>
            <App />
          </MUDProvider>,
        </ChakraProvider>
      </Provider>
    </DAppProvider>
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
