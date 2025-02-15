/*
 * The supported chains.
 * By default, there are only two chains here:
 *
 * - mudFoundry, the chain running on anvil that pnpm dev
 *   starts by default. It is similar to the viem anvil chain
 *   (see https://viem.sh/docs/clients/test.html), but with the
 *   basefee set to zero to avoid transaction fees.
 * - Redstone, our production blockchain (https://redstone.xyz/)
 * - Garnet, our test blockchain (https://garnetchain.com/))
 *
 */

import { MUDChain, mudFoundry, redstone, garnet } from "@latticexyz/common/chains";

const localNitro: MUDChain = {
    id: 12340000,
    name: "shard",
    nativeCurrency: {
        decimals: 18,
        name: "Shard",
        symbol: "AGLD",
    },
    rpcUrls: {
        default: {
            http: ["http://127.0.0.1:8587"],
            webSocket: ["ws://127.0.0.1:8588"],
        },
    }
};

const Shard1: MUDChain = {
    id: 12340188,
    name: "shard",
    nativeCurrency: {
        decimals: 18,
        name: "Shard",
        symbol: "AGLD",
    },
    rpcUrls: {
        default: {
          http: ["https://slither-devnet.adventurelayer.xyz/shard"],
          webSocket: ["wss://slither-devnet.adventurelayer.xyz/shard"],
        },
    }
};

const Nitro10: MUDChain = {
    id: 12340265,
    name: "shard",
    nativeCurrency: {
        decimals: 18,
        name: "Shard",
        symbol: "AGLD",
    },
    rpcUrls: {
        default: {
          http: ["https://test-game.xuyanzu.com/shard"],
          webSocket: ["wss://test-game.xuyanzu.com/shard"],
        },
    }
};
/*
 * See https://mud.dev/guides/hello-world/add-chain-client
 * for instructions on how to add networks.
 */
export const supportedChains: MUDChain[] = [Shard1,localNitro,Nitro10, mudFoundry];
