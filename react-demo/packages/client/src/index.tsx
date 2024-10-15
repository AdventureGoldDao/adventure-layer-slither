import React, { useState, useEffect } from 'react';
/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import ReactDOM from "react-dom/client";
import './index.css';
import { App } from "./App";
import { WalletConnector } from "./Connector";
import { setup, setupCustom } from "./mud/setup";
import { MUDProvider } from "./MUDContext";
import mudConfig from "contracts/mud.config";
import { Provider } from "react-redux";
import store from "./store";
import { shortenAddress, useEthers, useLookupAddress } from "@usedapp/core";

import { ethers } from "ethers";
import {
  ChakraProvider,
  Box,
  Button,
  Text,
  VStack,
  Spinner,
  useToast,
  Heading,
  extendTheme,
} from "@chakra-ui/react";

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
  networks: [...DEFAULT_SUPPORTED_CHAINS, AdventureLayer], // AdventureLocal2
}

// 定制 Chakra 主题，设置为黑白极客风格
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

const Main = () => {
  const { account } = useEthers();
  const [mudSetup, setMudSetup] = useState<any>(null);
  const [walletInfo, setWalletInfo] = useState<any>(null);

  const initializeMUD = async (provider: any, signer: any, address: string) => {
    try {
      // 初始化 MUD 系统，传递 address 并获得返回的 value
      const mudValue = await setupCustom(address);
      setMudSetup(mudValue);

      // https://vitejs.dev/guide/env-and-mode.html
      if (import.meta.env.DEV) {
        const { mount: mountDevTools } = await import("@latticexyz/dev-tools");
        mountDevTools({
          config: mudConfig,
          publicClient: mudValue.network.publicClient,
          walletClient: mudValue.network.walletClient,
          latestBlock$: mudValue.network.latestBlock$,
          storedBlockLogs$: mudValue.network.storedBlockLogs$,
          worldAddress: mudValue.network.worldContract.address,
          worldAbi: mudValue.network.worldContract.abi,
          write$: mudValue.network.write$,
          recsWorld: mudValue.network.world,
        });
      }
    } catch (error) {
      console.error("MUD initialization failed:", error);
    }
  };

  const handleWalletConnect = (provider: any, signer: any, address: string) => {
    setWalletInfo({ provider, signer, address });
    initializeMUD(provider, signer, address);
  };

  return (<ChakraProvider theme={theme}>
    {!walletInfo ? (
      <WalletConnector onConnect={handleWalletConnect} />
    ) : mudSetup ? (
      <MUDProvider value={mudSetup}>
        <App />
      </MUDProvider>
    ) : (
      <Text>Initializing game... Please wait.</Text>
    )}
  </ChakraProvider>)
}

// TODO Replace if we need connect
// root.render(
//   <DAppProvider config={config}>
//     <Provider store={store}>
//       <Main />
//     </Provider>
//   </DAppProvider>
// );

// TODO: figure out if we actually want this to be async or if we should render something else in the meantime
setup().then(async (result) => {
  root.render(
    <DAppProvider config={config}>
      <Provider store={store}>
        <ChakraProvider theme={theme}>

          <MUDProvider value={result}>
            <App />
          </MUDProvider>
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
