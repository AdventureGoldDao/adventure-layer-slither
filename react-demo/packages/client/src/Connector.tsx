import React, { useState, useEffect } from 'react';
import { ethers } from "ethers";
import {
  Box,
  Button,
  Text,
  VStack,
  Spinner,
  useToast,
  Heading,
  extendTheme,
} from "@chakra-ui/react";
import web3, { Web3 } from 'web3'
// / import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";
import { DAppProvider, Mainnet, Sepolia, ChainId, DEFAULT_SUPPORTED_CHAINS } from "@usedapp/core";
// import { getDefaultProvider } from 'ethers'
import { getNetworkConfig } from "./mud/getNetworkConfig";

async function switchNetwork(targetChainId) {
  try {
    // 尝试切换到目标网络
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: Web3.utils.toHex(targetChainId) }],
    });
  } catch (switchError) {
    // 如果目标网络没有添加到钱包，添加网络
    if (switchError.code === 4902) {
      await addNetwork(targetChainId);
    } else {
      throw switchError;
    }
  }
}

async function addNetwork(chainId) {
  const networkParams = {
    chainId: Web3.utils.toHex(chainId), // 目标网络的 Chain ID
    chainName: 'Adventure Layer Shard', // 目标网络名称
    nativeCurrency: {
      name: 'AGLD',
      symbol: 'AGLD',
      decimals: 18,
    },
    rpcUrls: ['http://34.228.184.10:8587'], // 替换为目标网络的 RPC URL
    // blockExplorerUrls: ['https://sepolia.etherscan.io'], // 替换为区块浏览器 URL
  };

  try {
    await window.ethereum.request({
      method: 'wallet_addEthereumChain',
      params: [networkParams],
    });
  } catch (addError) {
    console.error("Failed to add network:", addError);
  }
}

function HeroHeader() {
  return (
    <VStack spacing={4} mb={8} textAlign="center">
      <Heading color="#f39b4b" fontSize="5xl" fontFamily="Parabole">
        Snake Game
      </Heading>
      <Text color="white" fontSize="xl">
        Powered By <span style={{ color: "#f39b4b", fontFamily: "Parabole" }}>Adventure Layer</span>
      </Text>
    </VStack>
  );
}

export const WalletConnector = ({ onConnect }: { onConnect: Function }) => {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const connectWallet = async () => {
    if (window.ethereum) {
      setLoading(true);
      try {
        const networkConfig = await getNetworkConfig();
        const targetChainId = networkConfig.chainId;
        const web3 = new Web3(window.ethereum);
        const chainId = await web3.eth.getChainId();
        if (chainId !== BigInt(targetChainId)) {
          try {
            await switchNetwork(targetChainId);
          } catch (error) {
            console.error("Failed to switch network:", error);
          }
        }

        await window.ethereum.request({ method: "eth_requestAccounts" });
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const address = await signer.getAddress();
        setWalletAddress(address);

        // 通知父组件钱包已经连接
        onConnect(provider, signer, address);

        toast({
          title: "Wallet Connected",
          description: `Connected to ${address}`,
          status: "success",
          duration: 3000,
          isClosable: true,
          variant: "subtle",
          position: "top",
        });
      } catch (error) {
        toast({
          title: "Connection Failed",
          description: "Failed to connect wallet.",
          status: "error",
          duration: 3000,
          isClosable: true,
          variant: "subtle",
          position: "top",
        });
      } finally {
        setLoading(false);
      }
    } else {
      toast({
        title: "No Ethereum Wallet",
        description: "Please install a wallet extension like MetaMask.",
        status: "warning",
        duration: 3000,
        isClosable: true,
        variant: "subtle",
        position: "top",
      });
    }
  };

  return (
    <Box textAlign="center" mt={10}>
      <HeroHeader />
      {walletAddress ? (
        <Text fontSize="lg" color="green.300">
          Wallet Connected: {walletAddress}
        </Text>
      ) : loading ? (
        <Spinner size="lg" color="green.300" />
      ) : (
        <Button
          onClick={connectWallet}
          bg="black"
          border="1px"
          borderColor="white"
          color="white"
          size="lg"
          _hover={{ bg: "gray.700" }}
        >
          Connect Wallet
        </Button>
      )}
    </Box>
  );
};
